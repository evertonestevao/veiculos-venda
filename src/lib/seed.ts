import type { Message, StoreProfile, Vehicle, VehicleType } from './types'


export const CATALOG: Record<string, { type: VehicleType; models: string[] }> = {
  Toyota: { type: 'Carro', models: ['Corolla', 'Yaris', 'Etios'] },
  Honda: { type: 'Carro', models: ['Civic', 'City', 'Fit'] },
  Volkswagen: { type: 'Carro', models: ['Golf', 'Polo', 'Virtus', 'Gol'] },
  Chevrolet: { type: 'Carro', models: ['Onix', 'Cruze', 'Tracker', 'S10'] },
  Fiat: { type: 'Carro', models: ['Argo', 'Cronos', 'Toro', 'Strada'] },
  Jeep: { type: 'SUV', models: ['Compass', 'Renegade', 'Commander'] },
  Hyundai: { type: 'SUV', models: ['Creta', 'HB20', 'Tucson'] },
  Ford: { type: 'Caminhonete', models: ['Ranger', 'Maverick'] },
  BMW: { type: 'Carro', models: ['320i', 'X1', 'R 1250 GS'] },
  Yamaha: { type: 'Moto', models: ['MT-07', 'Fazer 250', 'Lander 250'] },
  Kawasaki: { type: 'Moto', models: ['Ninja 400', 'Z400'] },
  BYD: { type: 'Carro', models: ['Dolphin', 'Seal'] },
}

export const ALL_BRANDS = Object.keys(CATALOG).sort()
export const COLORS = ['Branco', 'Preto', 'Prata', 'Cinza', 'Vermelho', 'Azul', 'Verde', 'Marrom']
export const OPTIONS = [
  'Ar-condicionado', 'Direção elétrica', 'Vidros elétricos', 'Teto solar', 'Bancos de couro',
  'Central multimídia', 'Câmera de ré', 'Sensor de estacionamento', 'Piloto automático',
  'Airbags', 'Freios ABS', 'Rodas de liga leve', 'Start/Stop', 'Bluetooth',
]
export const STATES: Record<string, string[]> = {
  SP: ['São Paulo', 'Campinas', 'Lins', 'Bauru', 'Ribeirão Preto'],
  RJ: ['Rio de Janeiro', 'Niterói'],
  MG: ['Belo Horizonte', 'Uberlândia'],
  PR: ['Curitiba', 'Londrina'],
  RS: ['Porto Alegre'],
  SC: ['Florianópolis'],
  GO: ['Goiânia'],
}

const SELLERS = [
  ['Carlos Mendes', '(14) 99999-0101'], ['Auto Prime Veículos', '(11) 98888-0202'],
  ['Mariana Souza', '(19) 97777-0303'], ['Garage Elite', '(21) 96666-0404'],
  ['Roberto Lima', '(41) 95555-0505'], ['Premium Motors', '(31) 94444-0606'],
]

type Row = [string, string, string, number, number, number, 'Manual' | 'Automático', Vehicle['fuel'], string, string, string, 'Novo' | 'Usado']
// brand, model, version, year, km, price, trans, fuel, color, city, state, condition
const ROWS: Row[] = [
  ['Toyota', 'Corolla', 'XEi 2.0 Flex', 2022, 34000, 139900, 'Automático', 'Flex', 'Prata', 'São Paulo', 'SP', 'Usado'],
  ['Honda', 'Civic', 'Touring 1.5 Turbo', 2021, 41000, 149900, 'Automático', 'Gasolina', 'Preto', 'Campinas', 'SP', 'Usado'],
  ['Volkswagen', 'Polo', 'Highline 200 TSI', 2023, 18000, 109900, 'Automático', 'Flex', 'Branco', 'Lins', 'SP', 'Usado'],
  ['Chevrolet', 'Onix', 'Premier 1.0 Turbo', 2023, 0, 118900, 'Automático', 'Flex', 'Vermelho', 'Bauru', 'SP', 'Novo'],
  ['Fiat', 'Toro', 'Volcano 2.0 Diesel 4x4', 2022, 52000, 174900, 'Automático', 'Diesel', 'Cinza', 'Goiânia', 'GO', 'Usado'],
  ['Jeep', 'Compass', 'Longitude T270', 2022, 29000, 164900, 'Automático', 'Flex', 'Branco', 'Curitiba', 'PR', 'Usado'],
  ['Jeep', 'Renegade', 'Sport 1.3 Turbo', 2021, 47000, 99900, 'Automático', 'Flex', 'Azul', 'Londrina', 'PR', 'Usado'],
  ['Hyundai', 'Creta', 'Ultimate 2.0', 2023, 12000, 154900, 'Automático', 'Flex', 'Preto', 'Rio de Janeiro', 'RJ', 'Usado'],
  ['Ford', 'Ranger', 'Limited 3.2 Diesel 4x4', 2021, 68000, 249900, 'Automático', 'Diesel', 'Prata', 'Uberlândia', 'MG', 'Usado'],
  ['Chevrolet', 'S10', 'High Country 2.8', 2023, 15000, 289900, 'Automático', 'Diesel', 'Branco', 'Ribeirão Preto', 'SP', 'Usado'],
  ['BMW', '320i', 'M Sport 2.0 Turbo', 2022, 27000, 289900, 'Automático', 'Gasolina', 'Azul', 'São Paulo', 'SP', 'Usado'],
  ['BMW', 'X1', 'sDrive20i X-Line', 2021, 38000, 229900, 'Automático', 'Gasolina', 'Cinza', 'Belo Horizonte', 'MG', 'Usado'],
  ['Yamaha', 'MT-07', 'ABS 689cc', 2023, 4500, 49900, 'Manual', 'Gasolina', 'Azul', 'Campinas', 'SP', 'Usado'],
  ['Yamaha', 'Fazer 250', 'ABS Blueflex', 2022, 12000, 22900, 'Manual', 'Flex', 'Preto', 'Lins', 'SP', 'Usado'],
  ['Kawasaki', 'Ninja 400', 'ABS 399cc', 2022, 8000, 37900, 'Manual', 'Gasolina', 'Verde', 'Curitiba', 'PR', 'Usado'],
  ['BMW', 'R 1250 GS', 'Premium', 2022, 11000, 99900, 'Manual', 'Gasolina', 'Cinza', 'Florianópolis', 'SC', 'Usado'],
  ['BYD', 'Dolphin', 'Plus Elétrico', 2024, 0, 149800, 'Automático', 'Elétrico', 'Branco', 'São Paulo', 'SP', 'Novo'],
  ['BYD', 'Seal', 'Dynamic AWD', 2024, 3000, 289000, 'Automático', 'Elétrico', 'Preto', 'Porto Alegre', 'RS', 'Usado'],
  ['Toyota', 'Corolla', 'Altis Hybrid 1.8', 2023, 16000, 189900, 'Automático', 'Híbrido', 'Branco', 'Rio de Janeiro', 'RJ', 'Usado'],
  ['Volkswagen', 'Gol', '1.0 MPI Trendline', 2019, 62000, 42900, 'Manual', 'Flex', 'Prata', 'Lins', 'SP', 'Usado'],
  ['Fiat', 'Argo', 'Drive 1.3', 2022, 33000, 67900, 'Manual', 'Flex', 'Vermelho', 'Niterói', 'RJ', 'Usado'],
  ['Hyundai', 'HB20', 'Platinum 1.0 Turbo', 2021, 39000, 79900, 'Automático', 'Flex', 'Cinza', 'Belo Horizonte', 'MG', 'Usado'],
  ['Honda', 'City', 'EXL 1.5', 2022, 24000, 104900, 'Automático', 'Flex', 'Marrom', 'Bauru', 'SP', 'Usado'],
  ['Ford', 'Maverick', 'Lariat Híbrida', 2023, 9000, 239900, 'Automático', 'Híbrido', 'Azul', 'Campinas', 'SP', 'Usado'],
]

const DESCRIPTIONS = [
  'Único dono, revisões em dia na concessionária, manual e chave reserva. Pneus novos e documentação ok.',
  'Veículo muito bem conservado, sem detalhes de lataria, interior impecável. Aceito vistoria cautelar.',
  'Ótimo custo-benefício, econômico e confortável. Laudo cautelar aprovado. Financiamos em até 60x.',
  'Excelente estado, itens de série completos, garantia de fábrica restante. Pronta entrega.',
]

const day = 86_400_000

export function buildSeedVehicles(): Vehicle[] {
  const now = Date.now()
  return ROWS.map((r, i) => {
    const [brand, model, version, year, kmv, price, transmission, fuel, color, city, state, condition] = r
    const type = CATALOG[brand]?.type ?? 'Carro'
    const isMoto = type === 'Moto' || brand === 'Yamaha' || brand === 'Kawasaki' || model === 'R 1250 GS'
    const realType: VehicleType = isMoto ? 'Moto' : ['Compass', 'Renegade', 'Creta', 'X1', 'Tucson', 'Commander'].includes(model) ? 'SUV' : ['Ranger', 'S10', 'Toro', 'Maverick', 'Strada'].includes(model) ? 'Caminhonete' : 'Carro'
    const seller = SELLERS[i % SELLERS.length]
    const opts = OPTIONS.filter((_, k) => (k * 7 + i * 3) % 3 !== 0).slice(0, 6 + (i % 6))
    const photos = [0, 1, 2, 3].map((k) => `https://picsum.photos/seed/automarket-${i}-${k}/1200/800`)
    return {
      id: `v${i + 1}`,
      type: realType,
      brand, model, version, year, km: kmv, price, transmission, fuel, color, city, state, condition,
      acceptsTrade: i % 3 !== 0,
      featured: i % 5 === 0,
      status: i === 7 ? 'vendido' : i === 13 ? 'pausado' : 'ativo',
      options: opts,
      description: DESCRIPTIONS[i % DESCRIPTIONS.length],
      photos,
      views: 120 + ((i * 97) % 900),
      createdAt: new Date(now - (i * 6 + 1) * day).toISOString(),
      sellerName: seller[0],
      sellerPhone: seller[1],
    }
  })
}

export function buildSeedMessages(): Message[] {
  const now = Date.now()
  const base: [string, string, string, string, string][] = [
    ['Ana Beatriz', 'ana.b@exemplo.com', '(11) 91234-0001', 'v1', 'Olá! Ainda está disponível? Aceita troca por um Onix 2019?'],
    ['Pedro Henrique', 'pedro.h@exemplo.com', '(19) 91234-0002', 'v3', 'Qual o menor valor à vista? Posso ver hoje à tarde?'],
    ['Juliana Costa', 'ju.costa@exemplo.com', '(14) 91234-0003', 'v6', 'Gostaria de simular um financiamento em 48x com entrada de 40 mil.'],
    ['Marcos Vinícius', 'marcos.v@exemplo.com', '(41) 91234-0004', 'v9', 'Tem laudo cautelar? Posso levar num mecânico de confiança?'],
    ['Fernanda Lopes', 'fe.lopes@exemplo.com', '(21) 91234-0005', 'v13', 'Boa noite, a moto tem alguma queda ou histórico de leilão?'],
  ]
  return base.map((b, i) => ({
    id: `m${i + 1}`,
    name: b[0], email: b[1], phone: b[2], vehicleId: b[3], text: b[4],
    date: new Date(now - i * 7_200_000 - 3_600_000).toISOString(),
    read: i > 2,
  }))
}

export const DEFAULT_PROFILE: StoreProfile = {
  name: 'Garage Elite Veículos',
  email: 'contato@garageelite.exemplo',
  phone: '(14) 3333-0000',
  city: 'Lins - SP',
  about: 'Loja fictícia de demonstração com os melhores seminovos da região.',
}
