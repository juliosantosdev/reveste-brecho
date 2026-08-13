"use client"

import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied"
import Box from "@mui/material/Box"
import { Stack } from "@/components/flex"
import Typography from "@mui/material/Typography"
import type { Product } from "@/lib/types"
import { ProductCard } from "./product-card"

export function ProductGrid({
  products,
  onOpen,
}: {
  products: Product[]
  onOpen: (p: Product) => void
}) {
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

  return (
    <Box
      sx={{
        display: "grid",
        gap: 3,
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(4, 1fr)",
        },
      }}
    >
      {products.map((p) => (
        <ProductCard key={p.id} product={p} onOpen={onOpen} />
      ))}
    </Box>
  )
}
