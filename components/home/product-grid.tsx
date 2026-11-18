"use client"

import { useState } from "react"
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied"
import Box from "@mui/material/Box"
import { Stack } from "@/components/flex"
import Typography from "@mui/material/Typography"
import type { Product } from "@/lib/types"
import { ProductCard } from "./product-card"
import { useStore } from "@/lib/store"

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
  const [activeCardId, setActiveCardId] = useState<string | null>(null)

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
      reorderProducts(String(active.id), String(over.id))
    }
  }

  if (isVendor) {
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
          <Box
            sx={{
              display: "grid",
              gap: { xs: 1.5, sm: 3 },
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                sm: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              },
            }}
          >
            {products.map((p) => (
              <ProductCard key={p.id} product={p} onOpen={onOpen} isSortable />
            ))}
          </Box>
        </SortableContext>
      </DndContext>
    )
  }

  // Agrupa em colunas pareadas (topo + base) para manter a combinação de looks no mobile e desktop
  const lookColumns: Product[][] = []
  for (let i = 0; i < products.length; i += 4) {
    const chunk = products.slice(i, i + 4)
    if (chunk.length >= 3) {
      lookColumns.push([chunk[0], chunk[2]])
      if (chunk[1] || chunk[3]) {
        lookColumns.push([chunk[1], chunk[3]].filter(Boolean))
      }
    } else {
      chunk.forEach((item) => lookColumns.push([item]))
    }
  }

  return (
    <Box
      onClick={() => setActiveCardId(null)}
      sx={{
        display: "grid",
        gap: { xs: 1.5, sm: 3 },
        gridTemplateColumns: {
          xs: "repeat(2, 1fr)",
          sm: "repeat(2, 1fr)",
          md: "repeat(4, 1fr)",
        },
        alignItems: "start",
      }}
    >
      {lookColumns.map((col, colIndex) => (
        <Stack key={colIndex} spacing={{ xs: 1.5, sm: 3 }}>
          {col.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onOpen={onOpen}
              isSortable={false}
              isMobileExpanded={activeCardId === p.id}
              onMobileToggle={(id) =>
                setActiveCardId((prev) => (prev === id ? null : id))
              }
            />
          ))}
        </Stack>
      ))}
    </Box>
  )
}