import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowUpDown, CheckCircle2, Copy, Pause, Pencil, Play, Plus, Search, Trash2 } from 'lucide-react'
import { toast, useStore } from '../../lib/store'
import { brl, dateBR } from '../../lib/format'
import { ConfirmModal, StatusBadge } from '../../components/ui'
import type { Vehicle } from '../../lib/types'

type SortCol = 'createdAt' | 'price' | 'year' | 'views'

export default function VehiclesList() {
  const nav = useNavigate()
  const { vehicles, setStatus, removeVehicles, duplicateVehicle } = useStore()
  const [q, setQ] = useState('')
  const [status, setSt] = useState('')
  const [sort, setSort] = useState<{ col: SortCol; dir: 1 | -1 }>({ col: 'createdAt', dir: -1 })
  const [sel, setSel] = useState<string[]>([])
  const [del, setDel] = useState<string[] | null>(null)

  const rows = useMemo(() => {
    const t = q.toLowerCase()
    const r = vehicles.filter((v) =>
      (!status || v.status === status) &&
      (!t || `${v.brand} ${v.model} ${v.version} ${v.city}`.toLowerCase().includes(t)),
    )
    return r.sort((a, b) => {
      const av = sort.col === 'createdAt' ? +new Date(a.createdAt) : (a[sort.col] as number)
      const bv = sort.col === 'createdAt' ? +new Date(b.createdAt) : (b[sort.col] as number)
      return (av - bv) * sort.dir
    })
  }, [vehicles, q, status, sort])

  const allSel = rows.length > 0 && rows.every((r) => sel.includes(r.id))
  const toggleSort = (col: SortCol) => setSort((s) => (s.col === col ? { col, dir: (s.dir * -1) as 1 | -1 } : { col, dir: -1 }))
  const Th = ({ col, children }: { col: SortCol; children: string }) => (
    <th className="px-4 py-3">
      <button onClick={() => toggleSort(col)} className="inline-flex items-center gap-1 font-medium">{children}<ArrowUpDown size={12} className={sort.col === col ? 'text-accent' : 'opacity-40'} /></button>
    </th>
  )

  const act = (ids: string[], s: Vehicle['status'], msg: string) => { setStatus(ids, s); setSel([]); toast(msg) }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Veículos</h1>
          <p className="text-sm text-ink-soft">{vehicles.length} anúncios cadastrados.</p>
        </div>
        <Link to="/admin/veiculos/novo" className="btn-accent"><Plus size={16} /> Novo veículo</Link>
      </div>

      <div className="card flex flex-wrap items-center gap-3 p-3">
        <div className="relative min-w-[200px] flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-mute" />
          <input className="input pl-10" placeholder="Buscar por marca, modelo ou cidade" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <select className="input !w-auto" value={status} onChange={(e) => setSt(e.target.value)}>
          <option value="">Todos os status</option><option value="ativo">Ativos</option><option value="pausado">Pausados</option><option value="vendido">Vendidos</option>
        </select>
      </div>

      {sel.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl bg-accent-soft px-4 py-3 text-sm text-ink">
          <span className="mr-auto font-medium">{sel.length} selecionado(s)</span>
          <button className="rounded-lg bg-white/10 px-3 py-1.5 hover:bg-white/20" onClick={() => act(sel, 'ativo', 'Anúncios ativados')}>Ativar</button>
          <button className="rounded-lg bg-white/10 px-3 py-1.5 hover:bg-white/20" onClick={() => act(sel, 'pausado', 'Anúncios pausados')}>Pausar</button>
          <button className="rounded-lg bg-white/10 px-3 py-1.5 hover:bg-white/20" onClick={() => act(sel, 'vendido', 'Marcados como vendidos')}>Vendido</button>
          <button className="rounded-lg bg-red-600 px-3 py-1.5 hover:bg-red-700" onClick={() => setDel(sel)}>Excluir</button>
        </div>
      )}

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-xs text-ink-soft">
          <thead className="border-b border-paper-line bg-paper">
            <tr>
              <th className="w-10 px-4 py-3"><input type="checkbox" className="accent-accent" checked={allSel} onChange={(e) => setSel(e.target.checked ? rows.map((r) => r.id) : [])} /></th>
              <th className="px-4 py-3 font-medium">Veículo</th>
              <Th col="price">Preço</Th><Th col="year">Ano</Th><Th col="views">Views</Th><Th col="createdAt">Cadastro</Th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-paper-line text-sm">
            {rows.map((v) => (
              <tr key={v.id} className="transition hover:bg-paper/60">
                <td className="px-4 py-3"><input type="checkbox" className="accent-accent" checked={sel.includes(v.id)} onChange={(e) => setSel(e.target.checked ? [...sel, v.id] : sel.filter((x) => x !== v.id))} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={v.photos[0]} alt="" className="h-11 w-16 rounded-lg bg-paper-line object-cover" />
                    <div><p className="font-semibold text-ink">{v.brand} {v.model}</p><p className="line-clamp-1 text-xs text-ink-mute">{v.version}</p></div>
                  </div>
                </td>
                <td className="px-4 py-3 font-semibold text-ink">{brl(v.price)}</td>
                <td className="px-4 py-3">{v.year}</td>
                <td className="px-4 py-3">{v.views}</td>
                <td className="px-4 py-3">{dateBR(v.createdAt)}</td>
                <td className="px-4 py-3"><StatusBadge status={v.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <IconBtn title="Editar" onClick={() => nav(`/admin/veiculos/${v.id}/editar`)}><Pencil size={15} /></IconBtn>
                    <IconBtn title="Duplicar" onClick={() => { duplicateVehicle(v.id); toast('Anúncio duplicado (pausado)') }}><Copy size={15} /></IconBtn>
                    {v.status === 'pausado'
                      ? <IconBtn title="Ativar" onClick={() => act([v.id], 'ativo', 'Anúncio ativado')}><Play size={15} /></IconBtn>
                      : <IconBtn title="Pausar" onClick={() => act([v.id], 'pausado', 'Anúncio pausado')}><Pause size={15} /></IconBtn>}
                    <IconBtn title="Marcar como vendido" onClick={() => act([v.id], 'vendido', 'Marcado como vendido')}><CheckCircle2 size={15} /></IconBtn>
                    <IconBtn title="Excluir" danger onClick={() => setDel([v.id])}><Trash2 size={15} /></IconBtn>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={8} className="px-4 py-12 text-center text-ink-mute">Nenhum veículo encontrado.</td></tr>}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        open={!!del} onClose={() => setDel(null)}
        onConfirm={() => { removeVehicles(del!); setSel([]); toast('Anúncio(s) excluído(s)') }}
        title="Excluir anúncio" text={`Tem certeza que deseja excluir ${del?.length ?? 0} anúncio(s)? Esta ação não pode ser desfeita.`}
      />
    </div>
  )
}

function IconBtn({ children, title, onClick, danger }: { children: React.ReactNode; title: string; onClick: () => void; danger?: boolean }) {
  return (
    <button title={title} aria-label={title} onClick={onClick} className={`grid h-8 w-8 place-items-center rounded-lg transition ${danger ? 'text-red-600 hover:bg-red-50' : 'text-ink-soft hover:bg-paper hover:text-ink'}`}>
      {children}
    </button>
  )
}
