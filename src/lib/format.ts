export const brl = (n: number) =>
  n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

export const brlFull = (n: number) =>
  n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export const km = (n: number) => (n === 0 ? '0 km' : `${n.toLocaleString('pt-BR')} km`)

export const dateBR = (iso: string) =>
  new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4)

/** Parcela com juros compostos (Tabela Price). */
export function installment(principal: number, months: number, monthlyRatePct: number) {
  if (principal <= 0 || months <= 0) return 0
  const i = monthlyRatePct / 100
  if (i === 0) return principal / months
  return (principal * i) / (1 - Math.pow(1 + i, -months))
}
