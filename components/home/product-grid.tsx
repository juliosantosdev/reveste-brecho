"use client"

import { useState } from "react"
import Box from "@mui/material/Box"
import { Stack } from "@/components/flex"
import Typography from "@mui/material/Typography"
import type { Product } from "@/lib/types"
import { ProductCard } from "./product-card"
import { useStore } from "@/lib/store"
import { EmptyCatalogIllustration } from "@/components/illustrations/reveste-illustrations"

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

/**
 * Mantém no mobile (2 colunas) o mesmo pareamento vertical do desktop (4 colunas):
 * Linha 1: [0, 1] (cima) -> Linha 2: [4, 5] (baixo)
 * Linha 3: [2, 3] (cima) -> Linha 4: [6, 7] (baixo)
 */
function getMobileLookOrder(index: number, total: number): number {
  const blockStart = Math.floor(index / 8) * 8
  const rem = Math.min(8, total - blockStart)
  const localIdx = index - blockStart
  const topCount = rem === 8 ? 4 : Math.ceil(rem / 2)

  if (localIdx < topCount) {
    const pair = Math.floor(localIdx / 2)
    return blockStart + pair * 4 + (localIdx % 2)
  }

  const bottomIdx = localIdx - topCount
  const pair = Math.floor(bottomIdx / 2)
  return blockStart + pair * 4 + 2 + (bottomIdx % 2)
}

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
      <Stack
        alignItems="center"
        spacing={1.5}
        sx={{ py: 6, px: 2, textAlign: "center", color: "text.secondary" }}
      >
        <EmptyCatalogIllustration size={210} />
        <Typography variant="h6" component="p" color="text.primary" fontWeight={800}>
          Nenhuma peça encontrada no garimpo
        </Typography>
        <Typography variant="body2" sx={{ maxWidth: 340 }}>
          Tente ajustar a busca ou selecionar outra categoria acima.
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
            {products.map((p, idx) => (
              <Box
                key={p.id}
                sx={{
                  order: {
                    xs: getMobileLookOrder(idx, products.length),
                    md: idx,
                  },
                }}
              >
                <ProductCard product={p} onOpen={onOpen} isSortable />
              </Box>
            ))}
          </Box>
        </SortableContext>
      </DndContext>
    )
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
      {products.map((p, idx) => (
        <Box
          key={p.id}
          sx={{
            order: {
              xs: getMobileLookOrder(idx, products.length),
              md: idx,
            },
          }}
        >
          <ProductCard
            product={p}
            onOpen={onOpen}
            isSortable={false}
            isMobileExpanded={activeCardId === p.id}
            onMobileToggle={(id) =>
              setActiveCardId((prev) => (prev === id ? null : id))
            }
          />
        </Box>
      ))}
    </Box>
  )
}