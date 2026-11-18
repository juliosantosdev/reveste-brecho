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
import { ProductGrid } from "@/components/home/product-grid"
import type { VendorTab } from "@/components/mobile-bottom-nav"

export function SellerDashboard({ mobileTab = "vitrine" }: { mobileTab?: VendorTab }) {
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
      {/* Cabeçalho e Métricas aparecem na aba Vitrine no mobile, e sempre no desktop */}
      <Box sx={{ display: { xs: mobileTab === "vitrine" ? "block" : "none", md: "block" } }}>
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
            gap: { xs: 1.5, sm: 2 },
            gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
            mb: 4,
          }}
        >
          <MetricCard
            icon={<Inventory2Icon color="success" fontSize="small" />}
            label="Peças disponíveis"
            value={String(metrics.available)}
          />
          <MetricCard
            icon={<PendingActionsIcon color="warning" fontSize="small" />}
            label="Pedidos em andamento"
            value={String(metrics.inProgress)}
          />
          <Box sx={{ gridColumn: { xs: "span 2", md: "span 1" } }}>
            <MetricCard
              icon={<PaidIcon color="primary" fontSize="small" />}
              label={`Vendas concluídas (${metrics.soldCount})`}
              value={metrics.revenue.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            />
          </Box>
        </Box>

        <Divider sx={{ my: 3, display: { xs: "none", md: "block" } }} />
        <Typography variant="h6" component="h3" sx={{ mb: 1 }}>
          Organizar Vitrine
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Arraste os cards abaixo para alterar a ordem de exibição na página inicial dos clientes.
        </Typography>
        <ProductGrid products={products} onOpen={() => {}} />
      </Box>

      {/* Aba Pedidos (Kanban) */}
      <Box sx={{ display: { xs: mobileTab === "pedidos" ? "block" : "none", md: "block" } }}>
        <Divider sx={{ my: 4, display: { xs: "none", md: "block" } }} />
        <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
          Fluxo de pedidos (Kanban)
        </Typography>
        <KanbanBoard />
      </Box>

      {/* Aba Desapegos */}
      <Box sx={{ display: { xs: mobileTab === "desapegos" ? "block" : "none", md: "block" } }}>
        <Divider sx={{ my: 4, display: { xs: "none", md: "block" } }} />
        <DesapegoInbox />
      </Box>

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
    <Card sx={{ p: { xs: 1.5, sm: 2 }, height: "100%" }}>
      <Stack direction="row" spacing={{ xs: 1.25, sm: 1.5 }} alignItems="center">
        <Box
          sx={{
            display: "flex",
            p: { xs: 0.75, sm: 1 },
            borderRadius: 2,
            bgcolor: "background.default",
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="h6"
            sx={{ lineHeight: 1.15, fontSize: { xs: "1.1rem", sm: "1.35rem" }, fontWeight: 700 }}
          >
            {value}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", lineHeight: 1.2, mt: 0.25 }}
          >
            {label}
          </Typography>
        </Box>
      </Stack>
    </Card>
  )
}