export default function DashboardView({ v }) {
  const funnel = [
    { label: v.leads, count: 94, pct: 100, color: v.color },
    { label: 'Contactés',  count: 61, pct: 65,  color: '#1a71d4' },
    { label: 'Qualifiés',  count: 38, pct: 40,  color: '#7c3aed' },
    { label: 'Intéressés', count: 22, pct: 23,  color: '#f59e0b' },
    { label: 'Convertis',  count: 11, pct: 12,  color: '#10b981' },
  ]

  return (
    <>
      <div className="kpi-grid">
        {v.kpis.map((k, i) => (
          <div className="kpi-card" key={i} style={{ '--kpi-color': v.color }}>
            <div className="kpi-icon"><i className={`fa-solid ${k.icon}`} /></div>
            <div className="kpi-value">{k.value}</div>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-trend">+{k.trend}% ce mois</div>
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
                  <div className="funnel-fill" style={{ width: `${f.pct}%`, background: f.color }}>
                    <span className="funnel-val">{f.count}</span>
                  </div>
                </div>
              </div>
            ))}
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
        <div className="section-title"><i className="fa-solid fa-clock-rotate-left" />Activité récente</div>
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
            {v.leads.map((l, i) => (
              <tr key={i}>
                <td>{l.nom}</td>
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
