import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, ImagePlus, Link2, Plus, Trash2, Upload } from 'lucide-react'
import { toast, useStore } from '../../lib/store'
import { ALL_BRANDS, CATALOG, COLORS, OPTIONS, STATES } from '../../lib/seed'
import type { Vehicle } from '../../lib/types'
import { VehicleCard } from '../../components/VehicleCard'

type Draft = Omit<Vehicle, 'id' | 'createdAt' | 'views'>

const empty: Draft = {
  type: 'Carro', brand: '', model: '', version: '', year: 2024, km: 0, price: 0,
  transmission: 'Automático', fuel: 'Flex', color: 'Branco', city: 'São Paulo', state: 'SP',
  condition: 'Usado', acceptsTrade: false, featured: false, status: 'ativo', options: [],
  description: '', photos: [], sellerName: 'Garage Elite Veículos', sellerPhone: '(14) 3333-0000',
}

const MAX_MB = 1.2

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="card p-6">
      <h2 className="font-display text-lg font-semibold">{title}</h2>
      {hint && <p className="text-xs text-ink-mute">{hint}</p>}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  )
}
const Field = ({ label, error, children, full }: { label: string; error?: string; children: React.ReactNode; full?: boolean }) => (
  <div className={full ? 'sm:col-span-2' : ''}>
    <label className="label">{label}</label>
    {children}
    {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
  </div>
)

export default function VehicleForm() {
  const { id } = useParams()
  const nav = useNavigate()
  const { vehicles, addVehicle, updateVehicle } = useStore()
  const existing = id ? vehicles.find((v) => v.id === id) : undefined

  const [d, setD] = useState<Draft>(() => {
    if (existing) { const { id: _i, createdAt: _c, views: _v, ...rest } = existing; return rest }
    return empty
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [url, setUrl] = useState('')
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((p) => ({ ...p, [k]: v }))

  if (id && !existing) {
    return <div className="py-20 text-center"><p>Veículo não encontrado.</p><Link to="/admin/veiculos" className="btn-primary mt-4">Voltar</Link></div>
  }

  const models = d.brand ? CATALOG[d.brand]?.models ?? [] : []

  const onFiles = (files: FileList | null) => {
    if (!files) return
    Array.from(files).forEach((f) => {
      if (!f.type.startsWith('image/')) return toast(`${f.name}: não é uma imagem`, 'err')
      if (f.size > MAX_MB * 1024 * 1024) return toast(`${f.name} excede ${MAX_MB} MB (limite do localStorage)`, 'err')
      const r = new FileReader()
      r.onload = () => setD((p) => ({ ...p, photos: [...p.photos, String(r.result)] }))
      r.readAsDataURL(f)
    })
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!d.brand) e.brand = 'Informe a marca'
    if (!d.model.trim()) e.model = 'Informe o modelo'
    if (!d.version.trim()) e.version = 'Informe a versão'
    if (!d.price || d.price <= 0) e.price = 'Informe um preço válido'
    if (d.year < 1980 || d.year > 2027) e.year = 'Ano inválido'
    if (d.photos.length === 0) e.photos = 'Adicione ao menos uma foto'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validate()) { toast('Corrija os campos destacados', 'err'); return }
    try {
      if (existing) { updateVehicle(existing.id, d); toast('Veículo atualizado') }
      else { addVehicle(d); toast('Veículo cadastrado') }
      nav('/admin/veiculos')
    } catch {
      toast('Espaço do navegador esgotado — use menos fotos ou URLs', 'err')
    }
  }

  const preview: Vehicle = { ...d, id: 'preview', createdAt: new Date().toISOString(), views: 0 }
  const err = (k: string) => (errors[k] ? '!border-red-400' : '')

  return (
    <form onSubmit={submit} className="mx-auto max-w-6xl">
      <Link to="/admin/veiculos" className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-ink-soft hover:text-ink"><ChevronLeft size={16} /> Voltar</Link>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-bold">{existing ? 'Editar veículo' : 'Novo veículo'}</h1>
        <div className="flex gap-2">
          <Link to="/admin/veiculos" className="btn-ghost">Cancelar</Link>
          <button className="btn-accent">{existing ? 'Salvar alterações' : 'Publicar anúncio'}</button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <Section title="Dados básicos">
            <Field label="Tipo">
              <select className="input" value={d.type} onChange={(e) => set('type', e.target.value as Draft['type'])}>
                {['Carro', 'Moto', 'SUV', 'Caminhonete'].map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Condição">
              <select className="input" value={d.condition} onChange={(e) => set('condition', e.target.value as Draft['condition'])}>
                <option>Usado</option><option>Novo</option>
              </select>
            </Field>
            <Field label="Marca" error={errors.brand}>
              <select className={`input ${err('brand')}`} value={d.brand} onChange={(e) => { set('brand', e.target.value); set('model', '') }}>
                <option value="">Selecione</option>{ALL_BRANDS.map((b) => <option key={b}>{b}</option>)}
              </select>
            </Field>
            <Field label="Modelo" error={errors.model}>
              <input list="models" className={`input ${err('model')}`} value={d.model} onChange={(e) => set('model', e.target.value)} placeholder="Ex.: Corolla" />
              <datalist id="models">{models.map((m) => <option key={m} value={m} />)}</datalist>
            </Field>
            <Field label="Versão" error={errors.version} full>
              <input className={`input ${err('version')}`} value={d.version} onChange={(e) => set('version', e.target.value)} placeholder="Ex.: XEi 2.0 Flex Automático" />
            </Field>
          </Section>

          <Section title="Ficha técnica">
            <Field label="Ano" error={errors.year}><input type="number" className={`input ${err('year')}`} value={d.year} onChange={(e) => set('year', Number(e.target.value))} /></Field>
            <Field label="Quilometragem (km)"><input type="number" min={0} className="input" value={d.km} onChange={(e) => set('km', Number(e.target.value))} /></Field>
            <Field label="Câmbio">
              <select className="input" value={d.transmission} onChange={(e) => set('transmission', e.target.value as Draft['transmission'])}><option>Automático</option><option>Manual</option></select>
            </Field>
            <Field label="Combustível">
              <select className="input" value={d.fuel} onChange={(e) => set('fuel', e.target.value as Draft['fuel'])}>{['Flex', 'Gasolina', 'Diesel', 'Elétrico', 'Híbrido'].map((f) => <option key={f}>{f}</option>)}</select>
            </Field>
            <Field label="Cor"><select className="input" value={d.color} onChange={(e) => set('color', e.target.value)}>{COLORS.map((c) => <option key={c}>{c}</option>)}</select></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Estado">
                <select className="input" value={d.state} onChange={(e) => { set('state', e.target.value); set('city', STATES[e.target.value][0]) }}>{Object.keys(STATES).map((s) => <option key={s}>{s}</option>)}</select>
              </Field>
              <Field label="Cidade"><select className="input" value={d.city} onChange={(e) => set('city', e.target.value)}>{(STATES[d.state] ?? []).map((c) => <option key={c}>{c}</option>)}</select></Field>
            </div>
          </Section>

          <section className="card p-6">
            <h2 className="font-display text-lg font-semibold">Opcionais</h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {OPTIONS.map((o) => (
                <label key={o} className="flex cursor-pointer items-center gap-2 text-sm">
                  <input type="checkbox" className="h-4 w-4 accent-accent" checked={d.options.includes(o)} onChange={(e) => set('options', e.target.checked ? [...d.options, o] : d.options.filter((x) => x !== o))} />{o}
                </label>
              ))}
            </div>
          </section>

          <Section title="Preço e condições">
            <Field label="Preço (R$)" error={errors.price}><input type="number" min={0} step={500} className={`input ${err('price')}`} value={d.price || ''} onChange={(e) => set('price', Number(e.target.value))} placeholder="0" /></Field>
            <Field label="Status">
              <select className="input" value={d.status} onChange={(e) => set('status', e.target.value as Draft['status'])}><option value="ativo">Ativo</option><option value="pausado">Pausado</option><option value="vendido">Vendido</option></select>
            </Field>
            <label className="flex cursor-pointer items-center gap-2 text-sm"><input type="checkbox" className="h-4 w-4 accent-accent" checked={d.acceptsTrade} onChange={(e) => set('acceptsTrade', e.target.checked)} /> Aceita troca</label>
            <label className="flex cursor-pointer items-center gap-2 text-sm"><input type="checkbox" className="h-4 w-4 accent-accent" checked={d.featured} onChange={(e) => set('featured', e.target.checked)} /> Anúncio em destaque</label>
          </Section>

          <Section title="Descrição">
            <Field label="Texto do anúncio" full><textarea rows={5} className="input" value={d.description} onChange={(e) => set('description', e.target.value)} placeholder="Conte os diferenciais, histórico de revisões, estado de conservação…" /></Field>
          </Section>

          <section className="card p-6">
            <h2 className="font-display text-lg font-semibold">Fotos</h2>
            <p className="text-xs text-ink-mute">Upload vira base64 e é salvo no localStorage, que é limitado (~5 MB no total). Até {MAX_MB} MB por imagem; prefira colar URLs.</p>

            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {d.photos.map((p, i) => (
                <div key={i} className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-paper-line">
                  <img src={p} alt="" className="h-full w-full object-cover" />
                  {i === 0 && <span className="absolute left-1.5 top-1.5 rounded bg-accent px-1.5 py-0.5 text-[10px] font-bold text-white">CAPA</span>}
                  <button type="button" onClick={() => set('photos', d.photos.filter((_, k) => k !== i))} className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-white/95 text-red-600 opacity-0 shadow transition group-hover:opacity-100"><Trash2 size={13} /></button>
                </div>
              ))}
              <label className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-paper-line text-xs font-medium text-ink-soft transition hover:border-accent hover:text-accent">
                <Upload size={20} /> Enviar foto
                <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => { onFiles(e.target.files); e.target.value = '' }} />
              </label>
            </div>
            {errors.photos && <p className="mt-2 text-xs font-medium text-red-600">{errors.photos}</p>}

            <div className="mt-4 flex gap-2">
              <div className="relative flex-1">
                <Link2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-mute" />
                <input className="input pl-10" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Colar URL de uma imagem (https://…)" />
              </div>
              <button type="button" className="btn-ghost" onClick={() => { if (/^https?:\/\//.test(url)) { set('photos', [...d.photos, url]); setUrl('') } else toast('Informe uma URL válida', 'err') }}><Plus size={16} /> Adicionar</button>
            </div>
            <button type="button" className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-accent-dark hover:underline" onClick={() => set('photos', [...d.photos, ...[0, 1, 2].map((k) => `https://picsum.photos/seed/${Date.now()}-${k}/1200/800`)])}>
              <ImagePlus size={14} /> Usar fotos de exemplo
            </button>
          </section>
        </div>

        <aside className="xl:sticky xl:top-24 xl:self-start">
          <p className="label">Pré-visualização do card</p>
          <VehicleCard v={preview} preview />
          <p className="mt-3 text-xs text-ink-mute">É assim que o anúncio aparece na busca pública.</p>
        </aside>
      </div>
    </form>
  )
}
