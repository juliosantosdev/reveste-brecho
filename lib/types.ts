export type Category = "Roupas" | "Calçados" | "Acessórios"

export type Condition = "Novo com etiqueta" | "Excelente" | "Seminovo" | "Bom"

export type OrderStatus =
  | "Disponível"
  | "Reservado pelo Cliente"
  | "Aguardando Retirada"
  | "Concluído/Vendido"

export const ORDER_STATUSES: OrderStatus[] = [
  "Disponível",
  "Reservado pelo Cliente",
  "Aguardando Retirada",
  "Concluído/Vendido",
]

export const CATEGORIES: Category[] = ["Roupas", "Calçados", "Acessórios"]

export interface Product {
  id: string
  name: string
  category: Category
  size: string
  condition: Condition
  price: number
  image: string
  description: string
  /** litros de água economizados ao reutilizar a peça */
  waterSaved: number
  /** gramas de resíduos têxteis evitados */
  wasteSaved: number
  status: OrderStatus
}

export interface ChatMessage {
  id: string
  productId: string
  sender: "cliente" | "brecho"
  text: string
  time: string
}

export interface Review {
  id: string
  author: string
  rating: number
  comment: string
  date: string
}

export interface DesapegoRequest {
  id: string
  memberName: string
  category: Category
  itemName: string
  description: string
  contact: string
  status: "Pendente" | "Aceito" | "Recusado"
}
