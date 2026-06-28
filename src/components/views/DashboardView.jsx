const SPARKS = [
  '0,20 10,16 20,18 30,11 40,9 50,5 60,1',
  '0,19 10,14 20,16 30,10 40,8 50,4 60,1',
  '0,22 10,17 20,15 30,13 40,9 50,5 60,2',
  '0,20 10,15 20,17 30,10 40,7 50,4 60,1',
]

const AVATAR_COLORS = ['#1a71d4', '#7c3aed', '#f59e0b', '#10b981', '#ef4444']

const STATUT_ORDER = ['nouveau', 'contacte', 'qualifie', 'interesse', 'converti']

function initials(nom) {
  return nom.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

export default function DashboardView({ v, leads }) {
  const total = leads.length

  const countFrom = (statuts) => leads.filter(l => statuts.includes(l.statut)).length

  const funnel = [
    { label: v.leadsLabel, count: total, color: v.color   },
    { label: 'Contactés',  count: countFrom(['contacte', 'qualifie', 'interesse', 'converti']), color: '#1a71d4' },
    { label: 'Qualifiés',  count: countFrom(['qualifie', 'interesse', 'converti']),             color: '#7c3aed' },
    { label: 'Intéressés', count: countFrom(['interesse', 'converti']),                         color: '#f59e0b' },
    { label: 'Convertis',  count: countFrom(['converti']),                                      color: '#10b981' },
  ].map(f => ({ ...f, pct: total > 0 ? Math.round((f.count / total) * 100) : 0 }))

  const recent = [...leads].sort((a, b) => STATUT_ORDER.indexOf(b.statut) - STATUT_ORDER.indexOf(a.statut))

  return (
    <>
      <div className="kpi-grid">
        {v.kpis.map((k, i) => (
          <div className="kpi-card" key={i} style={{ '--kpi-color': v.color }}>
            <div className="kpi-icon"><i className={`fa-solid ${k.icon}`} /></div>
            <div className="kpi-value">{i === 0 ? leads.length + 137 : k.value}</div>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-trend">
              <i className="fa-solid fa-arrow-trend-up" style={{ fontSize: 10 }} />
              +{k.trend}% ce mois
            </div>
            <div className="kpi-sparkline">
              <svg viewBox="0 0 60 24" style={{ width: '100%', height: 22 }}>
                <polyline
                  points={SPARKS[i]}
                  fill="none"
                  stroke={v.color}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="section-title"><i className="fa-solid fa-funnel" />Entonnoir de conversion</div>
          <div className="funnel">
            {funnel.map((f, i) => (
              <div className="funnel-row" key={i}>
                <div className="funnel-label">{f.label}</div>
                <div className="funnel-track">
                  <div
                    className="funnel-fill"
                    style={{ width: `${Math.max(f.pct, f.count > 0 ? 8 : 0)}%`, background: f.color, transition: 'width .5s ease' }}
                  >
                    <span className="funnel-val">{f.count}</span>
                  </div>
                </div>
                <div className="funnel-pct">{f.pct}%</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border)', fontSize: 11, color: 'var(--text2)', display: 'flex', justifyContent: 'space-between' }}>
            <span>Taux de conversion global</span>
            <strong style={{ color: '#10b981' }}>
              {total > 0 ? Math.round((funnel[4].count / total) * 100) : 0}%
            </strong>
          </div>
        </div>

        <div className="card">
          <div className="section-title"><i className="fa-solid fa-box" />Offres disponibles</div>
          <div className="packs-grid">
            {v.packs.map(p => (
              <div className="pack-card" key={p.key} style={{ '--pack-color': p.color }}>
                <div className="pack-name">{p.label}</div>
                <div className="pack-price">{p.prix}</div>
                <div className="pack-period">/ mois</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="section-title" style={{ justifyContent: 'space-between' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className="fa-solid fa-clock-rotate-left" />
            {v.leadsLabel} récents
          </span>
          <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text2)' }}>{leads.length} au total</span>
        </div>
        <table className="demo-table">
          <thead>
            <tr>
              <th>{v.lead}</th>
              <th>Ville</th>
              <th>{v.skill}</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((l, i) => (
              <tr key={i}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="contact-avatar" style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>
                      {initials(l.nom)}
                    </div>
                    <span style={{ fontWeight: 600 }}>{l.nom}</span>
                  </div>
                </td>
                <td>{l.ville}</td>
                <td>{l.metier}</td>
                <td><span className={`badge badge-${l.statut}`}>{l.statut}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
