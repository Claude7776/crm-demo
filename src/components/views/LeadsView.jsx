import { useState, useRef, useEffect } from 'react'

const STATUTS = ['nouveau', 'contacte', 'qualifie', 'interesse', 'converti']
const AVATAR_COLORS = ['#1a71d4', '#7c3aed', '#f59e0b', '#10b981', '#ef4444', '#0e7490']

function initials(nom) {
  return nom.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

function StatusDropdown({ current, color, onSelect, onClose }) {
  const ref = useRef(null)

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  return (
    <div ref={ref} style={{
      position: 'absolute', right: 0, top: 'calc(100% + 4px)', zIndex: 30,
      background: 'var(--bg2)', border: '1px solid var(--border)',
      borderRadius: 10, overflow: 'hidden', minWidth: 150,
      boxShadow: '0 8px 28px rgba(0,0,0,.55)',
    }}>
      {STATUTS.map(s => (
        <button
          key={s}
          onClick={() => onSelect(s)}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            width: '100%', padding: '8px 14px',
            background: s === current ? color + '18' : 'none',
            border: 'none', cursor: 'pointer', fontSize: 12,
            color: s === current ? color : 'var(--text2)', textAlign: 'left',
            transition: 'background .1s',
          }}
          onMouseEnter={e => { if (s !== current) e.currentTarget.style.background = 'var(--bg3)' }}
          onMouseLeave={e => { if (s !== current) e.currentTarget.style.background = 'none' }}
        >
          <span className={`badge badge-${s}`} style={{ padding: '1px 7px' }}>{s}</span>
          {s === current && <i className="fa-solid fa-check" style={{ marginLeft: 'auto', fontSize: 10, color }} />}
        </button>
      ))}
    </div>
  )
}

export default function LeadsView({ v, leads, onStatusChange, onAddLead }) {
  const [filter, setFilter] = useState('tous')
  const [openDropdown, setOpenDropdown] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ nom: '', ville: '', metier: '' })

  const leadsWithIdx = leads.map((l, i) => ({ ...l, _idx: i }))
  const displayed = filter === 'tous' ? leadsWithIdx : leadsWithIdx.filter(l => l.statut === filter)

  function handleAdd() {
    if (!form.nom.trim()) return
    onAddLead({ nom: form.nom, ville: form.ville || '—', metier: form.metier || '—', statut: 'nouveau' })
    setForm({ nom: '', ville: '', metier: '' })
    setShowForm(false)
  }

  const btnStyle = (active) => ({
    padding: '5px 14px', borderRadius: 20, border: '1px solid var(--border)',
    background: active ? v.color : 'transparent',
    color: active ? '#fff' : 'var(--text2)',
    cursor: 'pointer', fontSize: 12, fontWeight: 600,
  })

  return (
    <>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <button style={btnStyle(filter === 'tous')} onClick={() => setFilter('tous')}>
          Tous ({leads.length})
        </button>
        {STATUTS.map(s => {
          const count = leads.filter(l => l.statut === s).length
          if (!count) return null
          return (
            <button key={s} style={btnStyle(filter === s)} onClick={() => setFilter(s)}>
              {s} ({count})
            </button>
          )
        })}
        <button
          onClick={() => setShowForm(f => !f)}
          style={{
            marginLeft: 'auto', padding: '5px 14px', borderRadius: 20,
            border: `1px solid ${v.color}`, background: showForm ? v.color : 'transparent',
            color: showForm ? '#fff' : v.color,
            cursor: 'pointer', fontSize: 12, fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          <i className="fa-solid fa-plus" style={{ fontSize: 10 }} />
          Nouveau {v.lead}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 16, display: 'flex', gap: 10, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          {[
            { key: 'nom',    placeholder: `Nom du ${v.lead.toLowerCase()}`, required: true },
            { key: 'ville',  placeholder: 'Ville' },
            { key: 'metier', placeholder: v.skill },
          ].map(f => (
            <input
              key={f.key}
              placeholder={f.placeholder}
              value={form[f.key]}
              onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
              style={{
                flex: 1, minWidth: 140, padding: '8px 12px', background: 'var(--bg3)',
                border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)',
                fontSize: 13, outline: 'none', fontFamily: 'inherit',
              }}
              onFocus={e => e.target.style.borderColor = v.color}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
            />
          ))}
          <button
            onClick={handleAdd}
            style={{
              padding: '8px 18px', borderRadius: 8, border: 'none',
              background: v.color, color: '#fff', cursor: 'pointer',
              fontSize: 13, fontWeight: 600,
            }}
          >
            Ajouter
          </button>
          <button
            onClick={() => setShowForm(false)}
            style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'none', color: 'var(--text2)', cursor: 'pointer', fontSize: 13 }}
          >
            Annuler
          </button>
        </div>
      )}

      <div className="card">
        <div className="section-title">
          <i className="fa-solid fa-users" />
          {v.leadsLabel}
          <span style={{ color: 'var(--text2)', fontWeight: 400 }}>({displayed.length})</span>
        </div>
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
              <tr key={l._idx}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="contact-avatar" style={{ background: AVATAR_COLORS[l._idx % AVATAR_COLORS.length] }}>
                      {initials(l.nom)}
                    </div>
                    <span style={{ fontWeight: 600 }}>{l.nom}</span>
                  </div>
                </td>
                <td style={{ color: 'var(--text2)' }}>
                  <i className="fa-solid fa-location-dot" style={{ fontSize: 10, marginRight: 5 }} />
                  {l.ville}
                </td>
                <td>{l.metier}</td>
                <td><span className={`badge badge-${l.statut}`}>{l.statut}</span></td>
                <td>
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <button
                      onClick={() => setOpenDropdown(openDropdown === l._idx ? null : l._idx)}
                      style={{
                        padding: '4px 12px', borderRadius: 6,
                        border: `1px solid ${openDropdown === l._idx ? v.color : 'var(--border)'}`,
                        background: openDropdown === l._idx ? v.color + '18' : 'none',
                        color: openDropdown === l._idx ? v.color : 'var(--text2)',
                        cursor: 'pointer', fontSize: 11, display: 'flex', alignItems: 'center', gap: 5,
                      }}
                    >
                      Qualifier
                      <i className="fa-solid fa-chevron-down" style={{ fontSize: 9 }} />
                    </button>
                    {openDropdown === l._idx && (
                      <StatusDropdown
                        current={l.statut}
                        color={v.color}
                        onSelect={s => { onStatusChange(l._idx, s); setOpenDropdown(null) }}
                        onClose={() => setOpenDropdown(null)}
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {displayed.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text2)', padding: 32 }}>
                  Aucun {v.lead.toLowerCase()} pour ce filtre
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
