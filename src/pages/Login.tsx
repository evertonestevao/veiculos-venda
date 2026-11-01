import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { useStore } from '../lib/store'
import { DemoBanner, Logo } from '../layouts/PublicLayout'

export default function Login() {
  const nav = useNavigate()
  const login = useStore((s) => s.login)
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [show, setShow] = useState(false)

  const enter = () => { login(); nav('/admin') }

  return (
    <div className="flex min-h-screen flex-col">
      <DemoBanner />
      <div className="grid flex-1 lg:grid-cols-2">
        <div className="relative hidden overflow-hidden bg-ink lg:block">
          <img src="https://picsum.photos/seed/automarket-login/1200/1400" alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
          <div className="relative flex h-full flex-col justify-between p-12 text-white">
            <Logo light />
            <div>
              <h2 className="max-w-md font-display text-4xl font-bold leading-tight">Gerencie seus anúncios com o mesmo capricho dos seus veículos.</h2>
              <p className="mt-3 max-w-md text-white/70">Painel de demonstração: cadastre, edite, pause e acompanhe tudo — apenas neste navegador.</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm animate-fadeUp">
            <div className="mb-8 lg:hidden"><Logo /></div>
            <h1 className="font-display text-3xl font-bold">Área do anunciante</h1>
            <p className="mt-1 text-sm text-ink-soft">Entre com qualquer e-mail e senha — não há validação.</p>

            <form className="mt-8 space-y-4" onSubmit={(e) => { e.preventDefault(); enter() }}>
              <div>
                <label className="label">E-mail</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-mute" />
                  <input className="input pl-10" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@loja.com" />
                </div>
              </div>
              <div>
                <label className="label">Senha</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-mute" />
                  <input type={show ? 'text' : 'password'} className="input pl-10 pr-10" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="••••••••" />
                  <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-mute">{show ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                </div>
              </div>
              <button className="btn-primary w-full !py-3">Entrar <ArrowRight size={16} /></button>
            </form>

            <div className="my-5 flex items-center gap-3 text-xs text-ink-mute"><span className="h-px flex-1 bg-paper-line" />ou<span className="h-px flex-1 bg-paper-line" /></div>
            <button onClick={enter} className="btn-accent w-full !py-3">Entrar como demonstração</button>
            <Link to="/" className="mt-6 block text-center text-sm font-medium text-ink-soft hover:text-ink">← Voltar ao site</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
