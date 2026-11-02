import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { LayoutGrid, List, PackageSearch, Search, SlidersHorizontal, X } from 'lucide-react'
import { useStore } from '../lib/store'
import type { Filters } from '../lib/types'
import { activeFilterCount, applyFilters, DEFAULT_FILTERS, filtersFromParams, filtersToParams, SORT_LABELS } from '../lib/filters'
import { ALL_BRANDS, CATALOG } from '../lib/seed'
import { FiltersPanel } from '../components/FiltersPanel'
import { CardSkeleton, VehicleCard } from '../components/VehicleCard'
import { useFakeLoading } from '../components/ui'

const PAGE = 9

export default function Home() {
  const vehicles = useStore((s) => s.vehicles)
  const [params, setParams] = useSearchParams()
  const f = useMemo(() => filtersFromParams(params), [params])
  const [list, setList] = useState(false)
  const [drawer, setDrawer] = useState(false)
  const [shown, setShown] = useState(PAGE)
  const loading = useFakeLoading([params.toString()], 400)

  const results = useMemo(() => applyFilters(vehicles, f), [vehicles, f])
  const activeCount = activeFilterCount(f)

  const set = (patch: Partial<Filters>) => {
    setParams(filtersToParams({ ...f, ...patch }), { replace: true })
    setShown(PAGE)
  }
  const reset = () => { setParams(new URLSearchParams(), { replace: true }); setShown(PAGE) }

  useEffect(() => {
    document.body.style.overflow = drawer ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawer])

  // hero quick search
  const [hb, setHb] = useState('')
  const [hm, setHm] = useState('')
  const [hp, setHp] = useState('')
  const quick = () => {
    const pmax = hp ? Number(hp) : DEFAULT_FILTERS.priceMax
    set({ brand: hb, model: hm, priceMax: pmax })
    document.getElementById('resultados')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <img src="/vehicles/banner.jpg" alt="" className="absolute inset-y-0 right-0 h-full w-full object-cover object-center lg:w-[56%]" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/10 lg:from-[44%] lg:via-slate-950/30 lg:via-[62%] lg:to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:py-24">
          <h1 className="max-w-2xl text-balance text-4xl font-semibold tracking-tight sm:text-6xl">Seu próximo carro começa aqui.</h1>
          <p className="mt-4 max-w-lg text-lg text-white/80">Compare preços, quilometragem e versões em um só lugar e simule o financiamento antes de falar com o vendedor.</p>

          <div className="card mt-8 grid max-w-2xl gap-2 p-2 text-ink shadow-lift sm:grid-cols-[1fr_1fr_1fr_auto]">
            <select className="input" value={hb} onChange={(e) => { setHb(e.target.value); setHm('') }}>
              <option value="">Marca</option>{ALL_BRANDS.map((b) => <option key={b}>{b}</option>)}
            </select>
            <select className="input" value={hm} onChange={(e) => setHm(e.target.value)}>
              <option value="">Modelo</option>{(hb ? CATALOG[hb].models : []).map((m) => <option key={m}>{m}</option>)}
            </select>
            <select className="input" value={hp} onChange={(e) => setHp(e.target.value)}>
              <option value="">Preço máximo</option>
              {[60000, 100000, 150000, 200000, 300000].map((p) => <option key={p} value={p}>Até R$ {p.toLocaleString('pt-BR')}</option>)}
            </select>
            <button onClick={quick} className="btn-primary"><Search size={16} /> Buscar</button>
          </div>
        </div>
      </section>

      <section id="resultados" className="mx-auto max-w-7xl scroll-mt-20 px-4 pt-10">
        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          {/* sidebar desktop */}
          <aside className="card hidden h-fit self-start p-5 lg:sticky lg:top-24 lg:block">
            <FiltersPanel f={f} set={set} reset={reset} count={results.length} />
          </aside>

          {/* drawer mobile */}
          {drawer && (
            <div className="fixed inset-0 z-[80] lg:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setDrawer(false)} />
              <div className="absolute inset-y-0 left-0 flex w-[88%] max-w-sm animate-slideIn flex-col bg-paper">
                <div className="flex items-center justify-between border-b border-paper-line px-4 py-3">
                  <h3 className="text-base font-semibold">Filtros</h3>
                  <button onClick={() => setDrawer(false)}><X size={20} /></button>
                </div>
                <div className="flex-1 overflow-y-auto px-4 pb-4"><FiltersPanel f={f} set={set} reset={reset} count={results.length} /></div>
                <div className="border-t border-paper-line p-3">
                  <button className="btn-primary w-full" onClick={() => setDrawer(false)}>Ver {results.length} resultados</button>
                </div>
              </div>
            </div>
          )}

          <div>
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <button onClick={() => setDrawer(true)} className="btn-ghost lg:hidden">
                <SlidersHorizontal size={16} /> Filtros{activeCount > 0 && <span className="rounded-full bg-accent px-1.5 text-[11px] text-white">{activeCount}</span>}
              </button>
              <p className="mr-auto text-sm text-ink-soft"><strong className="text-ink">{results.length}</strong> veículos encontrados</p>
              <select className="input !w-auto" value={f.sort} onChange={(e) => set({ sort: e.target.value as Filters['sort'] })}>
                {Object.entries(SORT_LABELS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
              </select>
              <div className="flex overflow-hidden rounded-lg border border-paper-line bg-white">
                <button onClick={() => setList(false)} className={`grid h-10 w-10 place-items-center ${!list ? 'bg-accent-soft text-accent' : ''}`} aria-label="Grade"><LayoutGrid size={16} /></button>
                <button onClick={() => setList(true)} className={`grid h-10 w-10 place-items-center ${list ? 'bg-accent-soft text-accent' : ''}`} aria-label="Lista"><List size={16} /></button>
              </div>
            </div>

            {loading ? (
              <div className={list ? 'space-y-4' : 'grid gap-5 sm:grid-cols-2 xl:grid-cols-3'}>
                {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} list={list} />)}
              </div>
            ) : results.length === 0 ? (
              <div className="card flex flex-col items-center px-6 py-16 text-center">
                <span className="grid h-16 w-16 place-items-center rounded-xl bg-accent-soft text-accent"><PackageSearch size={30} /></span>
                <h3 className="mt-4 text-base font-semibold">Nenhum veículo encontrado</h3>
                <p className="mt-1 max-w-sm text-sm text-ink-soft">Remova filtros ou amplie a faixa de preço.</p>
                <button onClick={reset} className="btn-primary mt-5">Limpar filtros</button>
              </div>
            ) : (
              <>
                <div className={list ? 'space-y-4' : 'grid gap-5 sm:grid-cols-2 xl:grid-cols-3'}>
                  {results.slice(0, shown).map((v) => <VehicleCard key={v.id} v={v} list={list} />)}
                </div>
                {shown < results.length && (
                  <div className="mt-8 text-center">
                    <button className="btn-ghost" onClick={() => setShown((n) => n + PAGE)}>
                      Carregar mais ({results.length - shown} restantes)
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
