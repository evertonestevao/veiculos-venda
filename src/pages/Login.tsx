import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { useStore } from '../lib/store'
import { Logo } from '../layouts/PublicLayout'

export default function Login() {
  const nav = useNavigate()
  const login = useStore((s) => s.login)
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [show, setShow] = useState(false)

  const enter = () => { login(); nav('/admin') }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 items-center justify-center bg-paper px-6 py-12">
          <div className="w-full max-w-sm animate-fadeUp">
            <div className="mb-8"><Logo /></div>
            <h1 className="text-2xl font-semibold tracking-tight">Entrar na sua conta</h1>
            <p className="mt-1 text-sm text-ink-soft">Gerencie seus anúncios e contatos.</p>

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
              <button className="btn-primary w-full">Entrar <ArrowRight size={16} /></button>
            </form>

            <div className="my-5 flex items-center gap-3 text-xs text-ink-mute"><span className="h-px flex-1 bg-paper-line" />ou<span className="h-px flex-1 bg-paper-line" /></div>
            <button onClick={enter} className="btn-ghost w-full">Acessar demonstração</button>
            <Link to="/" className="mt-6 block text-center text-sm font-medium text-ink-soft hover:text-ink">← Voltar ao site</Link>
          </div>
        </div>
    </div>
  )
}
