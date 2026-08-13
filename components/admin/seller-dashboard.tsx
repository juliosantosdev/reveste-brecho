"use client"

import AddIcon from "@mui/icons-material/Add"
import Inventory2Icon from "@mui/icons-material/Inventory2"
import PaidIcon from "@mui/icons-material/Paid"
import PendingActionsIcon from "@mui/icons-material/PendingActions"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import Divider from "@mui/material/Divider"
import { Stack } from "@/components/flex"
import Typography from "@mui/material/Typography"
import { useMemo, useState } from "react"
import { useStore } from "@/lib/store"
import { DesapegoInbox } from "@/components/community/desapego-inbox"
import { KanbanBoard } from "./kanban-board"
import { NewProductForm } from "./new-product-form"

export function SellerDashboard() {
  const { products } = useStore()
  const [formOpen, setFormOpen] = useState(false)

  const metrics = useMemo(() => {
    const available = products.filter((p) => p.status === "Disponível").length
    const inProgress = products.filter(
      (p) =>
        p.status === "Reservado pelo Cliente" || p.status === "Aguardando Retirada",
    ).length
    const sold = products.filter((p) => p.status === "Concluído/Vendido")
    const revenue = sold.reduce((sum, p) => sum + p.price, 0)
    return { available, inProgress, soldCount: sold.length, revenue }
  }, [products])

  return (
    <Box component="section" aria-labelledby="seller-title">
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography id="seller-title" variant="h4" component="h2">
            Painel do Brechó
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gerencie estoque, pedidos e desapegos da comunidade.
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={() => setFormOpen(true)}
        >
          Cadastrar desapego
        </Button>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
          mb: 4,
        }}
      >
        <MetricCard
          icon={<Inventory2Icon color="success" />}
          label="Peças disponíveis"
          value={String(metrics.available)}
        />
        <MetricCard
          icon={<PendingActionsIcon color="warning" />}
          label="Pedidos em andamento"
          value={String(metrics.inProgress)}
        />
        <MetricCard
          icon={<PaidIcon color="primary" />}
          label={`Vendas concluídas (${metrics.soldCount})`}
          value={metrics.revenue.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        />
      </Box>

      <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
        Fluxo de pedidos (Kanban)
      </Typography>
      <KanbanBoard />

      <Divider sx={{ my: 4 }} />

      <DesapegoInbox />

      <NewProductForm open={formOpen} onClose={() => setFormOpen(false)} />
    </Box>
  )
}

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <Card sx={{ p: 2 }}>
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Box
          sx={{
            display: "flex",
            p: 1,
            borderRadius: 2,
            bgcolor: "background.default",
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="h5" sx={{ lineHeight: 1.1 }}>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
        </Box>
      </Stack>
    </Card>
  )
}
