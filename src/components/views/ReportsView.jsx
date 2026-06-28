const PERIODS = {
  '1m':  [{ month: 'Juin', val: 22 }],
  '3m':  [{ month: 'Avr', val: 15 }, { month: 'Mai', val: 18 }, { month: 'Juin', val: 22 }],
  '6m':  [
    { month: 'Jan', val: 8  }, { month: 'Fév', val: 12 }, { month: 'Mar', val: 9  },
    { month: 'Avr', val: 15 }, { month: 'Mai', val: 18 }, { month: 'Juin', val: 22 },
  ],
  '12m': [
    { month: 'Juil', val: 5  }, { month: 'Aoû', val: 6  }, { month: 'Sep', val: 8  },
    { month: 'Oct', val: 10  }, { month: 'Nov', val: 9  }, { month: 'Déc', val: 7  },
    { month: 'Jan', val: 8  }, { month: 'Fév', val: 12 }, { month: 'Mar', val: 9  },
    { month: 'Avr', val: 15 }, { month: 'Mai', val: 18 }, { month: 'Juin', val: 22 },
  ],
}

const TEAM = [
  { nom: 'Alice Martin', leads: 32, conv: 8,  ca: '1 849 €' },
  { nom: 'Julien Boyer', leads: 28, conv: 6,  ca: '1 349 €' },
  { nom: 'Sarah Camus',  leads: 41, conv: 11, ca: '2 749 €' },
  { nom: 'Marc Dufour',  leads: 19, conv: 4,  ca: '749 €'   },
]
const RANK_COLORS = ['#f59e0b', '#9ca3af', '#cd7c4e']

import { useState } from 'react'

export default function ReportsView({ v }) {
  const [period, setPeriod] = useState('6m')
  const data = PERIODS[period]
  const max = Math.max(...data.map(d => d.val))
  const total = data.reduce((s, d) => s + d.val, 0)
  const sorted = [...TEAM].sort((a, b) => b.conv - a.conv)

  const periodLabel = { '1m': 'Ce mois', '3m': '3 mois', '6m': '6 mois', '12m': '12 mois' }

  return (
    <>
      <div className="grid-2">
        <div className="card">
          <div className="section-title" style={{ justifyContent: 'space-between' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <i className="fa-solid fa-chart-bar" />Conversions
            </span>
            <div style={{ display: 'flex', gap: 4 }}>
              {Object.keys(PERIODS).map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  style={{
                    padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                    border: `1px solid ${period === p ? v.color : 'var(--border)'}`,
                    background: period === p ? v.color + '22' : 'none',
                    color: period === p ? v.color : 'var(--text2)',
                    cursor: 'pointer',
                  }}
                >
                  {periodLabel[p]}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 120, paddingTop: 8 }}>
            {data.map((d, i) => {
              const isLast = i === data.length - 1
              const h = Math.round((d.val / max) * 96)
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ fontSize: 10, color: isLast ? v.color : 'var(--text2)', fontWeight: isLast ? 700 : 400 }}>{d.val}</div>
                  <div style={{
                    width: '100%', height: `${h}px`,
                    background: isLast ? v.color : `linear-gradient(180deg, ${v.color}66 0%, ${v.color}22 100%)`,
                    borderRadius: '5px 5px 0 0',
                    border: isLast ? `1px solid ${v.color}` : 'none',
                    transition: 'height .4s ease',
                  }} />
                  <div style={{ fontSize: 9, color: 'var(--text2)' }}>{d.month}</div>
                </div>
              )
            })}
          </div>
          <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text2)' }}>
            <span>Total période : <strong style={{ color: 'var(--text)' }}>{total} conversions</strong></span>
            <span style={{ color: '#10b981', fontWeight: 600 }}>↑ +22% vs précédent</span>
          </div>
        </div>

        <div className="card">
          <div className="section-title"><i className="fa-solid fa-euro-sign" />Répartition du CA</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 4 }}>
            {v.packs.map((p, i) => {
              const pcts = [30, 45, 60]
              return (
                <div key={p.key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}>
                    <span style={{ color: p.color, fontWeight: 600 }}>{p.label}</span>
                    <span style={{ fontWeight: 700 }}>{p.prix}</span>
                  </div>
                  <div style={{ height: 8, background: 'var(--bg3)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pcts[i]}%`, background: p.color, borderRadius: 4, transition: 'width .6s' }} />
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 4 }}>{pcts[i]}% des abonnements actifs</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="section-title"><i className="fa-solid fa-trophy" />Performance commerciale</div>
        <table className="demo-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Commercial</th>
              <th>{v.leadsLabel} traités</th>
              <th>Convertis</th>
              <th>Taux</th>
              <th>CA généré</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r, i) => {
              const taux = Math.round((r.conv / r.leads) * 100)
              return (
                <tr key={i}>
                  <td>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 22, height: 22, borderRadius: '50%', fontSize: 11, fontWeight: 800,
                      background: i < 3 ? RANK_COLORS[i] + '22' : 'var(--bg3)',
                      color: i < 3 ? RANK_COLORS[i] : 'var(--text2)',
                    }}>{i + 1}</span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{r.nom}</td>
                  <td>{r.leads}</td>
                  <td>{r.conv}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 6, background: 'var(--bg3)', borderRadius: 3, overflow: 'hidden', minWidth: 50 }}>
                        <div style={{ height: '100%', width: `${taux}%`, background: taux >= 25 ? '#10b981' : taux >= 20 ? '#f59e0b' : '#6b7280', borderRadius: 3 }} />
                      </div>
                      <span style={{ fontWeight: 700, color: taux >= 25 ? '#10b981' : taux >= 20 ? '#f59e0b' : 'var(--text2)', minWidth: 32 }}>
                        {taux}%
                      </span>
                    </div>
                  </td>
                  <td style={{ fontWeight: 700 }}>{r.ca}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
