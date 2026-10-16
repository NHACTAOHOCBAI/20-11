import { Navigate, Route, Routes } from 'react-router-dom'
import EntryPage from './pages/EntryPage'
import WheelPage from './pages/WheelPage'

export default function App() {
  return <Routes><Route path="/" element={<EntryPage />} /><Route path="/wheel" element={<WheelPage />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes>
}
