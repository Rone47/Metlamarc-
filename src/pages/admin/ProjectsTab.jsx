import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { formatDate } from '../../lib/billing'
import { PROJECT_STATUS_LABELS } from '../../lib/projects'

const emptyProject = {
  client_id: '',
  title: '',
  service_type: '',
  description: '',
  status: 'planning',
  start_date: '',
  delivered_date: '',
  subdomain_url: '',
  live_url: '',
}

// Falls back to the pre-migration status set so saving still works before
// migration-v2.sql has updated the database's check constraint.
const LEGACY_STATUS_FALLBACK = {
  planning: 'planning',
  in_development: 'in_progress',
  integrations: 'in_progress',
  live: 'completed',
  on_hold: 'on_hold',
}

function ProjectsTab({ clients, projects, onChanged }) {
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyProject)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [clientFilter, setClientFilter] = useState('all')

  const clientName = (clientId) => clients.find((c) => c.id === clientId)?.company_name || 'Unknown client'

  const startAdd = () => {
    setForm({ ...emptyProject, client_id: clients[0]?.id || '' })
    setEditingId(null)
    setFormOpen(true)
    setError(null)
  }

  const startEdit = (project) => {
    setForm({
      client_id: project.client_id,
      title: project.title || '',
      service_type: project.service_type || '',
      description: project.description || '',
      status: project.status || 'planning',
      start_date: project.start_date || '',
      delivered_date: project.delivered_date || '',
      subdomain_url: project.subdomain_url || '',
      live_url: project.live_url || '',
    })
    setEditingId(project.id)
    setFormOpen(true)
    setError(null)
  }

  const handleField = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError(null)

    let attempt = {
      ...form,
      start_date: form.start_date || null,
      delivered_date: form.delivered_date || null,
      subdomain_url: form.subdomain_url || null,
      live_url: form.live_url || null,
    }

    const save = (data) =>
      editingId
        ? supabase.from('projects').update(data).eq('id', editingId)
        : supabase.from('projects').insert(data)

    let { error: saveError } = await save(attempt)
    let usedFallback = false

    // The database hasn't run migration-v2.sql yet (missing subdomain_url
    // column, or the old status check constraint). Degrade gracefully
    // instead of blocking the save entirely.
    if (saveError && /subdomain_url/i.test(saveError.message)) {
      usedFallback = true
      attempt = { ...attempt }
      delete attempt.subdomain_url
      ;({ error: saveError } = await save(attempt))
    }

    if (saveError && /status/i.test(saveError.message) && LEGACY_STATUS_FALLBACK[attempt.status]) {
      usedFallback = true
      attempt = { ...attempt, status: LEGACY_STATUS_FALLBACK[attempt.status] }
      ;({ error: saveError } = await save(attempt))
    }

    setSaving(false)

    if (saveError) {
      setError(saveError.message)
      return
    }

    if (usedFallback) {
      alert(
        'Saved, but your database is missing the latest schema update (subdomain field / new project statuses). ' +
          'Ask your developer to run supabase/migration-v2.sql, then edit this project again to set it fully.',
      )
    }

    setFormOpen(false)
    onChanged()
  }

  const handleDelete = async (project) => {
    if (!confirm(`Delete project "${project.title}"?`)) return
    const { error: deleteError } = await supabase.from('projects').delete().eq('id', project.id)
    if (deleteError) {
      alert(deleteError.message)
      return
    }
    onChanged()
  }

  const visibleProjects =
    clientFilter === 'all' ? projects : projects.filter((p) => p.client_id === clientFilter)

  return (
    <div>
      <div className="section-toolbar">
        <h2>Projects</h2>
        <div className="btn-row">
          <select value={clientFilter} onChange={(event) => setClientFilter(event.target.value)}>
            <option value="all">All clients</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.company_name}
              </option>
            ))}
          </select>
          <button
            className="btn btn-primary"
            type="button"
            onClick={startAdd}
            disabled={clients.length === 0}
            title={clients.length === 0 ? 'Add a client first, then you can create a project for them' : undefined}
          >
            + Add Project
          </button>
        </div>
      </div>

      {clients.length === 0 ? (
        <p className="empty-state">Add a client first before creating projects.</p>
      ) : null}

      {formOpen ? (
        <form className="portal-card form-panel" onSubmit={handleSubmit}>
          <h3>{editingId ? 'Edit project' : 'New project'}</h3>
          {error ? <p className="form-error">{error}</p> : null}
          <div className="form-grid">
            <label>
              Client
              <select name="client_id" value={form.client_id} onChange={handleField} required>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.company_name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Project title
              <input name="title" value={form.title} onChange={handleField} required />
            </label>
            <label>
              Service type
              <input
                name="service_type"
                value={form.service_type}
                onChange={handleField}
                placeholder="e.g. Web Development"
              />
            </label>
            <label>
              Status
              <select name="status" value={form.status} onChange={handleField}>
                {Object.entries(PROJECT_STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Start date
              <input type="date" name="start_date" value={form.start_date} onChange={handleField} />
            </label>
            <label>
              Delivered date
              <input type="date" name="delivered_date" value={form.delivered_date} onChange={handleField} />
            </label>
            <label>
              Subdomain / preview URL
              <input
                name="subdomain_url"
                value={form.subdomain_url}
                onChange={handleField}
                placeholder="https://preview.example.com (while still in development)"
              />
            </label>
            <label>
              Live URL
              <input
                name="live_url"
                value={form.live_url}
                onChange={handleField}
                placeholder="https:// (once fully live)"
              />
            </label>
            <label className="field-span">
              Description
              <textarea name="description" rows="3" value={form.description} onChange={handleField} />
            </label>
          </div>
          <div className="btn-row">
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save Project'}
            </button>
            <button className="btn btn-ghost" type="button" onClick={() => setFormOpen(false)}>
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      <div className="portal-card">
        {visibleProjects.length === 0 ? (
          <p className="empty-state">No projects match this filter yet.</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Client</th>
                  <th>Status</th>
                  <th>Delivered</th>
                  <th>Link</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleProjects.map((project) => (
                  <tr key={project.id}>
                    <td>
                      <strong>{project.title}</strong>
                      {project.service_type ? <div>{project.service_type}</div> : null}
                    </td>
                    <td>{clientName(project.client_id)}</td>
                    <td>
                      <span className={`badge badge-${project.status}`}>{PROJECT_STATUS_LABELS[project.status]}</span>
                    </td>
                    <td>{formatDate(project.delivered_date)}</td>
                    <td>
                      {project.live_url ? (
                        <a href={project.live_url} target="_blank" rel="noreferrer">
                          Live site
                        </a>
                      ) : project.subdomain_url ? (
                        <a href={project.subdomain_url} target="_blank" rel="noreferrer">
                          Preview
                        </a>
                      ) : (
                        'Not yet live'
                      )}
                    </td>
                    <td>
                      <div className="btn-row">
                        <button className="btn btn-ghost btn-sm" type="button" onClick={() => startEdit(project)}>
                          Edit
                        </button>
                        <button className="btn btn-danger btn-sm" type="button" onClick={() => handleDelete(project)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectsTab
