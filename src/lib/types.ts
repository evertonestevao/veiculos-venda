export type VehicleType = 'Carro' | 'Moto' | 'SUV' | 'Caminhonete'
export type Transmission = 'Manual' | 'Automático'
export type Fuel = 'Flex' | 'Gasolina' | 'Diesel' | 'Elétrico' | 'Híbrido'
export type Condition = 'Novo' | 'Usado'
export type Status = 'ativo' | 'pausado' | 'vendido'

export interface PhotoCredit {
  author: string
  license: string
  source: string
}

export interface Vehicle {
  id: string
  type: VehicleType
  brand: string
  model: string
  version: string
  year: number
  km: number
  price: number
  transmission: Transmission
  fuel: Fuel
  color: string
  city: string
  state: string
  condition: Condition
  acceptsTrade: boolean
  featured: boolean
  status: Status
  options: string[]
  description: string
  photos: string[]
  photoCredit?: PhotoCredit
  views: number
  createdAt: string // ISO
  sellerName: string
  sellerPhone: string
}

export interface Message {
  id: string
  name: string
  email: string
  phone: string
  vehicleId: string
  text: string
  date: string
  read: boolean
}

export interface StoreProfile {
  name: string
  email: string
  phone: string
  city: string
  about: string
}

export interface Filters {
  q: string
  type: string
  brand: string
  model: string
  priceMin: number
  priceMax: number
  yearMin: string
  yearMax: string
  kmMax: string
  transmission: string
  fuel: string
  color: string
  state: string
  city: string
  options: string[]
  condition: string
  trade: boolean
  sort: SortKey
}

export type SortKey = 'recentes' | 'menor-preco' | 'maior-preco' | 'menor-km' | 'mais-novos'
