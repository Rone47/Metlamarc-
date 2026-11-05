import { computeClientStatus, formatMoney, GRACE_PERIOD_DAYS } from '../../lib/billing'

function OverviewTab({ clients, invoices, projects, onGoToTab }) {
  const clientStatuses = clients.map((client) => ({
    client,
    ...computeClientStatus(client, invoices),
  }))

  const suspendedCount = clientStatuses.filter((c) => c.isSuspended).length
  const overdueClients = clientStatuses.filter((c) => c.hasOverdue)
  const totalOutstanding = clientStatuses.reduce((sum, c) => sum + c.outstandingBalance, 0)
  const activeProjects = projects.filter((p) => p.status !== 'live' && p.status !== 'on_hold').length

  return (
    <div>
      <div className="stat-grid">
        <div className="stat-tile">
          <strong>{clients.length}</strong>
          <span>Total clients</span>
        </div>
        <div className={`stat-tile ${suspendedCount > 0 ? 'is-warning' : ''}`}>
          <strong>{suspendedCount}</strong>
          <span>Suspended for non-payment</span>
        </div>
        <div className="stat-tile">
          <strong>{activeProjects}</strong>
          <span>Active projects</span>
        </div>
        <div className="stat-tile is-warning">
          <strong>{formatMoney(totalOutstanding)}</strong>
          <span>Total outstanding balance</span>
        </div>
      </div>

      <div className="portal-card">
        <div className="section-toolbar">
          <h2>Accounts needing attention</h2>
          <button className="btn btn-ghost btn-sm" type="button" onClick={() => onGoToTab('clients')}>
            View all clients
          </button>
        </div>

        {overdueClients.length === 0 ? (
          <p className="empty-state">No overdue accounts right now — everything is current.</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Status</th>
                  <th>Overdue invoices</th>
                  <th>Outstanding</th>
                </tr>
              </thead>
              <tbody>
                {overdueClients.map(({ client, isSuspended, overdueInvoices, outstandingBalance }) => (
                  <tr key={client.id}>
                    <td>
                      <strong>{client.company_name}</strong>
                    </td>
                    <td>
                      <span className={`badge badge-${isSuspended ? 'suspended' : 'active'}`}>
                        {isSuspended ? 'Suspended' : 'Active (override)'}
                      </span>
                    </td>
                    <td>{overdueInvoices.length}</td>
                    <td>{formatMoney(outstandingBalance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="form-note">
          Accounts auto-suspend once an unpaid invoice is more than {GRACE_PERIOD_DAYS} days past due, unless you've
          set a manual override on the Clients tab.
        </p>
      </div>
    </div>
  )
}

export default OverviewTab
