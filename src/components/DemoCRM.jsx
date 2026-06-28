import { useState } from 'react'
import DashboardView from './views/DashboardView'
import LeadsView from './views/LeadsView'
import PipelineView from './views/PipelineView'
import ReportsView from './views/ReportsView'
import ActivitiesView from './views/ActivitiesView'

const NAV = [
  { key: 'dashboard', icon: 'fa-gauge',         label: 'Tableau de bord' },
  { key: 'activites', icon: 'fa-list-check',    label: 'Activités'       },
  { key: 'leads',     icon: 'fa-users',          label: 'Leads'           },
  { key: 'pipeline',  icon: 'fa-file-contract',  label: 'Pipeline'        },
  { key: 'reports',   icon: 'fa-chart-bar',      label: 'Rapports'        },
]

export default function DemoCRM({ vertical: v, onBack }) {
  const [page, setPage] = useState('dashboard')

  const title = {
    dashboard: 'Tableau de bord',
    activites: 'Activités',
    leads:     v.leadsLabel,
    pipeline:  v.pipeline,
    reports:   'Rapports',
  }[page]

  return (
    <div className="crm-layout">
      <aside className="crm-sidebar">
        <div className="sidebar-logo">
          <div className="logo-text">Proje<span>oo</span></div>
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
          <div className="topbar-title">{title}</div>
          <div className="topbar-demo-badge">Demo</div>
        </div>
        <div className="crm-content">
          {page === 'dashboard' && <DashboardView v={v} />}
          {page === 'activites' && <ActivitiesView v={v} />}
          {page === 'leads'     && <LeadsView v={v} />}
          {page === 'pipeline'  && <PipelineView v={v} />}
          {page === 'reports'   && <ReportsView v={v} />}
        </div>
      </main>
    </div>
  )
}
