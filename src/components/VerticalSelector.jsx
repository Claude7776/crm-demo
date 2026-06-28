import { VERTICAL_LIST } from '../config/verticals'

export default function VerticalSelector({ onSelect }) {
  return (
    <div className="selector-page">
      <div className="selector-logo">CRM</div>
      <p className="selector-tagline">CRM SaaS · Démo interactive</p>
      <h2 className="selector-title">Choisissez votre secteur</h2>
      <p className="selector-sub">L'interface s'adapte à votre métier</p>
      <div className="selector-grid">
        {VERTICAL_LIST.map(v => (
          <button
            key={v.id}
            className="vertical-card"
            style={{ '--card-color': v.color }}
            onClick={() => onSelect(v)}
          >
            <span className="vc-icon">{v.icon}</span>
            <div className="vc-label">{v.label}</div>
            <div className="vc-desc">
              Gérez vos {v.entities.toLowerCase()}, {v.leadsLabel.toLowerCase()} et {v.projects.toLowerCase()} depuis une interface unifiée.
            </div>
            <div className="vc-tags">
              <span className="vc-tag">{v.leadsLabel}</span>
              <span className="vc-tag">{v.pipeline}</span>
              <span className="vc-tag">Rapports</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
