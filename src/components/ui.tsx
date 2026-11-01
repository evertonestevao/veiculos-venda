import { useEffect, useState, type ReactNode } from 'react'
import { CheckCircle2, X, XCircle } from 'lucide-react'
import { useToasts } from '../lib/store'

export function Toaster() {
  const { toasts, drop } = useToasts()
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex animate-pop items-center gap-2.5 rounded-xl bg-ink px-4 py-3 text-sm font-medium text-white shadow-lift"
        >
          {t.kind === 'ok' ? <CheckCircle2 size={18} className="text-emerald-400" /> : <XCircle size={18} className="text-red-400" />}
          {t.text}
          <button onClick={() => drop(t.id)} className="ml-1 opacity-60 hover:opacity-100"><X size={14} /></button>
        </div>
      ))}
    </div>
  )
}

export function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) {
  useEffect(() => {
    if (!open) return
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-4" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`card w-full animate-pop overflow-hidden rounded-b-none sm:rounded-b-2xl ${wide ? 'max-w-2xl' : 'max-w-md'}`}
      >
        <div className="flex items-center justify-between border-b border-paper-line px-5 py-4">
          <h3 className="font-display text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1 text-ink-mute hover:bg-paper"><X size={18} /></button>
        </div>
        <div className="max-h-[75vh] overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  )
}

export function ConfirmModal({ open, onClose, onConfirm, title, text, confirmLabel = 'Excluir' }: {
  open: boolean; onClose: () => void; onConfirm: () => void; title: string; text: string; confirmLabel?: string
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-sm text-ink-soft">{text}</p>
      <div className="mt-5 flex justify-end gap-2">
        <button className="btn-ghost" onClick={onClose}>Cancelar</button>
        <button className="btn-danger" onClick={() => { onConfirm(); onClose() }}>{confirmLabel}</button>
      </div>
    </Modal>
  )
}

export function DualRange({ min, max, step, value, onChange }: {
  min: number; max: number; step: number; value: [number, number]; onChange: (v: [number, number]) => void
}) {
  const [lo, hi] = value
  const pct = (n: number) => ((n - min) / (max - min)) * 100
  return (
    <div className="relative h-8">
      <div className="absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-paper-line" />
      <div className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-accent" style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }} />
      {[0, 1].map((i) => (
        <input
          key={i}
          type="range"
          min={min} max={max} step={step}
          value={i === 0 ? lo : hi}
          onChange={(e) => {
            const n = Number(e.target.value)
            onChange(i === 0 ? [Math.min(n, hi - step), hi] : [lo, Math.max(n, lo + step)])
          }}
          className="pointer-events-none absolute inset-0 h-8 w-full appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-accent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:shadow"
        />
      ))}
    </div>
  )
}

/** Simula carregamento (skeleton) por um instante. */
export function useFakeLoading(deps: unknown[] = [], ms = 450) {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), ms)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return loading
}

export function StatusBadge({ status }: { status: 'ativo' | 'pausado' | 'vendido' }) {
  const map = {
    ativo: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    pausado: 'bg-amber-50 text-amber-700 border-amber-200',
    vendido: 'bg-slate-100 text-slate-600 border-slate-200',
  }
  return <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${map[status]}`}>{status}</span>
}
