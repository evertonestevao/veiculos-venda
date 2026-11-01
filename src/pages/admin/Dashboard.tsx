import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Car, CheckCircle2, Eye, PauseCircle, Tag } from 'lucide-react'
import { useStore } from '../../lib/store'
import { brl, dateBR } from '../../lib/format'
import { StatusBadge, useFakeLoading } from '../../components/ui'

export default function Dashboard() {
  const vehicles = useStore((s) => s.vehicles)
  const loading = useFakeLoading([], 350)

  const stats = useMemo(() => ({
    total: vehicles.length,
    ativos: vehicles.filter((v) => v.status === 'ativo').length,
    vendidos: vehicles.filter((v) => v.status === 'vendido').length,
    pausados: vehicles.filter((v) => v.status === 'pausado').length,
    views: vehicles.reduce((a, v) => a + v.views, 0),
  }), [vehicles])

  const chart = useMemo(() => {
    const months: { key: string; label: string; anuncios: number }[] = []
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      months.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', ''), anuncios: 0 })
    }
    vehicles.forEach((v) => {
      const d = new Date(v.createdAt)
      const m = months.find((x) => x.key === `${d.getFullYear()}-${d.getMonth()}`)
      if (m) m.anuncios++
    })
    return months
  }, [vehicles])

  const latest = [...vehicles].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 6)

  const cards = [
    { label: 'Total de veículos', value: stats.total, icon: Car },
    { label: 'Anúncios ativos', value: stats.ativos, icon: CheckCircle2 },
    { label: 'Vendidos', value: stats.vendidos, icon: Tag },
    { label: 'Visualizações', value: stats.views.toLocaleString('pt-BR'), icon: Eye },
  ]

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">Dashboard</h1>
        <p className="text-sm text-ink-soft">Resumo do seu estoque (dados fictícios).</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="card p-5">
            {loading ? <div className="skeleton h-16" /> : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-mute">{c.label}</p>
                  <p className="mt-1 font-display text-3xl font-bold">{c.value}</p>
                </div>
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent-soft text-accent"><c.icon size={22} /></span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        <div className="card p-6">
          <h2 className="font-display text-lg font-semibold">Anúncios por mês</h2>
          <p className="mb-4 text-xs text-ink-mute">Últimos 6 meses</p>
          <div className="h-64">
            {loading ? <div className="skeleton h-full" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chart}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8e4dc" />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} width={28} />
                  <Tooltip cursor={{ fill: 'rgba(200,137,43,.08)' }} contentStyle={{ borderRadius: 12, border: '1px solid #e8e4dc' }} />
                  <Bar dataKey="anuncios" name="Anúncios" fill="#c8892b" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Últimos cadastrados</h2>
            <Link to="/admin/veiculos" className="text-xs font-semibold text-accent-dark hover:underline">Ver todos</Link>
          </div>
          <ul className="mt-4 divide-y divide-paper-line">
            {latest.map((v) => (
              <li key={v.id}>
                <Link to={`/admin/veiculos/${v.id}/editar`} className="flex items-center gap-3 py-3 hover:opacity-80">
                  <img src={v.photos[0]} alt="" className="h-12 w-16 rounded-lg bg-paper-line object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{v.brand} {v.model}</p>
                    <p className="text-xs text-ink-mute">{brl(v.price)} · {dateBR(v.createdAt)}</p>
                  </div>
                  <StatusBadge status={v.status} />
                </Link>
              </li>
            ))}
          </ul>
          {stats.pausados > 0 && <p className="mt-3 flex items-center gap-1.5 text-xs text-ink-mute"><PauseCircle size={14} /> {stats.pausados} anúncio(s) pausado(s)</p>}
        </div>
      </div>
    </div>
  )
}
