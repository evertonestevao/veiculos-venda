import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { useStore } from '../lib/store'
import { VehicleCard } from '../components/VehicleCard'

export default function Favorites() {
  const vehicles = useStore((s) => s.vehicles)
  const favs = useStore((s) => s.favorites)
  const list = vehicles.filter((v) => favs.includes(v.id))

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Meus favoritos</h1>
      <p className="mt-1 text-sm text-ink-soft">{list.length} veículo(s) salvo(s).</p>
      {list.length === 0 ? (
        <div className="card mt-8 flex flex-col items-center px-6 py-16 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-xl bg-accent-soft text-accent"><Heart size={28} /></span>
          <h3 className="mt-4 text-base font-semibold">Nenhum favorito salvo</h3>
          <p className="mt-1 text-sm text-ink-soft">Clique no coração de um anúncio para salvá-lo aqui.</p>
          <Link to="/" className="btn-primary mt-5">Explorar veículos</Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((v) => <VehicleCard key={v.id} v={v} />)}
        </div>
      )}
    </div>
  )
}
