import { useState } from 'react'
import DashboardView from './views/DashboardView'
import LeadsView from './views/LeadsView'
import PipelineView from './views/PipelineView'
import ReportsView from './views/ReportsView'
import ActivitiesView from './views/ActivitiesView'

const NAV = [
  { key: 'dashboard', icon: 'fa-gauge',        label: 'Tableau de bord' },
  { key: 'activites', icon: 'fa-list-check',   label: 'Activités'       },
  { key: 'leads',     icon: 'fa-users',         label: 'Leads'           },
  { key: 'pipeline',  icon: 'fa-file-contract', label: 'Pipeline'        },
  { key: 'reports',   icon: 'fa-chart-bar',     label: 'Rapports'        },
]

export default function DemoCRM({ vertical: v, onBack }) {
  const [page, setPage] = useState('dashboard')
  const [leads, setLeads] = useState(() => [...v.leads])

  function updateLeadStatus(idx, statut) {
    setLeads(prev => prev.map((l, i) => i === idx ? { ...l, statut } : l))
  }

  function addLead(lead) {
    setLeads(prev => [...prev, lead])
  }

  const title = {
    dashboard: 'Tableau de bord',
    activites: 'Activités',
    leads:     v.leadsLabel,
    pipeline:  v.pipeline,
    reports:   'Rapports',
  }[page]

  const initials = v.label.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()

  return (
    <div className="crm-layout">
      <aside className="crm-sidebar">
        <div className="sidebar-logo">
          <div className="logo-text">CRM</div>
          <div className="vertical-badge" style={{ background: v.color + '22', color: v.color }}>
            {v.icon} {v.label}
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV.map(n => (
            <button
              key={n.key}
              className={`nav-item${page === n.key ? ' active' : ''}`}
              style={{ '--nav-color': v.color }}
              onClick={() => setPage(n.key)}
            >
              <i className={`fa-solid ${n.icon}`} />
              {n.label === 'Leads' ? v.leadsLabel : n.label === 'Pipeline' ? v.pipeline : n.label}
              {n.key === 'leads' && (
                <span style={{
                  marginLeft: 'auto', fontSize: 10, fontWeight: 700,
                  background: v.color + '33', color: v.color,
                  padding: '1px 6px', borderRadius: 10,
                }}>
                  {leads.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-back">
          <button className="btn-back" onClick={onBack}>
            <i className="fa-solid fa-arrow-left" />
            Changer de secteur
          </button>
        </div>
      </aside>

      <main className="crm-main">
        <div className="crm-topbar">
          <div className="topbar-left">
            <div className="topbar-title">{title}</div>
            <div className="topbar-breadcrumb">{v.icon} {v.label} — Espace démo</div>
          </div>
          <div className="topbar-right">
            <div className="topbar-search">
              <i className="fa-solid fa-magnifying-glass" />
              <input placeholder="Rechercher..." readOnly />
            </div>
            <div className="topbar-demo-badge">Demo</div>
            <div className="topbar-notif">
              <i className="fa-solid fa-bell" style={{ fontSize: 13 }} />
              <span className="notif-dot" />
            </div>
            <div className="topbar-avatar" style={{ background: v.color }}>{initials}</div>
          </div>
        </div>

        <div className="crm-content">
          {page === 'dashboard' && <DashboardView v={v} leads={leads} />}
          {page === 'activites' && <ActivitiesView v={v} />}
          {page === 'leads'     && <LeadsView v={v} leads={leads} onStatusChange={updateLeadStatus} onAddLead={addLead} />}
          {page === 'pipeline'  && <PipelineView v={v} />}
          {page === 'reports'   && <ReportsView v={v} />}
        </div>
      </main>
    </div>
  )
}
