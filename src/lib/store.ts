import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Message, StoreProfile, Vehicle } from './types'
import { STOCK_PHOTOS, stockFields } from './stockPhotos'
import { buildCivicVehicle, buildSeedMessages, buildSeedVehicles, DEFAULT_PROFILE } from './seed'
import { uid } from './format'

export interface Toast { id: string; text: string; kind: 'ok' | 'err' }

interface State {
  vehicles: Vehicle[]
  messages: Message[]
  favorites: string[]
  profile: StoreProfile
  logged: boolean
  dark: boolean

  login: () => void
  logout: () => void
  toggleDark: () => void
  toggleFavorite: (id: string) => void

  addVehicle: (v: Omit<Vehicle, 'id' | 'createdAt' | 'views'>) => string
  updateVehicle: (id: string, patch: Partial<Vehicle>) => void
  removeVehicles: (ids: string[]) => void
  duplicateVehicle: (id: string) => void
  setStatus: (ids: string[], status: Vehicle['status']) => void
  hit: (id: string) => void

  markRead: (id: string) => void
  addMessage: (m: Omit<Message, 'id' | 'date' | 'read'>) => void
  saveProfile: (p: StoreProfile) => void
  resetSeed: () => void
}

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      vehicles: buildSeedVehicles(),
      messages: buildSeedMessages(),
      favorites: [],
      profile: DEFAULT_PROFILE,
      logged: false,
      dark: false,

      login: () => set({ logged: true }),
      logout: () => set({ logged: false }),
      toggleDark: () => set((s) => ({ dark: !s.dark })),
      toggleFavorite: (id) =>
        set((s) => ({ favorites: s.favorites.includes(id) ? s.favorites.filter((f) => f !== id) : [...s.favorites, id] })),

      addVehicle: (v) => {
        const id = uid()
        set((s) => ({ vehicles: [{ ...v, id, createdAt: new Date().toISOString(), views: 0 }, ...s.vehicles] }))
        return id
      },
      updateVehicle: (id, patch) =>
        set((s) => ({ vehicles: s.vehicles.map((v) => (v.id === id ? { ...v, ...patch } : v)) })),
      removeVehicles: (ids) => set((s) => ({ vehicles: s.vehicles.filter((v) => !ids.includes(v.id)) })),
      duplicateVehicle: (id) => {
        const v = get().vehicles.find((x) => x.id === id)
        if (!v) return
        set((s) => ({
          vehicles: [{ ...v, id: uid(), model: v.model, version: `${v.version} (cópia)`, createdAt: new Date().toISOString(), views: 0, status: 'pausado' }, ...s.vehicles],
        }))
      },
      setStatus: (ids, status) =>
        set((s) => ({ vehicles: s.vehicles.map((v) => (ids.includes(v.id) ? { ...v, status } : v)) })),
      hit: (id) => set((s) => ({ vehicles: s.vehicles.map((v) => (v.id === id ? { ...v, views: v.views + 1 } : v)) })),

      markRead: (id) => set((s) => ({ messages: s.messages.map((m) => (m.id === id ? { ...m, read: true } : m)) })),
      addMessage: (m) =>
        set((s) => ({ messages: [{ ...m, id: uid(), date: new Date().toISOString(), read: false }, ...s.messages] })),
      saveProfile: (profile) => set({ profile }),
      resetSeed: () => {
        localStorage.removeItem('automarket-store')
        window.location.href = '/'
      },
    }),
    {
      name: 'automarket-store',
      version: 3,
      migrate: (persisted, version) => {
        const state = persisted as State
        // Inclui o anúncio do Civic para quem já tem dados salvos no navegador.
        const vehicles = version < 1 && !state.vehicles.some((v) => v.id === 'civic-lxr') ? [buildCivicVehicle(), ...state.vehicles] : state.vehicles
        // Troca só as imagens de exemplo antigas, preservando fotos enviadas pelo anunciante.
        return {
          ...state,
          vehicles: vehicles.map((v) => {
            const stock = STOCK_PHOTOS[v.id]
            const isSample = v.photos[0]?.includes('picsum.photos') || (v.photos.length === 1 && v.photos[0] === stock?.photos[0].photo)
            return stock && isSample ? { ...v, ...stockFields(v.id) } : v
          }),
        }
      },
      // O estado de "logado" também fica aqui (sem autenticação real).
    },
  ),
)

// --- toasts (fora do persist) ---
interface ToastState { toasts: Toast[]; push: (text: string, kind?: Toast['kind']) => void; drop: (id: string) => void }
export const useToasts = create<ToastState>((set) => ({
  toasts: [],
  push: (text, kind = 'ok') => {
    const id = uid()
    set((s) => ({ toasts: [...s.toasts, { id, text, kind }] }))
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 3200)
  },
  drop: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))
export const toast = (text: string, kind: Toast['kind'] = 'ok') => useToasts.getState().push(text, kind)
