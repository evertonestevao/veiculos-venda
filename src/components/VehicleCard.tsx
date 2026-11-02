import { Link } from 'react-router-dom'
import { Fuel, Gauge, Heart, MapPin, Settings2, Star } from 'lucide-react'
import type { Vehicle } from '../lib/types'
import { brl, km } from '../lib/format'
import { toast, useStore } from '../lib/store'

export function VehicleCard({ v, list, preview }: { v: Vehicle; list?: boolean; preview?: boolean }) {
  const fav = useStore((s) => s.favorites.includes(v.id))
  const toggle = useStore((s) => s.toggleFavorite)

  const body = (
    <>
      <div className={`relative overflow-hidden bg-paper-line ${list ? 'aspect-[4/3] w-48 shrink-0 sm:w-72' : 'aspect-[4/3]'}`}>
        {v.photos[0] ? (
          <img src={v.photos[0]} alt={`${v.brand} ${v.model}`} loading="lazy" className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]" />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-ink-mute">Sem foto</div>
        )}
        {v.featured && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-white">
            <Star size={11} fill="currentColor" /> Destaque
          </span>
        )}
        {v.condition === 'Novo' && (
          <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-medium text-ink">0 km</span>
        )}
        {!preview && (
          <button
            onClick={(e) => {
              e.preventDefault()
              toggle(v.id)
              toast(fav ? 'Removido dos favoritos' : 'Adicionado aos favoritos')
            }}
            aria-label="Favoritar"
            className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/95 transition hover:bg-white"
          >
            <Heart size={17} className={fav ? 'fill-red-500 text-red-500' : 'text-ink'} />
          </button>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium text-ink-mute">{v.brand}</p>
        <h3 className="mt-0.5 text-base font-semibold leading-tight">{v.model}</h3>
        <p className="line-clamp-1 text-sm text-ink-soft">{v.version}</p>
        <p className="mt-3 text-lg font-semibold tracking-tight">{brl(v.price)}</p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-ink-soft">
          <span>{v.year}</span>
          <span className="inline-flex items-center gap-1"><Gauge size={13} />{km(v.km)}</span>
          <span className="inline-flex items-center gap-1"><Settings2 size={13} />{v.transmission}</span>
          <span className="inline-flex items-center gap-1"><Fuel size={13} />{v.fuel}</span>
        </div>
        <p className="mt-auto inline-flex items-center gap-1 pt-3 text-xs text-ink-mute"><MapPin size={13} />{v.city} - {v.state}</p>
      </div>
    </>
  )

  const cls = `group card flex overflow-hidden transition hover:shadow-lift ${list ? 'flex-row' : 'flex-col'}`
  if (preview) return <div className={cls}>{body}</div>
  return <Link to={`/veiculo/${v.id}`} className={`${cls} animate-fadeUp`}>{body}</Link>
}

export function CardSkeleton({ list }: { list?: boolean }) {
  return (
    <div className={`card flex overflow-hidden ${list ? 'flex-row' : 'flex-col'}`}>
      <div className={`skeleton rounded-none ${list ? 'aspect-[4/3] w-48 sm:w-72' : 'aspect-[4/3]'}`} />
      <div className="flex-1 space-y-3 p-4">
        <div className="skeleton h-3 w-1/4" />
        <div className="skeleton h-5 w-2/3" />
        <div className="skeleton h-6 w-1/3" />
        <div className="skeleton h-3 w-full" />
      </div>
    </div>
  )
}
