"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { supabase } from "./supabase"
import type {
  ChatMessage,
  Condition,
  Category,
  DesapegoRequest,
  OrderStatus,
  Product,
  Review,
} from "./types"

export type ViewMode = "cliente" | "vendedor"

interface Snackbar {
  message: string
  severity: "success" | "info" | "warning" | "error"
}

interface StoreValue {
  products: Product[]
  messages: ChatMessage[]
  reviews: Review[]
  desapegos: DesapegoRequest[]
  view: ViewMode
  setView: (v: ViewMode) => void
  snackbar: Snackbar | null
  notify: (message: string, severity?: Snackbar["severity"]) => void
  clearSnackbar: () => void
  reserveProduct: (id: string) => void
  cancelReservation: (id: string) => void
  updateStatus: (id: string, status: OrderStatus) => void
  addProduct: (data: NewProductInput) => void
  sendMessage: (productId: string, text: string, sender: ChatMessage["sender"]) => void
  addReview: (author: string, rating: number, comment: string) => void
  addDesapego: (data: Omit<DesapegoRequest, "id" | "status">) => void
  resolveDesapego: (id: string, accepted: boolean) => void
}

export interface NewProductInput {
  name: string
  category: Category
  size: string
  condition: Condition
  price: number
  description: string
  image: string
}

// --- MAPEAMENTOS AUXILIARES DE STATUS (BANCO <-> FRONT-END) ---
const statusToDb = (status: OrderStatus): string => {
  switch (status) {
    case "Disponível":
      return "disponivel"
    case "Reservado pelo Cliente":
      return "reservado"
    case "Aguardando Retirada":
      return "aguardando_retirada"
    case "Concluído/Vendido":
      return "vendido"
    default:
      return "disponivel"
  }
}

const dbToStatus = (dbStatus: string): OrderStatus => {
  switch (dbStatus) {
    case "disponivel":
      return "Disponível"
    case "reservado":
      return "Reservado pelo Cliente"
    case "aguardando_retirada":
      return "Aguardando Retirada"
    case "vendido":
      return "Concluído/Vendido"
    default:
      return "Disponível"
  }
}

// --- DADOS PADRÃO DE GARANTIA (FALLBACK) ---
const defaultProducts: Product[] = [
  {
    id: "p1",
    name: "Jaqueta Jeans Vintage",
    description: "Jaqueta jeans oversized anos 90 em excelente estado.",
    price: 89.9,
    size: "G",
    category: "Roupas",
    condition: "Seminovo",
    image: "/products/jaqueta-jeans.png",
    waterSaved: 5200,
    wasteSaved: 800,
    status: "Disponível",
  },
  {
    id: "p2",
    name: "Camisa de Linho",
    description: "Camisa leve 100% linho, perfeita para o dia a dia.",
    price: 55.0,
    size: "M",
    category: "Roupas",
    condition: "Seminovo",
    image: "/products/camisa-linho.png",
    waterSaved: 3800,
    wasteSaved: 450,
    status: "Disponível",
  },
  {
    id: "p3",
    name: "Bota Cano Curto",
    description: "Bota de couro sintético marrom pouco usada.",
    price: 120.0,
    size: "37",
    category: "Calçados",
    condition: "Seminovo",
    image: "/products/botas-cano-curto.png",
    waterSaved: 6100,
    wasteSaved: 950,
    status: "Disponível",
  },
  {
    id: "p4",
    name: "Bolsa de Couro",
    description: "Bolsa estruturada vintage com alça ajustável.",
    price: 65.0,
    size: "Único",
    category: "Acessórios",
    condition: "Seminovo",
    image: "/products/bolsa-couro.png",
    waterSaved: 2900,
    wasteSaved: 350,
    status: "Reservado pelo Cliente",
  },
]

const StoreContext = createContext<StoreValue | null>(null)

const now = () =>
  new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(defaultProducts)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [desapegos, setDesapegos] = useState<DesapegoRequest[]>([])
  const [view, setView] = useState<ViewMode>("cliente")
  const [snackbar, setSnackbar] = useState<Snackbar | null>(null)

  const notify = useCallback(
    (message: string, severity: Snackbar["severity"] = "success") =>
      setSnackbar({ message, severity }),
    [],
  )
  const clearSnackbar = useCallback(() => setSnackbar(null), [])

  // --- BUSCAR DADOS DO SUPABASE ---
  const fetchAllData = useCallback(async () => {
    try {
      const { data: dbProducts, error: prodError } = await supabase
        .from("produtos")
        .select("*")
      if (prodError) console.error("Erro ao buscar produtos:", prodError)

      if (dbProducts && dbProducts.length > 0) {
        const mappedProducts: Product[] = dbProducts.map((p) => {
          let categoryNormalized: Category = "Roupas"
          if (p.categoria === "Calçados") {
            categoryNormalized = "Calçados"
          } else if (p.categoria === "Acessórios") {
            categoryNormalized = "Acessórios"
          }

          return {
            id: String(p.id),
            name: p.titulo || "Peça de Brechó",
            description: p.descricao || "",
            price: Number(p.preco) || 0,
            size: p.tamanho || "M",
            category: categoryNormalized,
            condition: "Seminovo",
            image: p.imagem_url || "/placeholder.svg",
            waterSaved: Math.round(3000 + Math.random() * 4000),
            wasteSaved: Math.round(400 + Math.random() * 600),
            status: dbToStatus(p.status),
          }
        })
        setProducts(mappedProducts)
      }

      // Mensagens
      const { data: dbMessages } = await supabase.from("mensagens").select("*")
      if (dbMessages && dbMessages.length > 0) {
        setMessages(
          dbMessages.map((m) => ({
            id: String(m.id),
            productId: String(m.produto_id),
            sender: "cliente",
            text: m.conteudo,
            time: new Date(m.created_at).toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          })),
        )
      }

      // Avaliações
      const { data: dbReviews } = await supabase.from("avaliacoes").select("*")
      if (dbReviews && dbReviews.length > 0) {
        setReviews(
          dbReviews.map((r) => ({
            id: String(r.id),
            author: r.autor_nome,
            rating: Number(r.nota),
            comment: r.comentario,
            date: new Date(r.created_at).toLocaleDateString("pt-BR"),
          })),
        )
      }

      // Desapegos
      const { data: dbDesapegos } = await supabase
        .from("solicitacoes_desapego")
        .select("*")
      if (dbDesapegos && dbDesapegos.length > 0) {
        setDesapegos(
          dbDesapegos.map((d) => ({
            id: String(d.id),
            memberName: d.nome_usuario,
            email: d.email_usuario,
            pieceDescription: d.descricao_peca,
            status: d.status as "Pendente" | "Aceito" | "Recusado",
          })),
        )
      }
    } catch (error) {
      console.error("Erro ao carregar dados do Supabase:", error)
    }
  }, [])

  useEffect(() => {
    fetchAllData()
  }, [fetchAllData])

  // --- AÇÕES DO USUÁRIO INTEGRADA AO SUPABASE ---

  const reserveProduct = useCallback(
    async (id: string) => {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, status: "Reservado pelo Cliente" } : p,
        ),
      )
      await supabase
        .from("produtos")
        .update({ status: "reservado" })
        .eq("id", id)
      notify("Peça reservada! O brechó foi avisado para combinar a retirada.", "success")
    },
    [notify],
  )

  const cancelReservation = useCallback(
    async (id: string) => {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: "Disponível" } : p)),
      )
      await supabase
        .from("produtos")
        .update({ status: "disponivel" })
        .eq("id", id)
      notify("Reserva desfeita. A peça voltou a ficar disponível.", "info")
    },
    [notify],
  )

  const updateStatus = useCallback(
    async (id: string, status: OrderStatus) => {
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)))
      await supabase
        .from("produtos")
        .update({ status: statusToDb(status) })
        .eq("id", id)
      notify(`Status atualizado para "${status}".`, "success")
    },
    [notify],
  )

  const addProduct = useCallback(
    async (data: NewProductInput) => {
      const { data: inserted, error } = await supabase
        .from("produtos")
        .insert([
          {
            titulo: data.name,
            descricao: data.description,
            preco: data.price,
            tamanho: data.size,
            categoria: data.category,
            imagem_url: data.image,
            status: "disponivel",
          },
        ])
        .select()
        .single()

      if (error) {
        console.error("Erro ao inserir produto:", error)
      }

      const product: Product = {
        id: inserted ? String(inserted.id) : `p-${Date.now()}`,
        ...data,
        waterSaved: Math.round(3000 + Math.random() * 5000),
        wasteSaved: Math.round(400 + Math.random() * 800),
        status: "Disponível",
      }
      setProducts((prev) => [product, ...prev])
      notify("Novo desapego cadastrado na vitrine!", "success")
    },
    [notify],
  )

  const sendMessage = useCallback(
    async (productId: string, text: string, sender: ChatMessage["sender"]) => {
      const { data: inserted } = await supabase
        .from("mensagens")
        .insert([
          {
            produto_id: productId,
            remetente_nome: sender === "cliente" ? "Comprador" : "Vendedor",
            conteudo: text,
          },
        ])
        .select()
        .single()

      const message: ChatMessage = {
        id: inserted ? String(inserted.id) : `m-${Date.now()}`,
        productId,
        sender,
        text,
        time: now(),
      }
      setMessages((prev) => [...prev, message])
    },
    [],
  )

  const addReview = useCallback(
    async (author: string, rating: number, comment: string) => {
      const { data: inserted } = await supabase
        .from("avaliacoes")
        .insert([{ autor_nome: author, nota: rating, comentario: comment }])
        .select()
        .single()

      const review: Review = {
        id: inserted ? String(inserted.id) : `r-${Date.now()}`,
        author,
        rating,
        comment,
        date: new Date().toLocaleDateString("pt-BR"),
      }
      setReviews((prev) => [review, ...prev])
      notify("Avaliação publicada. Obrigado por fortalecer a comunidade!", "success")
    },
    [notify],
  )

  const addDesapego = useCallback(
    async (data: Omit<DesapegoRequest, "id" | "status">) => {
      const { data: inserted } = await supabase
        .from("solicitacoes_desapego")
        .insert([
          {
            nome_usuario: data.memberName,
            email_usuario: data.email,
            descricao_peca: data.pieceDescription,
            status: "Pendente",
          },
        ])
        .select()
        .single()

      const request: DesapegoRequest = {
        id: inserted ? String(inserted.id) : `d-${Date.now()}`,
        status: "Pendente",
        ...data,
      }
      setDesapegos((prev) => [request, ...prev])
      notify("Solicitação de desapego enviada! O brechó irá avaliar.", "success")
    },
    [notify],
  )

  const resolveDesapego = useCallback(
    async (id: string, accepted: boolean) => {
      const newStatus = accepted ? "Aceito" : "Recusado"
      setDesapegos((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: newStatus } : d)),
      )
      await supabase
        .from("solicitacoes_desapego")
        .update({ status: newStatus })
        .eq("id", id)

      notify(
        accepted
          ? "Desapego aceito! Combine a coleta com o membro."
          : "Solicitação recusada.",
        accepted ? "success" : "info",
      )
    },
    [notify],
  )

  const value = useMemo<StoreValue>(
    () => ({
      products,
      messages,
      reviews,
      desapegos,
      view,
      setView,
      snackbar,
      notify,
      clearSnackbar,
      reserveProduct,
      cancelReservation,
      updateStatus,
      addProduct,
      sendMessage,
      addReview,
      addDesapego,
      resolveDesapego,
    }),
    [
      products,
      messages,
      reviews,
      desapegos,
      view,
      snackbar,
      notify,
      clearSnackbar,
      reserveProduct,
      cancelReservation,
      updateStatus,
      addProduct,
      sendMessage,
      addReview,
      addDesapego,
      resolveDesapego,
    ],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error("useStore precisa estar dentro de StoreProvider")
  return ctx
}