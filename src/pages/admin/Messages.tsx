import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Inbox, Mail, Phone } from 'lucide-react'
import { useStore } from '../../lib/store'
import { dateBR } from '../../lib/format'

export default function Messages() {
  const { messages, vehicles, markRead } = useStore()
  const [sel, setSel] = useState<string | null>(messages[0]?.id ?? null)
  const m = messages.find((x) => x.id === sel)
  const veh = vehicles.find((v) => v.id === m?.vehicleId)

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-3xl font-bold">Mensagens</h1>
      <p className="mb-6 text-sm text-ink-soft">Contatos recebidos (fictícios). Mensagens enviadas pelo site público também aparecem aqui.</p>

      {messages.length === 0 ? (
        <div className="card flex flex-col items-center px-6 py-16 text-center"><Inbox size={32} className="text-accent" /><p className="mt-3 font-semibold">Nenhuma mensagem</p></div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <ul className="card divide-y divide-paper-line overflow-hidden">
            {messages.map((x) => (
              <li key={x.id}>
                <button onClick={() => { setSel(x.id); markRead(x.id) }} className={`block w-full px-4 py-3.5 text-left transition hover:bg-paper ${sel === x.id ? 'bg-accent-soft/60' : ''}`}>
                  <div className="flex items-center gap-2">
                    {!x.read && <span className="h-2 w-2 rounded-full bg-accent" />}
                    <p className={`text-sm ${x.read ? 'font-medium' : 'font-bold'}`}>{x.name || 'Visitante'}</p>
                    <span className="ml-auto text-xs text-ink-mute">{dateBR(x.date)}</span>
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-xs text-ink-soft">{x.text}</p>
                </button>
              </li>
            ))}
          </ul>
          {m && (
            <div className="card p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl font-semibold">{m.name || 'Visitante'}</h2>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-soft">
                    <span className="inline-flex items-center gap-1.5"><Mail size={14} />{m.email || '—'}</span>
                    <span className="inline-flex items-center gap-1.5"><Phone size={14} />{m.phone || '—'}</span>
                  </div>
                </div>
                <span className="text-xs text-ink-mute">{new Date(m.date).toLocaleString('pt-BR')}</span>
              </div>
              {veh && (
                <Link to={`/veiculo/${veh.id}`} className="mt-5 flex items-center gap-3 rounded-xl border border-paper-line p-3 transition hover:bg-paper">
                  <img src={veh.photos[0]} alt="" className="h-14 w-20 rounded-lg object-cover" />
                  <div><p className="text-xs text-ink-mute">Sobre o veículo</p><p className="text-sm font-semibold">{veh.brand} {veh.model} {veh.year}</p></div>
                </Link>
              )}
              <p className="mt-5 rounded-xl bg-paper p-4 text-sm leading-relaxed">{m.text}</p>
              <button className="btn-primary mt-5" onClick={() => alert('Protótipo: nada é enviado de verdade.')}>Responder (simulado)</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
