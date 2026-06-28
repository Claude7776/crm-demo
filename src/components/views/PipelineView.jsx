import { useState } from 'react'

const COLS = [
  { key: 'prospect',  label: 'Prospect',    color: '#6b7280' },
  { key: 'devis',     label: 'Devis envoyé', color: '#1a71d4' },
  { key: 'signature', label: 'Signature',   color: '#7c3aed' },
  { key: 'paiement',  label: 'Paiement',    color: '#f59e0b' },
  { key: 'actif',     label: 'Actif',       color: '#10b981' },
]

const ORDER = COLS.map(c => c.key)

let _id = 20
function uid() { return ++_id }

function buildStages(v) {
  const l = v.leads
  const p = v.packs
  return {
    prospect:  [
      { id: 1, name: l[3]?.nom ?? 'Lead A', pack: p[0].label, montant: p[0].prix, date: '28 juin' },
      { id: 2, name: l[0]?.nom ?? 'Lead B', pack: p[1].label, montant: p[1].prix, date: '27 juin' },
    ],
    devis:     [{ id: 3, name: l[4]?.nom ?? 'Lead C', pack: p[1].label, montant: p[1].prix, date: '26 juin' }],
    signature: [{ id: 4, name: l[1]?.nom ?? 'Lead D', pack: p[2].label, montant: p[2].prix, date: '30 juin' }],
    paiement:  [
      { id: 5, name: l[2]?.nom ?? 'Lead E', pack: p[1].label, montant: p[1].prix, date: '25 juin' },
    ],
    actif: v.dossiers.map((d, i) => ({ id: 10 + i, name: d.client, pack: d.pack, montant: d.prix, date: 'En cours' })),
  }
}

function parseAmount(str) {
  return parseFloat(str.replace(/[^\d]/g, '')) / 100 || parseFloat(str.replace(/[^\d,]/g, '').replace(',', '.')) || 0
}

export default function PipelineView({ v }) {
  const [stages, setStages] = useState(() => buildStages(v))

  function advance(fromKey, cardId) {
    const fromIdx = ORDER.indexOf(fromKey)
    if (fromIdx >= ORDER.length - 1) return
    const toKey = ORDER[fromIdx + 1]
    setStages(prev => {
      const card = prev[fromKey].find(c => c.id === cardId)
      return {
        ...prev,
        [fromKey]: prev[fromKey].filter(c => c.id !== cardId),
        [toKey]: [...prev[toKey], { ...card, date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) }],
      }
    })
  }

  function recule(fromKey, cardId) {
    const fromIdx = ORDER.indexOf(fromKey)
    if (fromIdx <= 0) return
    const toKey = ORDER[fromIdx - 1]
    setStages(prev => {
      const card = prev[fromKey].find(c => c.id === cardId)
      return {
        ...prev,
        [fromKey]: prev[fromKey].filter(c => c.id !== cardId),
        [toKey]: [...prev[toKey], card],
      }
    })
  }

  return (
    <>
      <div style={{ marginBottom: 18, fontSize: 13, color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <i className="fa-solid fa-diagram-project" style={{ color: v.color }} />
        {v.pipeline} — vue Kanban
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text2)' }}>
          {Object.values(stages).flat().length} dossiers au total
        </span>
      </div>

      <div className="pipeline-cols">
        {COLS.map((col, colIdx) => {
          const list = stages[col.key] ?? []
          const total = list.reduce((s, c) => s + parseAmount(c.montant), 0)
          return (
            <div className="pipeline-col" key={col.key}>
              <div className="pipeline-col-header" style={{ background: col.color + '22', color: col.color }}>
                {col.label}
                <span style={{ opacity: .65 }}> ({list.length})</span>
              </div>

              {list.map(card => (
                <div className="pipeline-card" key={card.id}>
                  <div className="pc-name">{card.name}</div>
                  <div className="pc-meta">{card.pack}</div>
                  <div className="pc-amount" style={{ color: col.color }}>{card.montant}</div>
                  <div className="pc-date">
                    <i className="fa-regular fa-calendar" style={{ marginRight: 4 }} />
                    {card.date}
                  </div>
                  <div style={{ display: 'flex', gap: 5, marginTop: 10 }}>
                    {colIdx > 0 && (
                      <button
                        onClick={() => recule(col.key, card.id)}
                        title="Étape précédente"
                        style={{ flex: 1, padding: '4px 0', borderRadius: 6, border: '1px solid var(--border)', background: 'none', color: 'var(--text2)', cursor: 'pointer', fontSize: 11 }}
                      >
                        ←
                      </button>
                    )}
                    {colIdx < ORDER.length - 1 && (
                      <button
                        onClick={() => advance(col.key, card.id)}
                        style={{
                          flex: 2, padding: '4px 8px', borderRadius: 6,
                          border: `1px solid ${col.color}`,
                          background: col.color + '18', color: col.color,
                          cursor: 'pointer', fontSize: 11, fontWeight: 600,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                        }}
                      >
                        {COLS[colIdx + 1].label} →
                      </button>
                    )}
                    {colIdx === ORDER.length - 1 && (
                      <span style={{ fontSize: 11, color: '#10b981', fontWeight: 600, padding: '4px 0' }}>
                        ✓ Actif
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {list.length === 0 && (
                <div style={{ textAlign: 'center', color: 'var(--text3)', fontSize: 12, padding: '20px 0' }}>
                  Aucun dossier
                </div>
              )}

              {list.length > 0 && (
                <div className="pipeline-col-total">
                  {total.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <div className="section-title"><i className="fa-solid fa-file-contract" />{v.projects} récents</div>
        <table className="demo-table">
          <thead>
            <tr>
              <th>Référence</th>
              <th>Client</th>
              <th>Pack</th>
              <th>Statut</th>
              <th>Prix</th>
            </tr>
          </thead>
          <tbody>
            {v.dossiers.map((d, i) => (
              <tr key={i}>
                <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text2)' }}>{d.ref}</td>
                <td style={{ fontWeight: 600 }}>{d.client}</td>
                <td>{d.pack}</td>
                <td>
                  <span className={`badge ${d.statut === 'ACTIF' ? 'badge-actif' : 'badge-pending'}`}>
                    {d.statut === 'ACTIF' ? 'Actif' : 'En signature'}
                  </span>
                </td>
                <td style={{ fontWeight: 700 }}>{d.prix}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
