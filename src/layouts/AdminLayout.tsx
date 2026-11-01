import { useState } from 'react'
import { Link, NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom'
import { Car, ExternalLink, LayoutDashboard, LogOut, Menu, MessageSquare, Moon, Plus, RotateCcw, Settings, Sun, X } from 'lucide-react'
import { useStore } from '../lib/store'
import { ConfirmModal } from '../components/ui'
import { DemoBanner, Logo } from './PublicLayout'

export function ProtectedRoute() {
  const logged = useStore((s) => s.logged)
  if (!logged) return <Navigate to="/login" replace />
  return <AdminLayout />
}

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/veiculos', label: 'Veículos', icon: Car },
  { to: '/admin/mensagens', label: 'Mensagens', icon: MessageSquare },
  { to: '/admin/configuracoes', label: 'Configurações', icon: Settings },
]

function AdminLayout() {
  const nav = useNavigate()
  const logout = useStore((s) => s.logout)
  const resetSeed = useStore((s) => s.resetSeed)
  const profile = useStore((s) => s.profile)
  const unread = useStore((s) => s.messages.filter((m) => !m.read).length)
  const dark = useStore((s) => s.dark)
  const toggleDark = useStore((s) => s.toggleDark)
  const [open, setOpen] = useState(false)
  const [confirm, setConfirm] = useState(false)

  const sidebar = (
    <div className="flex h-full flex-col bg-ink p-4 text-white">
      <div className="flex items-center justify-between px-2 py-2">
        <Logo light />
        <button className="lg:hidden" onClick={() => setOpen(false)}><X size={20} /></button>
      </div>
      <Link to="/admin/veiculos/novo" onClick={() => setOpen(false)} className="btn-accent mt-6"><Plus size={16} /> Novo veículo</Link>
      <nav className="mt-6 space-y-1">
        {links.map((l) => (
          <NavLink
            key={l.to} to={l.to} end={l.end} onClick={() => setOpen(false)}
            className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
          >
            <l.icon size={18} /> {l.label}
            {l.label === 'Mensagens' && unread > 0 && <span className="ml-auto rounded-full bg-accent px-2 text-xs font-bold">{unread}</span>}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto space-y-1 border-t border-white/10 pt-4">
        <Link to="/" target="_blank" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/60 hover:bg-white/5 hover:text-white"><ExternalLink size={18} /> Ver site público</Link>
        <button onClick={() => setConfirm(true)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/60 hover:bg-white/5 hover:text-white"><RotateCcw size={18} /> Restaurar dados de exemplo</button>
        <button onClick={() => { logout(); nav('/login') }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/60 hover:bg-white/5 hover:text-white"><LogOut size={18} /> Sair</button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen">
      <DemoBanner />
      <div className="flex">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 lg:block">{sidebar}</aside>
        {open && (
          <div className="fixed inset-0 z-[80] lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
            <div className="absolute inset-y-0 left-0 w-72 animate-slideIn">{sidebar}</div>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-paper-line bg-paper/90 px-4 backdrop-blur sm:px-8">
            <button className="lg:hidden" onClick={() => setOpen(true)}><Menu size={22} /></button>
            <p className="mr-auto text-sm text-ink-soft">Olá, <strong className="text-ink">{profile.name}</strong></p>
            <button onClick={toggleDark} className="grid h-10 w-10 place-items-center rounded-xl hover:bg-white" aria-label="Tema">{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
            <span className="grid h-10 w-10 place-items-center rounded-full bg-accent font-bold text-white">{profile.name.charAt(0)}</span>
          </header>
          <main className="p-4 sm:p-8"><Outlet /></main>
        </div>
      </div>
      <ConfirmModal
        open={confirm} onClose={() => setConfirm(false)} onConfirm={resetSeed}
        title="Restaurar dados de exemplo" confirmLabel="Restaurar"
        text="Isso apaga tudo que está salvo neste navegador (veículos, favoritos, mensagens, login) e recarrega os dados fictícios originais."
      />
    </div>
  )
}
