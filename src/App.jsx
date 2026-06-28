import { useState } from 'react'
import VerticalSelector from './components/VerticalSelector'
import DemoCRM from './components/DemoCRM'
import './App.css'

export default function App() {
  const [vertical, setVertical] = useState(null)

  if (!vertical) return <VerticalSelector onSelect={setVertical} />
  return <DemoCRM vertical={vertical} onBack={() => setVertical(null)} />
}
