import { useState } from 'react'

const TYPE_CFG = {
  appel: { icon: 'fa-phone',          label: 'Appel', color: '#1a71d4' },
  email: { icon: 'fa-envelope',       label: 'Email', color: '#7c3aed' },
  rdv:   { icon: 'fa-calendar-check', label: 'RDV',   color: '#f59e0b' },
  tache: { icon: 'fa-circle-check',   label: 'Tâche', color: '#10b981' },
  note:  { icon: 'fa-note-sticky',    label: 'Note',  color: '#6b7280' },
}

const STATUS_CFG = {
  fait:      { label: 'Terminé',   color: '#10b981', bg: 'rgba(16,185,129,.15)' },
  planifie:  { label: 'Planifié',  color: '#1a71d4', bg: 'rgba(26,113,212,.15)' },
  en_retard: { label: 'En retard', color: '#ef4444', bg: 'rgba(239,68,68,.15)'  },
}

const TODAY = '2026-06-28'
const YESTERDAY = '2026-06-27'

function fmtDate(d) {
  if (d === TODAY) return "Aujourd'hui"
  if (d === YESTERDAY) return 'Hier'
  return new Date(d + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
}

function sortDates(dates) {
  return [...dates].sort((a, b) => {
    if (a === TODAY) return -1
    if (b === TODAY) return 1
    if (a > TODAY && b > TODAY) return a.localeCompare(b)
    if (a < TODAY && b < TODAY) return b.localeCompare(a)
    return a > TODAY ? -1 : 1
  })
}

export default function ActivitiesView({ v }) {
  const [acts, setActs] = useState(() => [...(v.activities ?? [])])
  const [typeFilter, setTypeFilter] = useState('tous')

  function toggleDone(id) {
    setActs(prev => prev.map(a =>
      a.id === id ? { ...a, statut: a.statut === 'fait' ? 'planifie' : 'fait' } : a
    ))
  }

  const filtered = typeFilter === 'tous' ? acts : acts.filter(a => a.type === typeFilter)

  const stats = {
    today:     acts.filter(a => a.date === TODAY).length,
    fait:      acts.filter(a => a.statut === 'fait').length,
    planifie:  acts.filter(a => a.statut === 'planifie').length,
    en_retard: acts.filter(a => a.statut === 'en_retard').length,
  }

  const grouped = {}
  filtered.forEach(a => { (grouped[a.date] ??= []).push(a) })
  const sortedDates = sortDates(Object.keys(grouped))

  const btnStyle = (active, color) => ({
    padding: '5px 14px', borderRadius: 20, border: '1px solid var(--border)',
    background: active ? color : 'transparent',
    color: active ? '#fff' : 'var(--text2)',
    cursor: 'pointer', fontSize: 12, fontWeight: 600,
    display: 'inline-flex', alignItems: 'center', gap: 5,
  })

  return (
    <>
      <div className="kpi-grid" style={{ marginBottom: 20 }}>
        {[
          { icon: 'fa-calendar-day',        value: stats.today,     label: "Aujourd'hui", color: v.color    },
          { icon: 'fa-circle-check',         value: stats.fait,      label: 'Terminées',   color: '#10b981'  },
          { icon: 'fa-clock',                value: stats.planifie,  label: 'Planifiées',  color: '#f59e0b'  },
          { icon: 'fa-triangle-exclamation', value: stats.en_retard, label: 'En retard',   color: '#ef4444'  },
        ].map((s, i) => (
          <div className="kpi-card" key={i} style={{ '--kpi-color': s.color }}>
            <div className="kpi-icon"><i className={`fa-solid ${s.icon}`} /></div>
            <div className="kpi-value">{s.value}</div>
            <div className="kpi-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <button style={btnStyle(typeFilter === 'tous', v.color)} onClick={() => setTypeFilter('tous')}>
          Toutes ({acts.length})
        </button>
        {Object.entries(TYPE_CFG).map(([key, cfg]) => (
          <button key={key} style={btnStyle(typeFilter === key, cfg.color)} onClick={() => setTypeFilter(key)}>
            <i className={`fa-solid ${cfg.icon}`} />{cfg.label}
          </button>
        ))}
      </div>

      {sortedDates.map(date => (
        <div key={date} style={{ marginBottom: 24 }}>
          <div style={{
            fontSize: 12, fontWeight: 700, color: 'var(--text2)',
            textTransform: 'uppercase', letterSpacing: '.5px',
            marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8,
          }}>
            {fmtDate(date)}
            <span style={{ fontWeight: 400, fontSize: 11, textTransform: 'none' }}>
              — {grouped[date].length} activité{grouped[date].length > 1 ? 's' : ''}
            </span>
          </div>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {[...grouped[date]]
              .sort((a, b) => a.heure.localeCompare(b.heure))
              .map((act, i, arr) => {
                const tc = TYPE_CFG[act.type]
                const sc = STATUS_CFG[act.statut]
                const done = act.statut === 'fait'
                return (
                  <div
                    key={act.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 14, padding: '12px 18px',
                      borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
                      opacity: done ? 0.65 : 1,
                    }}
                  >
                    <div style={{
                      width: 34, height: 34, borderRadius: '50%',
                      background: tc.color + '22', color: tc.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <i className={`fa-solid ${tc.icon}`} style={{ fontSize: 13 }} />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2, textDecoration: done ? 'line-through' : 'none' }}>
                        {act.titre}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span>
                          <i className="fa-solid fa-user" style={{ fontSize: 10, marginRight: 4 }} />
                          {act.contact}
                        </span>
                        {act.note && <span style={{ opacity: 0.8 }}>· {act.note}</span>}
                      </div>
                    </div>

                    <div style={{ fontSize: 12, color: 'var(--text2)', flexShrink: 0, marginRight: 8 }}>
                      <i className="fa-regular fa-clock" style={{ marginRight: 4, fontSize: 11 }} />
                      {act.heure}
                    </div>

                    <span style={{
                      padding: '2px 9px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                      background: sc.bg, color: sc.color, flexShrink: 0,
                      marginRight: act.statut !== 'en_retard' ? 8 : 0,
                    }}>
                      {sc.label}
                    </span>

                    {act.statut !== 'en_retard' && (
                      <button
                        onClick={() => toggleDone(act.id)}
                        style={{
                          padding: '3px 10px', borderRadius: 6, border: '1px solid var(--border)',
                          background: 'none', color: 'var(--text2)', cursor: 'pointer',
                          fontSize: 11, flexShrink: 0,
                        }}
                      >
                        {done ? 'Rouvrir' : 'Fait ✓'}
                      </button>
                    )}
                  </div>
                )
              })}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div className="card" style={{ textAlign: 'center', color: 'var(--text2)', padding: 40 }}>
          <i className="fa-solid fa-calendar-xmark" style={{ fontSize: 24, marginBottom: 10, display: 'block' }} />
          Aucune activité pour ce filtre
        </div>
      )}
    </>
  )
}
