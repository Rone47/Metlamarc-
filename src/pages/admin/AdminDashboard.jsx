import { useSearchParams } from 'react-router-dom'
import PortalHeader from '../../components/PortalHeader'
import Icon from '../../components/Icon'
import { useAdminData } from './useAdminData'
import OverviewTab from './OverviewTab'
import ClientsTab from './ClientsTab'
import ProjectsTab from './ProjectsTab'
import InvoicesTab from './InvoicesTab'
import QuotesTab from './QuotesTab'
import '../portal.css'

const tabs = [
  { id: 'overview', label: 'Overview', icon: 'gauge' },
  { id: 'clients', label: 'Clients', icon: 'users' },
  { id: 'projects', label: 'Projects', icon: 'folder' },
  { id: 'quotes', label: 'Pricing & Quotes', icon: 'tag' },
  { id: 'invoices', label: 'Invoices', icon: 'invoice' },
]

function AdminDashboard() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = tabs.some((tab) => tab.id === searchParams.get('tab'))
    ? searchParams.get('tab')
    : 'overview'
  const { clients, projects, invoices, quotes, quotesUnavailable, loading, error, refresh } = useAdminData()

  const setActiveTab = (tabId) => {
    setSearchParams(tabId === 'overview' ? {} : { tab: tabId })
  }

  const activeLabel = tabs.find((tab) => tab.id === activeTab)?.label

  return (
    <div className="portal-shell">
      <PortalHeader tag="Admin" />
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <p className="admin-sidebar-label">Menu</p>
          <nav>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`admin-sidebar-link ${activeTab === tab.id ? 'is-active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon type={tab.icon} />
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="admin-content">
          <div className="portal-page-heading">
            <h1>{activeLabel}</h1>
            <p>Manage client companies, delivered projects, pricing, and billing across all accounts.</p>
          </div>

          {error ? <p className="form-error">{error}</p> : null}

          {loading ? (
            <p className="empty-state">Loading dashboard data…</p>
          ) : (
            <>
              {activeTab === 'overview' && (
                <OverviewTab clients={clients} invoices={invoices} projects={projects} onGoToTab={setActiveTab} />
              )}
              {activeTab === 'clients' && (
                <ClientsTab clients={clients} invoices={invoices} projects={projects} onChanged={refresh} />
              )}
              {activeTab === 'projects' && (
                <ProjectsTab clients={clients} projects={projects} onChanged={refresh} />
              )}
              {activeTab === 'quotes' && (
                <QuotesTab clients={clients} quotes={quotes} quotesUnavailable={quotesUnavailable} onChanged={refresh} />
              )}
              {activeTab === 'invoices' && (
                <InvoicesTab clients={clients} projects={projects} invoices={invoices} onChanged={refresh} />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard
