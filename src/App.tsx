import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { useStore } from './lib/store'
import { Toaster } from './components/ui'
import { PublicLayout } from './layouts/PublicLayout'
import { ProtectedRoute } from './layouts/AdminLayout'
import Home from './pages/Home'
import VehicleDetail from './pages/VehicleDetail'
import Favorites from './pages/Favorites'
import Login from './pages/Login'
import Dashboard from './pages/admin/Dashboard'
import VehiclesList from './pages/admin/VehiclesList'
import VehicleForm from './pages/admin/VehicleForm'
import Messages from './pages/admin/Messages'
import Settings from './pages/admin/Settings'

export default function App() {
  const dark = useStore((s) => s.dark)
  const { pathname } = useLocation()

  useEffect(() => { document.documentElement.classList.toggle('dark', dark) }, [dark])
  useEffect(() => { if (!pathname.startsWith('/admin') && pathname !== '/') window.scrollTo(0, 0) }, [pathname])

  return (
    <>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/veiculo/:id" element={<VehicleDetail />} />
          <Route path="/favoritos" element={<Favorites />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route index element={<Dashboard />} />
          <Route path="veiculos" element={<VehiclesList />} />
          <Route path="veiculos/novo" element={<VehicleForm />} />
          <Route path="veiculos/:id/editar" element={<VehicleForm />} />
          <Route path="mensagens" element={<Messages />} />
          <Route path="configuracoes" element={<Settings />} />
        </Route>
        <Route path="*" element={<PublicLayout />}>
          <Route path="*" element={<div className="py-24 text-center font-display text-3xl font-bold">Página não encontrada</div>} />
        </Route>
      </Routes>
      <Toaster />
    </>
  )
}
