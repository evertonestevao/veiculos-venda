import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Calculator, Check, ChevronLeft, ChevronRight, Heart, MapPin, MessageSquare, Phone, Repeat, Share2, UserRound, X, ZoomIn } from 'lucide-react'
import { toast, useStore } from '../lib/store'
import { brl, brlFull, dateBR, installment, km } from '../lib/format'
import { Modal } from '../components/ui'
import { VehicleCard } from '../components/VehicleCard'

export default function VehicleDetail() {
  const { id } = useParams()
  const vehicles = useStore((s) => s.vehicles)
  const hit = useStore((s) => s.hit)
  const fav = useStore((s) => s.favorites.includes(id ?? ''))
  const toggleFav = useStore((s) => s.toggleFavorite)
  const addMessage = useStore((s) => s.addMessage)
  const v = vehicles.find((x) => x.id === id)

  const [idx, setIdx] = useState(0)
  const [zoom, setZoom] = useState(false)
  const [phone, setPhone] = useState(false)
  const [msgOpen, setMsgOpen] = useState(false)
  const [finOpen, setFinOpen] = useState(false)

  useEffect(() => { if (id) { hit(id); window.scrollTo(0, 0); setIdx(0) } /* eslint-disable-next-line */ }, [id])

  // simulador
  const [entrada, setEntrada] = useState(0)
  const [parcelas, setParcelas] = useState(48)
  const [taxa, setTaxa] = useState(1.49)

  const similar = useMemo(
    () => v ? vehicles.filter((x) => x.id !== v.id && x.status === 'ativo' && (x.type === v.type || x.brand === v.brand)).slice(0, 4) : [],
    [vehicles, v],
  )

  if (!v) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Anúncio não encontrado</h1>
        <p className="mt-2 text-ink-soft">Ele pode ter sido removido ou vendido.</p>
        <Link to="/" className="btn-primary mt-6">Voltar para a busca</Link>
      </div>
    )
  }

  const photos = v.photos.length ? v.photos : []
  const credit = v.photoCredits?.[photos[idx]]
  const go = (d: number) => setIdx((i) => (i + d + photos.length) % photos.length)
  const financed = Math.max(v.price - entrada, 0)
  const parcela = installment(financed, parcelas, taxa)

  const specs: [string, string][] = [
    ['Marca', v.brand], ['Modelo', v.model], ['Versão', v.version], ['Ano', String(v.year)],
    ['Quilometragem', km(v.km)], ['Câmbio', v.transmission], ['Combustível', v.fuel], ['Cor', v.color],
    ['Tipo', v.type], ['Condição', v.condition], ['Aceita troca', v.acceptsTrade ? 'Sim' : 'Não'], ['Localização', `${v.city} - ${v.state}`],
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Link to="/" className="mb-5 inline-flex items-center gap-1 text-sm font-medium text-ink-soft hover:text-ink"><ChevronLeft size={16} /> Voltar</Link>

      {v.status !== 'ativo' && (
        <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Este anúncio está <strong>{v.status}</strong> e não aparece na busca pública.
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="card relative aspect-[3/2] overflow-hidden">
            {photos[idx] && <img src={photos[idx]} alt={`${v.brand} ${v.model}`} className="h-full w-full cursor-zoom-in object-cover" onClick={() => setZoom(true)} />}
            {photos.length > 1 && (
              <>
                <button onClick={() => go(-1)} className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/95 shadow hover:scale-105"><ChevronLeft size={20} /></button>
                <button onClick={() => go(1)} className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/95 shadow hover:scale-105"><ChevronRight size={20} /></button>
              </>
            )}
            <button onClick={() => setZoom(true)} className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold shadow"><ZoomIn size={14} /> Ampliar</button>
            <span className="absolute bottom-3 left-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white">{idx + 1} / {photos.length}</span>
          </div>
          <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-5">
            {photos.map((p, i) => (
              <button key={i} onClick={() => setIdx(i)} className={`aspect-[4/3] overflow-hidden rounded-lg border-2 transition ${i === idx ? 'border-accent' : 'border-transparent opacity-70 hover:opacity-100'}`}>
                <img src={p} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          {credit && (
            <p className="mt-2 text-xs text-ink-mute">
              Foto ilustrativa do modelo: <a href={credit.source} target="_blank" rel="noreferrer" className="underline hover:text-ink">{credit.author}</a>, {credit.license}, via Wikimedia Commons.
            </p>
          )}

          <div className="card mt-8 p-6">
            <h2 className="text-base font-semibold">Ficha técnica</h2>
            <dl className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {specs.map(([k, val]) => (
                <div key={k} className="flex justify-between border-b border-paper-line pb-2 text-sm">
                  <dt className="text-ink-soft">{k}</dt><dd className="font-semibold">{val}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="card mt-6 p-6">
            <h2 className="text-base font-semibold">Opcionais</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {v.options.length === 0 && <li className="text-sm text-ink-soft">Nenhum opcional informado.</li>}
              {v.options.map((o) => <li key={o} className="flex items-center gap-2 text-sm"><Check size={15} className="text-accent" />{o}</li>)}
            </ul>
          </div>

          <div className="card mt-6 p-6">
            <h2 className="text-base font-semibold">Descrição</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">{v.description || 'Sem descrição.'}</p>
            <p className="mt-4 text-xs text-ink-mute">Anúncio publicado em {dateBR(v.createdAt)} · {v.views} visualizações</p>
          </div>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-ink-mute">{v.brand}</p>
                <h1 className="text-xl font-semibold tracking-tight leading-tight">{v.model}</h1>
                <p className="text-sm text-ink-soft">{v.version}</p>
              </div>
              <div className="flex gap-1.5">
                <button onClick={() => { toggleFav(v.id); toast(fav ? 'Removido dos favoritos' : 'Adicionado aos favoritos') }} className="grid h-10 w-10 place-items-center rounded-lg border border-paper-line hover:bg-paper" aria-label="Favoritar">
                  <Heart size={17} className={fav ? 'fill-red-500 text-red-500' : ''} />
                </button>
                <button onClick={() => { navigator.clipboard?.writeText(window.location.href); toast('Link copiado') }} className="grid h-10 w-10 place-items-center rounded-lg border border-paper-line hover:bg-paper" aria-label="Compartilhar"><Share2 size={17} /></button>
              </div>
            </div>
            <p className="mt-4 text-3xl font-bold">{brl(v.price)}</p>
            <p className="mt-1 flex items-center gap-1 text-sm text-ink-soft"><MapPin size={14} />{v.city} - {v.state}</p>
            {v.acceptsTrade && <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent-dark"><Repeat size={13} /> Aceita troca</p>}

            <div className="mt-6 space-y-2.5 border-t border-paper-line pt-5">
              <div className="mb-3 flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-ink text-white"><UserRound size={19} /></span>
                <div><p className="text-sm font-semibold">{v.sellerName}</p><p className="text-xs text-ink-mute">Anunciante</p></div>
              </div>
              <button onClick={() => setPhone(true)} className="btn-primary w-full"><Phone size={16} />{phone ? v.sellerPhone : 'Ver telefone'}</button>
              <button onClick={() => setMsgOpen(true)} className="btn-accent w-full"><MessageSquare size={16} /> Enviar mensagem</button>
              <button onClick={() => setFinOpen(true)} className="btn-ghost w-full"><Calculator size={16} /> Simular financiamento</button>
            </div>
          </div>
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-semibold tracking-tight">Veículos semelhantes</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{similar.map((s) => <VehicleCard key={s.id} v={s} />)}</div>
        </section>
      )}

      {/* zoom */}
      {zoom && photos[idx] && (
        <div className="fixed inset-0 z-[95] grid place-items-center bg-black/90 p-4" onClick={() => setZoom(false)}>
          <button className="absolute right-5 top-5 text-white"><X size={26} /></button>
          <img src={photos[idx]} alt="" className="max-h-full max-w-full rounded-lg object-contain" />
        </div>
      )}

      <MessageModal open={msgOpen} onClose={() => setMsgOpen(false)} onSend={(d) => { addMessage({ ...d, vehicleId: v.id }); setMsgOpen(false); toast('Mensagem enviada com sucesso! (simulado)') }} />

      <Modal open={finOpen} onClose={() => setFinOpen(false)} title="Simular financiamento">
        <div className="space-y-4">
          <div><label className="label">Valor do veículo</label><div className="input !bg-paper font-semibold">{brlFull(v.price)}</div></div>
          <div>
            <label className="label">Entrada: {brl(entrada)}</label>
            <input type="range" min={0} max={v.price} step={1000} value={entrada} onChange={(e) => setEntrada(Number(e.target.value))} className="w-full" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Parcelas</label>
              <select className="input" value={parcelas} onChange={(e) => setParcelas(Number(e.target.value))}>{[12, 24, 36, 48, 60].map((p) => <option key={p} value={p}>{p}x</option>)}</select>
            </div>
            <div>
              <label className="label">Taxa ao mês (%)</label>
              <input type="number" step="0.01" min={0} className="input" value={taxa} onChange={(e) => setTaxa(Number(e.target.value))} />
            </div>
          </div>
          <div className="rounded-xl bg-accent-soft p-5">
            <p className="text-xs text-ink-soft">Parcela estimada</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight">{brlFull(parcela)}<span className="text-base font-normal text-ink-soft"> /mês</span></p>
            <p className="mt-2 text-xs text-ink-soft">Financiado: {brlFull(financed)} · Total: {brlFull(parcela * parcelas + entrada)}</p>
          </div>
          <p className="text-xs text-ink-mute">Valores estimados pela Tabela Price. Condições sujeitas à análise de crédito.</p>
        </div>
      </Modal>
    </div>
  )
}

function MessageModal({ open, onClose, onSend }: { open: boolean; onClose: () => void; onSend: (d: { name: string; email: string; phone: string; text: string }) => void }) {
  const [d, setD] = useState({ name: '', email: '', phone: '', text: 'Olá! Tenho interesse neste veículo. Ainda está disponível?' })
  return (
    <Modal open={open} onClose={onClose} title="Enviar mensagem ao vendedor">
      <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); onSend(d) }}>
        <div><label className="label">Nome</label><input className="input" value={d.name} onChange={(e) => setD({ ...d, name: e.target.value })} placeholder="Seu nome" /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="label">E-mail</label><input className="input" value={d.email} onChange={(e) => setD({ ...d, email: e.target.value })} placeholder="voce@email.com" /></div>
          <div><label className="label">Telefone</label><input className="input" value={d.phone} onChange={(e) => setD({ ...d, phone: e.target.value })} placeholder="(00) 00000-0000" /></div>
        </div>
        <div><label className="label">Mensagem</label><textarea rows={4} className="input" value={d.text} onChange={(e) => setD({ ...d, text: e.target.value })} /></div>
        <button className="btn-primary w-full">Enviar</button>
      </form>
    </Modal>
  )
}
