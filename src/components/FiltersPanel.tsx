import { RotateCcw } from 'lucide-react'
import type { Filters } from '../lib/types'
import { ALL_BRANDS, CATALOG, COLORS, OPTIONS, STATES } from '../lib/seed'
import { brl } from '../lib/format'
import { PRICE_MAX_DEFAULT } from '../lib/filters'
import { DualRange } from './ui'

const years = Array.from({ length: 27 }, (_, i) => String(2026 - i))

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-paper-line py-4 last:border-0">
      <p className="label">{title}</p>
      {children}
    </div>
  )
}

export function FiltersPanel({ f, set, reset, count }: {
  f: Filters; set: (patch: Partial<Filters>) => void; reset: () => void; count: number
}) {
  const models = f.brand ? CATALOG[f.brand]?.models ?? [] : Object.values(CATALOG).flatMap((c) => c.models).sort()
  const cities = f.state ? STATES[f.state] ?? [] : Object.values(STATES).flat().sort()

  const Chips = ({ items, value, onPick }: { items: string[]; value: string; onPick: (v: string) => void }) => (
    <div className="flex flex-wrap gap-2">
      {items.map((i) => (
        <button
          key={i}
          onClick={() => onPick(value === i ? '' : i)}
          className={`chip ${value === i ? 'border-accent bg-accent-soft text-accent' : 'border-paper-line bg-white hover:border-ink-mute'}`}
        >
          {i}
        </button>
      ))}
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between pb-2">
        <p className="text-sm font-semibold">{count} {count === 1 ? 'resultado' : 'resultados'}</p>
        <button onClick={reset} className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent-dark hover:underline">
          <RotateCcw size={13} /> Limpar filtros
        </button>
      </div>

      <Section title="Tipo">
        <Chips items={['Carro', 'Moto', 'SUV', 'Caminhonete']} value={f.type} onPick={(v) => set({ type: v })} />
      </Section>

      <Section title="Marca e modelo">
        <div className="space-y-2">
          <select className="input" value={f.brand} onChange={(e) => set({ brand: e.target.value, model: '' })}>
            <option value="">Todas as marcas</option>
            {ALL_BRANDS.map((b) => <option key={b}>{b}</option>)}
          </select>
          <select className="input" value={f.model} onChange={(e) => set({ model: e.target.value })}>
            <option value="">Todos os modelos</option>
            {models.map((m) => <option key={m}>{m}</option>)}
          </select>
        </div>
      </Section>

      <Section title="Faixa de preço">
        <DualRange min={0} max={PRICE_MAX_DEFAULT} step={5000} value={[f.priceMin, f.priceMax]} onChange={([a, b]) => set({ priceMin: a, priceMax: b })} />
        <div className="mt-1 flex justify-between text-xs font-medium text-ink-soft">
          <span>{brl(f.priceMin)}</span>
          <span>{f.priceMax >= PRICE_MAX_DEFAULT ? `${brl(f.priceMax)}+` : brl(f.priceMax)}</span>
        </div>
      </Section>

      <Section title="Ano">
        <div className="grid grid-cols-2 gap-2">
          <select className="input" value={f.yearMin} onChange={(e) => set({ yearMin: e.target.value })}>
            <option value="">De</option>{years.map((y) => <option key={y}>{y}</option>)}
          </select>
          <select className="input" value={f.yearMax} onChange={(e) => set({ yearMax: e.target.value })}>
            <option value="">Até</option>{years.map((y) => <option key={y}>{y}</option>)}
          </select>
        </div>
      </Section>

      <Section title="Quilometragem máxima">
        <select className="input" value={f.kmMax} onChange={(e) => set({ kmMax: e.target.value })}>
          <option value="">Qualquer</option>
          {[0, 10000, 30000, 50000, 80000, 120000].map((k) => (
            <option key={k} value={k}>{k === 0 ? 'Zero km' : `Até ${k.toLocaleString('pt-BR')} km`}</option>
          ))}
        </select>
      </Section>

      <Section title="Câmbio">
        <Chips items={['Manual', 'Automático']} value={f.transmission} onPick={(v) => set({ transmission: v })} />
      </Section>

      <Section title="Combustível">
        <Chips items={['Flex', 'Gasolina', 'Diesel', 'Elétrico', 'Híbrido']} value={f.fuel} onPick={(v) => set({ fuel: v })} />
      </Section>

      <Section title="Cor">
        <Chips items={COLORS} value={f.color} onPick={(v) => set({ color: v })} />
      </Section>

      <Section title="Localização">
        <div className="grid grid-cols-2 gap-2">
          <select className="input" value={f.state} onChange={(e) => set({ state: e.target.value, city: '' })}>
            <option value="">Estado</option>{Object.keys(STATES).map((s) => <option key={s}>{s}</option>)}
          </select>
          <select className="input" value={f.city} onChange={(e) => set({ city: e.target.value })}>
            <option value="">Cidade</option>{cities.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </Section>

      <Section title="Condição">
        <Chips items={['Novo', 'Usado']} value={f.condition} onPick={(v) => set({ condition: v })} />
        <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm">
          <input type="checkbox" className="h-4 w-4 accent-accent" checked={f.trade} onChange={(e) => set({ trade: e.target.checked })} />
          Aceita troca
        </label>
      </Section>

      <Section title="Opcionais">
        <div className="space-y-2">
          {OPTIONS.map((o) => (
            <label key={o} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox" className="h-4 w-4 accent-accent"
                checked={f.options.includes(o)}
                onChange={(e) => set({ options: e.target.checked ? [...f.options, o] : f.options.filter((x) => x !== o) })}
              />
              {o}
            </label>
          ))}
        </div>
      </Section>
    </div>
  )
}
