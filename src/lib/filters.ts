import type { Filters, SortKey, Vehicle } from './types'

export const PRICE_MAX_DEFAULT = 400_000

export const DEFAULT_FILTERS: Filters = {
  q: '', type: '', brand: '', model: '', priceMin: 0, priceMax: PRICE_MAX_DEFAULT,
  yearMin: '', yearMax: '', kmMax: '', transmission: '', fuel: '', color: '', state: '', city: '',
  options: [], condition: '', trade: false, sort: 'recentes',
}

export const SORT_LABELS: Record<SortKey, string> = {
  recentes: 'Mais recentes',
  'menor-preco': 'Menor preço',
  'maior-preco': 'Maior preço',
  'menor-km': 'Menor km',
  'mais-novos': 'Mais novos',
}

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

export function applyFilters(list: Vehicle[], f: Filters): Vehicle[] {
  const q = norm(f.q.trim())
  const out = list.filter((v) => {
    if (v.status !== 'ativo') return false
    if (q && !norm(`${v.brand} ${v.model} ${v.version} ${v.color} ${v.city}`).includes(q)) return false
    if (f.type && v.type !== f.type) return false
    if (f.brand && v.brand !== f.brand) return false
    if (f.model && v.model !== f.model) return false
    if (v.price < f.priceMin || v.price > f.priceMax) return false
    if (f.yearMin && v.year < Number(f.yearMin)) return false
    if (f.yearMax && v.year > Number(f.yearMax)) return false
    if (f.kmMax && v.km > Number(f.kmMax)) return false
    if (f.transmission && v.transmission !== f.transmission) return false
    if (f.fuel && v.fuel !== f.fuel) return false
    if (f.color && v.color !== f.color) return false
    if (f.state && v.state !== f.state) return false
    if (f.city && v.city !== f.city) return false
    if (f.condition && v.condition !== f.condition) return false
    if (f.trade && !v.acceptsTrade) return false
    if (f.options.length && !f.options.every((o) => v.options.includes(o))) return false
    return true
  })
  return sortVehicles(out, f.sort)
}

export function sortVehicles(list: Vehicle[], sort: SortKey): Vehicle[] {
  const arr = [...list]
  switch (sort) {
    case 'menor-preco': return arr.sort((a, b) => a.price - b.price)
    case 'maior-preco': return arr.sort((a, b) => b.price - a.price)
    case 'menor-km': return arr.sort((a, b) => a.km - b.km)
    case 'mais-novos': return arr.sort((a, b) => b.year - a.year || a.km - b.km)
    default: return arr.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
  }
}

/** Filtros <-> query string */
export function filtersFromParams(p: URLSearchParams): Filters {
  const g = (k: string) => p.get(k) ?? ''
  return {
    q: g('q'), type: g('tipo'), brand: g('marca'), model: g('modelo'),
    priceMin: Number(g('pmin')) || 0,
    priceMax: Number(g('pmax')) || PRICE_MAX_DEFAULT,
    yearMin: g('amin'), yearMax: g('amax'), kmMax: g('kmmax'),
    transmission: g('cambio'), fuel: g('comb'), color: g('cor'), state: g('uf'), city: g('cidade'),
    options: p.get('opc') ? p.get('opc')!.split('|').filter(Boolean) : [],
    condition: g('cond'), trade: g('troca') === '1',
    sort: (g('ord') as SortKey) || 'recentes',
  }
}

export function filtersToParams(f: Filters): URLSearchParams {
  const p = new URLSearchParams()
  const set = (k: string, v: string) => v && p.set(k, v)
  set('q', f.q); set('tipo', f.type); set('marca', f.brand); set('modelo', f.model)
  if (f.priceMin > 0) p.set('pmin', String(f.priceMin))
  if (f.priceMax < PRICE_MAX_DEFAULT) p.set('pmax', String(f.priceMax))
  set('amin', f.yearMin); set('amax', f.yearMax); set('kmmax', f.kmMax)
  set('cambio', f.transmission); set('comb', f.fuel); set('cor', f.color); set('uf', f.state); set('cidade', f.city)
  if (f.options.length) p.set('opc', f.options.join('|'))
  set('cond', f.condition)
  if (f.trade) p.set('troca', '1')
  if (f.sort !== 'recentes') p.set('ord', f.sort)
  return p
}

export function activeFilterCount(f: Filters): number {
  let n = 0
  if (f.q) n++
  for (const k of ['type', 'brand', 'model', 'yearMin', 'yearMax', 'kmMax', 'transmission', 'fuel', 'color', 'state', 'city', 'condition'] as const) if (f[k]) n++
  if (f.priceMin > 0 || f.priceMax < PRICE_MAX_DEFAULT) n++
  if (f.options.length) n++
  if (f.trade) n++
  return n
}
