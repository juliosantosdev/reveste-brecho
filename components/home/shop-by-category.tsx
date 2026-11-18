"use client"

import Box from "@mui/material/Box"
import SvgIcon, { type SvgIconProps } from "@mui/material/SvgIcon"
import Typography from "@mui/material/Typography"
import { Stack } from "@/components/flex"
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag"
import WatchIcon from "@mui/icons-material/Watch"
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome"
import WeekendIcon from "@mui/icons-material/Weekend"
import type { ReactNode } from "react"

function TshirtIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M16 4l5 3.5-2.5 3.5-2.5-1.5V20H8V9.5L5.5 11 3 7.5 8 4c1 1.5 2.4 2.2 4 2.2S15 5.5 16 4z" />
    </SvgIcon>
  )
}

function ShoeIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M2 17.5h20v2H2v-2zm1-1.5v-5.5c0-.5.6-.7 1.1-.4 1.5.9 3.5.5 4.9-.9L10.4 8c.5-.4 1.2-.1 1.4.5l1.1 2.8c2.6.5 5.6 1 7.5 2 1 .5 1.6 1.4 1.6 2.7H3z" />
    </SvgIcon>
  )
}

function JacketIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M16.2 3.5L21 6.8l-2 4.7-2-1V20.5h-4.3v-9h-1.4v9H7V10.5l-2 1-2-4.7 4.8-3.3L10.3 6 12 4.5 13.7 6l2.5-2.5z" />
    </SvgIcon>
  )
}

function PantsIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M6.5 3h11l1 18h-4.3L12 10.5 9.8 21H5.5l1-18zm1.8 2.5v1.8h7.4V5.5H8.3z" />
    </SvgIcon>
  )
}

function VintageHatIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M12 6.5c-3.4 0-5.8 2.1-5.8 5.2v1.4C3.8 13.5 2 14.3 2 15.3c0 1.4 4.5 2.5 10 2.5s10-1.1 10-2.5c0-1-1.8-1.8-4.2-2.2v-1.4c0-3.1-2.4-5.2-5.8-5.2zm-4.3 5.2h8.6v1.1c-1.3.2-2.8.3-4.3.3s-3-.1-4.3-.3v-1.1z" />
    </SvgIcon>
  )
}

export interface CategoryCircleItem {
  name: string
  filterValue: string
  icon: ReactNode
}

const CATEGORY_ITEMS: CategoryCircleItem[] = [
  {
    name: "Todas",
    filterValue: "Todas",
    icon: <AutoAwesomeIcon sx={{ fontSize: 28 }} />,
  },
  {
    name: "Roupas",
    filterValue: "Roupas",
    icon: <TshirtIcon sx={{ fontSize: 28 }} />,
  },
  {
    name: "Calçados",
    filterValue: "Calçados",
    icon: <ShoeIcon sx={{ fontSize: 28 }} />,
  },
  {
    name: "Acessórios",
    filterValue: "Acessórios",
    icon: <WatchIcon sx={{ fontSize: 28 }} />,
  },
  {
    name: "Casacos",
    filterValue: "Roupas",
    icon: <JacketIcon sx={{ fontSize: 28 }} />,
  },
  {
    name: "Bolsas",
    filterValue: "Acessórios",
    icon: <ShoppingBagIcon sx={{ fontSize: 28 }} />,
  },
  {
    name: "Jeans",
    filterValue: "Roupas",
    icon: <PantsIcon sx={{ fontSize: 28 }} />,
  },
  {
    name: "Vintage",
    filterValue: "Todas",
    icon: <VintageHatIcon sx={{ fontSize: 28 }} />,
  },
  {
    name: "Móveis",
    filterValue: "Todas",
    icon: <WeekendIcon sx={{ fontSize: 28 }} />,
  },
]

export function ShopByCategory({
  selectedCategory,
  onSelectCategory,
}: {
  selectedCategory?: string
  onSelectCategory?: (filterValue: string, label: string) => void
}) {
  return (
    <Box component="section" aria-labelledby="category-title" sx={{ mt: { xs: 3, md: 4 }, px: 0.5 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography
          id="category-title"
          variant="h6"
          component="h2"
          sx={{ fontWeight: 800, fontSize: { xs: "1.1rem", sm: "1.25rem" } }}
        >
          Explorar por Categoria
        </Typography>
      </Stack>

      <Box
        sx={{
          display: "flex",
          gap: { xs: 2, sm: 3 },
          overflowX: "auto",
          pb: 1,
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
        }}
      >
        {CATEGORY_ITEMS.map((cat) => {
          const isSelected = selectedCategory === cat.name
          return (
            <Box
              key={cat.name}
              component="button"
              type="button"
              onClick={() => onSelectCategory?.(cat.filterValue, cat.name)}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: "none",
                border: "none",
                cursor: "pointer",
                p: 0,
                flex: "0 0 auto",
              }}
            >
              <Box
                sx={{
                  width: { xs: 68, sm: 76 },
                  height: { xs: 68, sm: 76 },
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: isSelected ? "primary.main" : "background.paper",
                  color: isSelected ? "primary.contrastText" : "primary.main",
                  border: "2px solid",
                  borderColor: isSelected ? "primary.main" : "divider",
                  boxShadow: isSelected
                    ? "0 6px 18px rgba(27, 59, 36, 0.3)"
                    : "0 3px 10px rgba(0,0,0,0.06)",
                  transition:
                    "transform 150ms ease, background-color 150ms ease, color 150ms ease, box-shadow 150ms ease",
                  "&:hover": {
                    transform: "scale(1.06)",
                    bgcolor: isSelected ? "primary.main" : "rgba(27, 59, 36, 0.08)",
                  },
                }}
              >
                {cat.icon}
              </Box>
              <Typography
                variant="caption"
                sx={{
                  mt: 1,
                  fontWeight: isSelected ? 800 : 600,
                  fontSize: { xs: "0.75rem", sm: "0.8rem" },
                  color: isSelected ? "primary.main" : "text.primary",
                  textAlign: "center",
                }}
              >
                {cat.name}
              </Typography>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}