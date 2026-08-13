"use client"

import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import Chip from "@mui/material/Chip"
import { Stack } from "@/components/flex"
import Typography from "@mui/material/Typography"
import { useStore } from "@/lib/store"
import { ORDER_STATUSES, type OrderStatus, type Product } from "@/lib/types"

const columnColor: Record<OrderStatus, string> = {
  Disponível: "#2e7d32",
  "Reservado pelo Cliente": "#b26a00",
  "Aguardando Retirada": "#1565c0",
  "Concluído/Vendido": "#607d6b",
}

const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

export function KanbanBoard() {
  const { products, updateStatus } = useStore()

  return (
    <Box
      sx={{
        display: "grid",
        gap: 2,
        gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
        alignItems: "start",
      }}
    >
      {ORDER_STATUSES.map((status) => {
        const items = products.filter((p) => p.status === status)
        return (
          <Box
            key={status}
            sx={{
              bgcolor: "background.paper",
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                px: 2,
                py: 1.25,
                borderTop: `4px solid ${columnColor[status]}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="subtitle2" fontWeight={700}>
                {status}
              </Typography>
              <Chip size="small" label={items.length} />
            </Box>

            <Stack spacing={1.5} sx={{ p: 1.5, minHeight: 120 }}>
              {items.length === 0 && (
                <Typography variant="caption" color="text.secondary" sx={{ p: 1 }}>
                  Sem peças nesta etapa.
                </Typography>
              )}
              {items.map((p) => (
                <OrderCard key={p.id} product={p} onMove={updateStatus} />
              ))}
            </Stack>
          </Box>
        )
      })}
    </Box>
  )
}

function OrderCard({
  product,
  onMove,
}: {
  product: Product
  onMove: (id: string, status: OrderStatus) => void
}) {
  const index = ORDER_STATUSES.indexOf(product.status)
  const prev = ORDER_STATUSES[index - 1]
  const next = ORDER_STATUSES[index + 1]

  return (
    <Card variant="outlined" sx={{ p: 1.25 }}>
      <Stack direction="row" spacing={1.25}>
        <Box
          component="img"
          src={product.image}
          alt=""
          aria-hidden
          sx={{ width: 48, height: 48, borderRadius: 1.5, objectFit: "cover" }}
        />
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" fontWeight={700} noWrap>
            {product.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Tam. {product.size} · {brl(product.price)}
          </Typography>
        </Box>
      </Stack>

      <Stack direction="row" spacing={1} sx={{ mt: 1.25 }}>
        <Button
          size="small"
          variant="text"
          disabled={!prev}
          startIcon={<ArrowBackIcon />}
          onClick={() => prev && onMove(product.id, prev)}
          aria-label={`Voltar ${product.name} para etapa anterior`}
        >
          Voltar
        </Button>
        <Button
          size="small"
          variant="contained"
          disabled={!next}
          endIcon={<ArrowForwardIcon />}
          onClick={() => next && onMove(product.id, next)}
          aria-label={`Avançar ${product.name} para próxima etapa`}
          sx={{ ml: "auto" }}
        >
          {product.status === "Disponível"
            ? "Aceitar reserva"
            : next
              ? "Avançar"
              : "Fim"}
        </Button>
      </Stack>
    </Card>
  )
}
