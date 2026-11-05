import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { computeClientStatus, formatMoney } from '../../lib/billing'

const emptyClient = {
  company_name: '',
  contact_name: '',
  contact_email: '',
  contact_phone: '',
  site_url: '',
  notes: '',
}

function ClientsTab({ clients, invoices, projects, onChanged }) {
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyClient)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  const startAdd = () => {
    setForm(emptyClient)
    setEditingId(null)
    setFormOpen(true)
    setError(null)
  }

  const startEdit = (client) => {
    setForm({
      company_name: client.company_name || '',
      contact_name: client.contact_name || '',
      contact_email: client.contact_email || '',
      contact_phone: client.contact_phone || '',
      site_url: client.site_url || '',
      notes: client.notes || '',
    })
    setEditingId(client.id)
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

    const payload = { ...form }
    const query = editingId
      ? supabase.from('clients').update(payload).eq('id', editingId)
      : supabase.from('clients').insert(payload)

    const { error: saveError } = await query
    setSaving(false)

    if (saveError) {
      setError(saveError.message)
      return
    }

    setFormOpen(false)
    onChanged()
  }

  const handleDelete = async (client) => {
    if (!confirm(`Delete ${client.company_name}? This also removes their projects and invoices.`)) return
    const { error: deleteError } = await supabase.from('clients').delete().eq('id', client.id)
    if (deleteError) {
      alert(deleteError.message)
      return
    }
    onChanged()
  }

  const setOverride = async (client, override) => {
    const { error: updateError } = await supabase
      .from('clients')
      .update({ suspension_override: override })
      .eq('id', client.id)
    if (updateError) {
      alert(updateError.message)
      return
    }
    onChanged()
  }

  return (
    <div>
      <div className="section-toolbar">
        <h2>Clients</h2>
        <button className="btn btn-primary" type="button" onClick={startAdd}>
          + Add Client
        </button>
      </div>

      {formOpen ? (
        <form className="portal-card form-panel" onSubmit={handleSubmit}>
          <h3>{editingId ? 'Edit client' : 'New client'}</h3>
          {error ? <p className="form-error">{error}</p> : null}
          <div className="form-grid">
            <label>
              Company name
              <input name="company_name" value={form.company_name} onChange={handleField} required />
            </label>
            <label>
              Contact name
              <input name="contact_name" value={form.contact_name} onChange={handleField} />
            </label>
            <label>
              Contact email
              <input
                type="email"
                name="contact_email"
                value={form.contact_email}
                onChange={handleField}
                placeholder="Used to auto-link their portal login"
              />
            </label>
            <label>
              Contact phone
              <input name="contact_phone" value={form.contact_phone} onChange={handleField} />
            </label>
            <label>
              Live site URL
              <input name="site_url" value={form.site_url} onChange={handleField} placeholder="https://" />
            </label>
            <label className="field-span">
              Notes
              <textarea name="notes" rows="3" value={form.notes} onChange={handleField} />
            </label>
          </div>
          <div className="btn-row">
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save Client'}
            </button>
            <button className="btn btn-ghost" type="button" onClick={() => setFormOpen(false)}>
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      <div className="portal-card">
        {clients.length === 0 ? (
          <p className="empty-state">No clients yet. Add your first client to get started.</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th>Outstanding</th>
                  <th>Projects</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => {
                  const { isSuspended, hasOverdue, outstandingBalance } = computeClientStatus(client, invoices)
                  const projectCount = projects.filter((p) => p.client_id === client.id).length
                  return (
                    <tr key={client.id}>
                      <td>
                        <strong>{client.company_name}</strong>
                        {client.site_url ? (
                          <div>
                            <a href={client.site_url} target="_blank" rel="noreferrer">
                              {client.site_url.replace(/^https?:\/\//, '')}
                            </a>
                          </div>
                        ) : null}
                      </td>
                      <td>
                        {client.contact_name || '—'}
                        {client.contact_email ? <div>{client.contact_email}</div> : null}
                      </td>
                      <td>
                        <span className={`badge badge-${isSuspended ? 'suspended' : 'active'}`}>
                          {isSuspended ? 'Suspended' : 'Active'}
                        </span>
                        {!isSuspended && hasOverdue ? (
                          <div style={{ marginTop: 4 }}>
                            <span className="badge badge-overdue">Kept active (override)</span>
                          </div>
                        ) : null}
                      </td>
                      <td>{formatMoney(outstandingBalance)}</td>
                      <td>{projectCount}</td>
                      <td>
                        <div className="btn-row">
                          <button className="btn btn-ghost btn-sm" type="button" onClick={() => startEdit(client)}>
                            Edit
                          </button>
                          {isSuspended ? (
                            <button
                              className="btn btn-success btn-sm"
                              type="button"
                              onClick={() => setOverride(client, 'force_active')}
                            >
                              Reactivate
                            </button>
                          ) : (
                            <button
                              className="btn btn-danger btn-sm"
                              type="button"
                              onClick={() => setOverride(client, 'force_suspended')}
                            >
                              Suspend
                            </button>
                          )}
                          {client.suspension_override ? (
                            <button
                              className="btn btn-ghost btn-sm"
                              type="button"
                              onClick={() => setOverride(client, null)}
                            >
                              Clear override
                            </button>
                          ) : null}
                          <button className="btn btn-danger btn-sm" type="button" onClick={() => handleDelete(client)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default ClientsTab
