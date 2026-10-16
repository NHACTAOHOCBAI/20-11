import { Navigate, Route, Routes } from 'react-router-dom'
import EntryPage from './pages/EntryPage'
import WheelPage from './pages/WheelPage'
import CardGamePage from './pages/CardGamePage'
import PiggyGamePage from './pages/PiggyGamePage'

export default function App() {
  return <Routes><Route path="/" element={<EntryPage />} /><Route path="/wheel" element={<Navigate to="/game/wheel" replace />} /><Route path="/game/wheel" element={<WheelPage />} /><Route path="/game/cards" element={<CardGamePage />} /><Route path="/game/piggy" element={<PiggyGamePage />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes>
}
