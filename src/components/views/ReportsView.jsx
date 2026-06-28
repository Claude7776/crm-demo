const BAR_DATA = [
  { month: 'Jan', val: 8 }, { month: 'Fév', val: 12 }, { month: 'Mar', val: 9 },
  { month: 'Avr', val: 15 }, { month: 'Mai', val: 18 }, { month: 'Juin', val: 22 },
]
const MAX = Math.max(...BAR_DATA.map(d => d.val))

export default function ReportsView({ v }) {
  return (
    <>
      <div className="grid-2">
        <div className="card">
          <div className="section-title"><i className="fa-solid fa-chart-bar" />Nouvelles conversions / mois</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 120, paddingTop: 8 }}>
            {BAR_DATA.map((d, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ fontSize: 10, color: 'var(--text2)' }}>{d.val}</div>
                <div style={{
                  width: '100%', height: `${(d.val / MAX) * 90}px`,
                  background: v.color, borderRadius: '4px 4px 0 0', opacity: i === BAR_DATA.length - 1 ? 1 : 0.55,
                }} />
                <div style={{ fontSize: 10, color: 'var(--text2)' }}>{d.month}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="section-title"><i className="fa-solid fa-euro-sign" />Chiffre d'affaires</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
            {v.packs.map(p => (
              <div key={p.key} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontSize: 12, color: 'var(--text2)', width: 90, flexShrink: 0 }}>{p.label}</div>
                <div style={{ flex: 1, height: 18, background: 'var(--bg3)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: p.color, width: p.key === 'BUSINESS' ? '60%' : p.key === 'PRO' ? '45%' : '30%', borderRadius: 4 }} />
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: p.color, width: 60, textAlign: 'right' }}>{p.prix}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="section-title"><i className="fa-solid fa-trophy" />Performance commerciale</div>
        <table className="demo-table">
          <thead>
            <tr>
              <th>Commercial</th>
              <th>{v.leads} traités</th>
              <th>Convertis</th>
              <th>Taux</th>
              <th>CA</th>
            </tr>
          </thead>
          <tbody>
            {[
              { nom: 'Alice Martin',  leads: 32, conv: 8,  ca: '1 849 €' },
              { nom: 'Julien Boyer',  leads: 28, conv: 6,  ca: '1 349 €' },
              { nom: 'Sarah Camus',   leads: 41, conv: 11, ca: '2 749 €' },
              { nom: 'Marc Dufour',   leads: 19, conv: 4,  ca: '749 €'  },
            ].map((r, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{r.nom}</td>
                <td>{r.leads}</td>
                <td>{r.conv}</td>
                <td style={{ color: '#10b981', fontWeight: 700 }}>{Math.round((r.conv / r.leads) * 100)}%</td>
                <td style={{ fontWeight: 700 }}>{r.ca}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
