const COLS = [
  { key: 'prospect',   label: 'Prospect',   color: '#6b7280' },
  { key: 'devis',      label: 'Devis envoyé', color: '#1a71d4' },
  { key: 'signature',  label: 'Signature',  color: '#7c3aed' },
  { key: 'paiement',   label: 'Paiement',   color: '#f59e0b' },
  { key: 'actif',      label: 'Actif',      color: '#10b981' },
]

const MOCK_CARDS = {
  prospect:  [{ name: 'Lead #001', pack: 'Starter', montant: '99,99 €' }, { name: 'Lead #002', pack: 'Pro', montant: '149,99 €' }],
  devis:     [{ name: 'Lead #003', pack: 'Pro', montant: '149,99 €' }],
  signature: [{ name: 'Lead #004', pack: 'Business', montant: '451,99 €' }],
  paiement:  [{ name: 'Lead #005', pack: 'Pro', montant: '149,99 €' }, { name: 'Lead #006', pack: 'Starter', montant: '99,99 €' }],
  actif:     [{ name: 'Client #007', pack: 'Business', montant: '451,99 €' }, { name: 'Client #008', pack: 'Pro', montant: '149,99 €' }, { name: 'Client #009', pack: 'Starter', montant: '99,99 €' }],
}

export default function PipelineView({ v }) {
  return (
    <>
      <div style={{ marginBottom: 16, fontSize: 13, color: 'var(--text2)' }}>
        {v.pipeline} — vue Kanban
      </div>
      <div className="pipeline-cols">
        {COLS.map(col => (
          <div className="pipeline-col" key={col.key}>
            <div className="pipeline-col-header" style={{ background: col.color + '22', color: col.color }}>
              {col.label} ({MOCK_CARDS[col.key].length})
            </div>
            {MOCK_CARDS[col.key].map((card, i) => (
              <div className="pipeline-card" key={i}>
                <div className="pc-name">{card.name}</div>
                <div className="pc-meta">{card.pack} · {card.montant}</div>
              </div>
            ))}
          </div>
        ))}
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
                <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{d.ref}</td>
                <td style={{ fontWeight: 600 }}>{d.client}</td>
                <td>{d.pack}</td>
                <td>
                  <span className={`badge ${d.statut === 'ACTIF' ? 'badge-actif' : 'badge-pending'}`}>
                    {d.statut}
                  </span>
                </td>
                <td>{d.prix}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
