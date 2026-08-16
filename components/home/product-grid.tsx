"use client"

import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied"
import Box from "@mui/material/Box"
import { Stack } from "@/components/flex"
import Typography from "@mui/material/Typography"
import type { Product } from "@/lib/types"
import { ProductCard } from "./product-card"
import { useStore } from "@/lib/store"

// Importações do dnd-kit
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable"

export function ProductGrid({
  products,
  onOpen,
}: {
  products: Product[]
  onOpen: (p: Product) => void
}) {
  const { view, reorderProducts } = useStore()
  const isVendor = view === "vendedor"

  // Configura os sensores para não entrarem em conflito com cliques em botões normais
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  )

  if (products.length === 0) {
    return (
      <Stack alignItems="center" spacing={1.5} sx={{ py: 8, color: "text.secondary" }}>
        <SentimentDissatisfiedIcon sx={{ fontSize: 48 }} aria-hidden />
        <Typography variant="h6" component="p">
          Nenhuma peça encontrada
        </Typography>
        <Typography variant="body2">
          Tente ajustar a busca ou selecionar outra categoria.
        </Typography>
      </Stack>
    )
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      // Dispara a função da store para atualizar estado e o Supabase
      reorderProducts(String(active.id), String(over.id))
    }
  }

  const gridContent = (
    <Box
      sx={{
        display: "grid",
        // Ajuste de gap: menor no mobile (1.5) para as 2 colunas respirarem, padrão (3) no resto
        gap: { xs: 1.5, sm: 3 },
        gridTemplateColumns: {
          xs: "repeat(2, 1fr)", // AQUI: alterado para 2 colunas no mobile
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(4, 1fr)",
        },
      }}
    >
      {products.map((p) => (
        // A propriedade isSortable agora é passada corretamente para o card
        <ProductCard key={p.id} product={p} onOpen={onOpen} isSortable={isVendor} />
      ))}
    </Box>
  )

  // Se for cliente, renderiza a grelha normal (sem mecânica de arrastar)
  if (!isVendor) {
    return gridContent
  }

  // Se for Brechó, encapsula a grelha na lógica de arrastar e soltar
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={products.map((p) => p.id)}
        strategy={rectSortingStrategy}
      >
        {gridContent}
      </SortableContext>
    </DndContext>
  )
}