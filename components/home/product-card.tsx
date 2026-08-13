"use client"

import WaterDropIcon from "@mui/icons-material/WaterDrop"
import RecyclingIcon from "@mui/icons-material/Recycling"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import CardActions from "@mui/material/CardActions"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import Chip from "@mui/material/Chip"
import { Stack } from "@/components/flex"
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"
import type { OrderStatus, Product } from "@/lib/types"

const statusColor: Record<OrderStatus, "success" | "warning" | "info" | "default"> = {
  Disponível: "success",
  "Reservado pelo Cliente": "warning",
  "Aguardando Retirada": "info",
  "Concluído/Vendido": "default",
}

const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

export function ProductCard({
  product,
  onOpen,
}: {
  product: Product
  onOpen: (p: Product) => void
}) {
  const sold = product.status === "Concluído/Vendido"

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 120ms ease, box-shadow 120ms ease",
        "&:hover": { transform: "translateY(-4px)", boxShadow: 4 },
      }}
    >
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="220"
          image={product.image}
          alt={`${product.name} — ${product.condition}, tamanho ${product.size}`}
          sx={{ objectFit: "cover", filter: sold ? "grayscale(0.7)" : "none" }}
        />
        <Chip
          size="small"
          label={product.status}
          color={statusColor[product.status]}
          sx={{ position: "absolute", top: 10, left: 10 }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="overline" color="text.secondary">
          {product.category}
        </Typography>
        <Typography variant="h6" component="h3" sx={{ mb: 1 }}>
          {product.name}
        </Typography>

        <Stack direction="row" spacing={1} sx={{ mb: 1.5 }} flexWrap="wrap" useFlexGap>
          <Chip size="small" variant="outlined" label={`Tam. ${product.size}`} />
          <Chip size="small" variant="outlined" label={product.condition} />
        </Stack>

        <Tooltip
          title={`Reutilizar esta peça economiza cerca de ${product.waterSaved.toLocaleString("pt-BR")} L de água e evita ${product.wasteSaved} g de resíduos têxteis.`}
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{
              bgcolor: "rgba(46,94,58,0.08)",
              color: "primary.main",
              px: 1,
              py: 0.75,
              borderRadius: 2,
              width: "fit-content",
            }}
          >
            <WaterDropIcon fontSize="small" aria-hidden />
            <Typography variant="caption" fontWeight={700}>
              {(product.waterSaved / 1000).toFixed(1)} mil L
            </Typography>
            <RecyclingIcon fontSize="small" aria-hidden />
            <Typography variant="caption" fontWeight={700}>
              {product.wasteSaved} g
            </Typography>
          </Stack>
        </Tooltip>

        <Typography variant="h5" color="primary" sx={{ mt: 2 }}>
          {brl(product.price)}
        </Typography>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          onClick={() => onOpen(product)}
          disabled={sold}
          aria-label={`Ver detalhes e reservar ${product.name}`}
        >
          {sold ? "Vendido" : "Ver Detalhes & Reservar"}
        </Button>
      </CardActions>
    </Card>
  )
}
