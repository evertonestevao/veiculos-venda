import { useState } from 'react'
import { toast, useStore } from '../../lib/store'

export default function Settings() {
  const profile = useStore((s) => s.profile)
  const save = useStore((s) => s.saveProfile)
  const [p, setP] = useState(profile)
  const f = (k: keyof typeof p) => ({ value: p[k], onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setP({ ...p, [k]: e.target.value }) })

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-semibold tracking-tight">Configurações</h1>
      <p className="mb-6 text-sm text-ink-soft">Dados exibidos no perfil da sua loja.</p>
      <form className="card space-y-4 p-6" onSubmit={(e) => { e.preventDefault(); save(p); toast('Configurações salvas') }}>
        <div><label className="label">Nome da loja</label><input className="input" {...f('name')} /></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="label">E-mail</label><input className="input" {...f('email')} /></div>
          <div><label className="label">Telefone</label><input className="input" {...f('phone')} /></div>
        </div>
        <div><label className="label">Cidade</label><input className="input" {...f('city')} /></div>
        <div><label className="label">Sobre a loja</label><textarea rows={4} className="input" {...f('about')} /></div>
        <button className="btn-accent">Salvar</button>
      </form>
    </div>
  )
}
