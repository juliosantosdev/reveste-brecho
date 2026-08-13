import type { ChatMessage, DesapegoRequest, Product, Review } from "./types"

export const initialProducts: Product[] = [
  {
    id: "p1",
    name: "Jaqueta Jeans Vintage",
    category: "Roupas",
    size: "M",
    condition: "Excelente",
    price: 89.9,
    image: "/products/jaqueta-jeans.png",
    description:
      "Jaqueta jeans clássica de lavagem média, sem manchas ou desgastes. Modelagem unissex, ótima para compor looks de meia-estação.",
    waterSaved: 7500,
    wasteSaved: 900,
    status: "Disponível",
  },
  {
    id: "p2",
    name: "Vestido Floral Midi",
    category: "Roupas",
    size: "P",
    condition: "Seminovo",
    price: 64.9,
    image: "/products/vestido-floral.png",
    description:
      "Vestido midi de estampa floral, tecido leve e fluido. Usado poucas vezes, mantém as cores vivas e o caimento original.",
    waterSaved: 5400,
    wasteSaved: 600,
    status: "Reservado pelo Cliente",
  },
  {
    id: "p3",
    name: "Tênis de Couro Branco",
    category: "Calçados",
    size: "39",
    condition: "Bom",
    price: 119.9,
    image: "/products/tenis-couro.png",
    description:
      "Tênis de couro branco, solado íntegro e higienizado. Pequenos sinais de uso na parte frontal, sem comprometer a estrutura.",
    waterSaved: 8200,
    wasteSaved: 1100,
    status: "Disponível",
  },
  {
    id: "p4",
    name: "Bolsa de Couro Caramelo",
    category: "Acessórios",
    size: "Único",
    condition: "Excelente",
    price: 149.9,
    image: "/products/bolsa-couro.png",
    description:
      "Bolsa estruturada de couro legítimo na cor caramelo. Alça ajustável e forro interno impecável. Peça atemporal e versátil.",
    waterSaved: 3100,
    wasteSaved: 750,
    status: "Aguardando Retirada",
  },
  {
    id: "p5",
    name: "Camisa de Linho",
    category: "Roupas",
    size: "G",
    condition: "Novo com etiqueta",
    price: 54.9,
    image: "/products/camisa-linho.png",
    description:
      "Camisa de linho bege, nunca usada, ainda com etiqueta. Respirável e fresca, ideal para o verão e produções despojadas.",
    waterSaved: 6800,
    wasteSaved: 500,
    status: "Disponível",
  },
  {
    id: "p6",
    name: "Botas de Cano Curto",
    category: "Calçados",
    size: "37",
    condition: "Seminovo",
    price: 99.9,
    image: "/products/botas-cano-curto.png",
    description:
      "Botas de cano curto em couro marrom, salto baixo confortável. Solado com leve marca de uso, couro bem conservado.",
    waterSaved: 7000,
    wasteSaved: 980,
    status: "Concluído/Vendido",
  },
]

export const initialMessages: ChatMessage[] = [
  {
    id: "m1",
    productId: "p1",
    sender: "cliente",
    text: "Olá! A jaqueta tem alguma mancha ou desgaste nos punhos?",
    time: "09:32",
  },
  {
    id: "m2",
    productId: "p1",
    sender: "brecho",
    text: "Oi! Está impecável, sem manchas. Os punhos estão firmes. Posso enviar mais fotos se quiser :)",
    time: "09:35",
  },
]

export const initialReviews: Review[] = [
  {
    id: "r1",
    author: "Marina S.",
    rating: 5,
    comment:
      "Peça chegou exatamente como descrito e muito bem embalada. Amei apoiar a moda circular!",
    date: "12/07/2026",
  },
  {
    id: "r2",
    author: "Rafael T.",
    rating: 4,
    comment: "Atendimento atencioso no chat, tirou todas as minhas dúvidas antes da compra.",
    date: "03/07/2026",
  },
  {
    id: "r3",
    author: "Bianca L.",
    rating: 5,
    comment: "Adoro que dá pra combinar a retirada. Sustentável e prático.",
    date: "28/06/2026",
  },
]

export const initialDesapegos: DesapegoRequest[] = [
  {
    id: "d1",
    memberName: "Camila R.",
    category: "Roupas",
    itemName: "Blazer alfaiataria preto",
    description: "Usei duas vezes, tamanho 40. Gostaria de deixar à venda no brechó.",
    contact: "camila@email.com",
    status: "Pendente",
  },
]
