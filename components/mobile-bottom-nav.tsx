"use client"

import StorefrontIcon from "@mui/icons-material/Storefront"
import RecyclingIcon from "@mui/icons-material/Recycling"
import FavoriteIcon from "@mui/icons-material/Favorite"
import Inventory2Icon from "@mui/icons-material/Inventory2"
import PendingActionsIcon from "@mui/icons-material/PendingActions"
import Badge from "@mui/material/Badge"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import { useStore } from "@/lib/store"

export type ClientTab = "vitrine" | "desapegar" | "reputacao"
export type VendorTab = "vitrine" | "pedidos" | "desapegos"

interface MobileBottomNavProps {
  clientTab: ClientTab
  onClientTabChange: (tab: ClientTab) => void
  vendorTab: VendorTab
  onVendorTabChange: (tab: VendorTab) => void
}

export function MobileBottomNav({
  clientTab,
  onClientTabChange,
  vendorTab,
  onVendorTabChange,
}: MobileBottomNavProps) {
  const { view, desapegos, products } = useStore()

  const pendingDesapegos = desapegos.filter((d) => d.status === "Pendente").length
  const activeOrders = products.filter(
    (p) =>
      p.status === "Reservado pelo Cliente" || p.status === "Aguardando Retirada",
  ).length

  const clientItems: {
    id: ClientTab
    label: string
    icon: React.ReactNode
  }[] = [
    {
      id: "vitrine",
      label: "Vitrine",
      icon: <StorefrontIcon fontSize="small" />,
    },
    {
      id: "desapegar",
      label: "Desapegar",
      icon: <RecyclingIcon fontSize="small" />,
    },
    {
      id: "reputacao",
      label: "Reputação",
      icon: <FavoriteIcon fontSize="small" />,
    },
  ]

  const vendorItems: {
    id: VendorTab
    label: string
    icon: React.ReactNode
  }[] = [
    {
      id: "vitrine",
      label: "Vitrine",
      icon: <StorefrontIcon fontSize="small" />,
    },
    {
      id: "pedidos",
      label: "Pedidos",
      icon: (
        <Badge badgeContent={activeOrders} color="warning" max={99}>
          <PendingActionsIcon fontSize="small" />
        </Badge>
      ),
    },
    {
      id: "desapegos",
      label: "Desapegos",
      icon: (
        <Badge badgeContent={pendingDesapegos} color="error" max={99}>
          <Inventory2Icon fontSize="small" />
        </Badge>
      ),
    },
  ]

  const items = view === "cliente" ? clientItems : vendorItems
  const activeId = view === "cliente" ? clientTab : vendorTab
  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.id === activeId),
  )

  return (
    <Paper
      component="nav"
      aria-label="Navegação principal mobile"
      elevation={10}
      sx={{
        display: { xs: "block", md: "none" },
        position: "fixed",
        bottom: 12,
        left: 16,
        right: 16,
        zIndex: 1200,
        bgcolor: "rgba(255, 255, 255, 0.96)",
        backdropFilter: "blur(12px)",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 99,
        pb: "env(safe-area-inset-bottom)",
        px: 1,
        py: 0.75,
        boxShadow: "0 10px 30px rgba(24, 48, 30, 0.16)",
      }}
    >
      <Box
        sx={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: `repeat(${items.length}, 1fr)`,
          alignItems: "center",
        }}
      >
        {/* Cápsula deslizante animada com a cor de identidade do projeto */}
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            width: `${100 / items.length}%`,
            transform: `translateX(${activeIndex * 100}%)`,
            transition: "transform 340ms cubic-bezier(0.34, 1.56, 0.64, 1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          <Box
            sx={{
              width: "88%",
              height: "100%",
              borderRadius: 99,
              bgcolor: "primary.main",
              boxShadow: "0 4px 14px rgba(46, 94, 58, 0.35)",
            }}
          />
        </Box>

        {/* Botões das abas */}
        {items.map((item) => {
          const isActive = activeId === item.id
          return (
            <Box
              key={item.id}
              component="button"
              type="button"
              onClick={() => {
                if (view === "cliente") {
                  onClientTabChange(item.id as ClientTab)
                } else {
                  onVendorTabChange(item.id as VendorTab)
                }
                window.scrollTo({ top: 0, behavior: "smooth" })
              }}
              aria-current={isActive ? "page" : undefined}
              sx={{
                position: "relative",
                zIndex: 1,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.75,
                py: 1.15,
                px: 1,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                color: isActive ? "#ffffff" : "text.secondary",
                transition: "color 220ms ease, transform 220ms ease",
                transform: isActive ? "scale(1.03)" : "scale(1)",
                WebkitTapHighlightColor: "transparent",
                "&:hover": {
                  color: isActive ? "#ffffff" : "primary.main",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "transform 260ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                  transform: isActive ? "scale(1.1)" : "scale(0.95)",
                }}
              >
                {item.icon}
              </Box>

              <Typography
                variant="caption"
                sx={{
                  fontWeight: isActive ? 700 : 600,
                  fontSize: "0.75rem",
                  lineHeight: 1,
                  letterSpacing: "0.01em",
                  whiteSpace: "nowrap",
                }}
              >
                {item.label}
              </Typography>
            </Box>
          )
        })}
      </Box>
    </Paper>
  )
}