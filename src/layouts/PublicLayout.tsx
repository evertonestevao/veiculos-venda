import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Car, Heart, Moon, Search, Sun, UserRound } from 'lucide-react'
import { useStore } from '../lib/store'

export function DemoBanner() {
  return (
    <div className="bg-ink px-4 py-1.5 text-center text-xs font-medium text-white/85">
      Protótipo de demonstração – dados fictícios, salvos apenas neste navegador
    </div>
  )
}

export function Logo({ light }: { light?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-white shadow"><Car size={19} /></span>
      <span className={`font-display text-xl font-bold tracking-tight ${light ? 'text-white' : ''}`}>AutoMarket</span>
    </Link>
  )
}

export function PublicLayout() {
  const nav = useNavigate()
  const [q, setQ] = useState('')
  const favCount = useStore((s) => s.favorites.length)
  const dark = useStore((s) => s.dark)
  const toggleDark = useStore((s) => s.toggleDark)

  return (
    <div className="flex min-h-screen flex-col">
      <DemoBanner />
      <header className="sticky top-0 z-40 border-b border-paper-line bg-paper/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
          <Logo />
          <form
            onSubmit={(e) => { e.preventDefault(); nav(q ? `/?q=${encodeURIComponent(q)}#resultados` : '/#resultados') }}
            className="relative mx-2 hidden flex-1 md:block md:max-w-md"
          >
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-mute" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Busque por marca, modelo ou cidade" className="input pl-10" />
          </form>
          <div className="ml-auto flex items-center gap-1.5">
            <NavLink to="/favoritos" className="relative grid h-10 w-10 place-items-center rounded-xl hover:bg-white" aria-label="Favoritos">
              <Heart size={19} />
              {favCount > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">{favCount}</span>}
            </NavLink>
            <button onClick={toggleDark} className="grid h-10 w-10 place-items-center rounded-xl hover:bg-white" aria-label="Alternar tema">
              {dark ? <Sun size={19} /> : <Moon size={19} />}
            </button>
            <Link to="/login" className="btn-primary !px-3.5 sm:!px-4">
              <UserRound size={16} /> <span className="hidden sm:inline">Área do anunciante</span><span className="sm:hidden">Entrar</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1"><Outlet /></main>

      <footer className="mt-16 bg-ink text-white/70">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-10 sm:flex-row sm:items-center">
          <div>
            <Logo light />
            <p className="mt-3 max-w-sm text-sm">Marketplace fictício criado para demonstração de fluxo. Nenhum anúncio, telefone ou vendedor é real.</p>
          </div>
          <p className="text-xs">© 2026 AutoMarket — protótipo</p>
        </div>
      </footer>
    </div>
  )
}
