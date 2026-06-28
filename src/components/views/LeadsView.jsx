import { useState } from 'react'

const STATUTS = ['nouveau', 'contacte', 'qualifie', 'interesse', 'converti']

export default function LeadsView({ v }) {
  const [filter, setFilter] = useState('tous')

  const displayed = filter === 'tous' ? v.leads : v.leads.filter(l => l.statut === filter)

  return (
    <>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <button
          style={{ padding: '5px 14px', borderRadius: 20, border: '1px solid var(--border)', background: filter === 'tous' ? v.color : 'transparent', color: filter === 'tous' ? '#fff' : 'var(--text2)', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
          onClick={() => setFilter('tous')}
        >Tous ({v.leads.length})</button>
        {STATUTS.map(s => (
          <button
            key={s}
            style={{ padding: '5px 14px', borderRadius: 20, border: '1px solid var(--border)', background: filter === s ? v.color : 'transparent', color: filter === s ? '#fff' : 'var(--text2)', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
            onClick={() => setFilter(s)}
          >{s}</button>
        ))}
      </div>

      <div className="card">
        <div className="section-title"><i className="fa-solid fa-users" />{v.leadsLabel} ({displayed.length})</div>
        <table className="demo-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Ville</th>
              <th>{v.skill}</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayed.map((l, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{l.nom}</td>
                <td>{l.ville}</td>
                <td>{l.metier}</td>
                <td><span className={`badge badge-${l.statut}`}>{l.statut}</span></td>
                <td>
                  <button style={{ padding: '3px 10px', borderRadius: 6, border: '1px solid var(--border)', background: 'none', color: 'var(--text2)', cursor: 'pointer', fontSize: 11 }}>
                    Qualifier
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
