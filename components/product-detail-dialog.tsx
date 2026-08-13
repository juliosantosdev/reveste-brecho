"use client"

import CloseIcon from "@mui/icons-material/Close"
import WaterDropIcon from "@mui/icons-material/WaterDrop"
import RecyclingIcon from "@mui/icons-material/Recycling"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Chip from "@mui/material/Chip"
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import Divider from "@mui/material/Divider"
import IconButton from "@mui/material/IconButton"
import { Stack } from "@/components/flex"
import Typography from "@mui/material/Typography"
import useMediaQuery from "@mui/material/useMediaQuery"
import { useTheme } from "@mui/material/styles"
import { useStore } from "@/lib/store"
import type { Product } from "@/lib/types"
import { ChatPanel } from "./chat-panel"

const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

export function ProductDetailDialog({
  product,
  open,
  onClose,
}: {
  product: Product | null
  open: boolean
  onClose: () => void
}) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"))
  const { reserveProduct, cancelReservation } = useStore()

  if (!product) return null

  const reserved = product.status === "Reservado pelo Cliente"
  const available = product.status === "Disponível"

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="lg"
      fullWidth
      aria-labelledby="product-dialog-title"
      scroll="paper"
    >
      <IconButton
        onClick={onClose}
        aria-label="Fechar detalhes"
        sx={{ position: "absolute", right: 8, top: 8, zIndex: 2, bgcolor: "background.paper" }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent sx={{ p: 0 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.1fr 1fr" },
          }}
        >
          {/* Coluna: informações do produto */}
          <Box sx={{ p: { xs: 2.5, md: 4 } }}>
            <Box
              component="img"
              src={product.image}
              alt={`${product.name} — ${product.condition}, tamanho ${product.size}`}
              sx={{
                width: "100%",
                height: { xs: 240, md: 320 },
                objectFit: "cover",
                borderRadius: 3,
                mb: 2.5,
              }}
            />

            <Typography variant="overline" color="text.secondary">
              {product.category}
            </Typography>
            <Typography id="product-dialog-title" variant="h4" component="h2" gutterBottom>
              {product.name}
            </Typography>

            <Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap" useFlexGap>
              <Chip label={`Tamanho ${product.size}`} variant="outlined" />
              <Chip label={product.condition} color="secondary" variant="outlined" />
              <Chip
                label={product.status}
                color={available ? "success" : reserved ? "warning" : "default"}
              />
            </Stack>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 2.5 }}>
              {product.description}
            </Typography>

            <Stack
              direction="row"
              spacing={2}
              sx={{
                bgcolor: "rgba(46,94,58,0.08)",
                borderRadius: 3,
                p: 2,
                mb: 2.5,
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <WaterDropIcon color="primary" aria-hidden />
                <Box>
                  <Typography variant="h6" component="p" color="primary" sx={{ lineHeight: 1 }}>
                    {product.waterSaved.toLocaleString("pt-BR")} L
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    água economizada
                  </Typography>
                </Box>
              </Stack>
              <Divider orientation="vertical" flexItem />
              <Stack direction="row" spacing={1} alignItems="center">
                <RecyclingIcon color="primary" aria-hidden />
                <Box>
                  <Typography variant="h6" component="p" color="primary" sx={{ lineHeight: 1 }}>
                    {product.wasteSaved} g
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    resíduos evitados
                  </Typography>
                </Box>
              </Stack>
            </Stack>

            <Typography variant="h4" color="primary" sx={{ mb: 2 }}>
              {brl(product.price)}
            </Typography>

            {available && (
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={() => reserveProduct(product.id)}
                aria-label={`Reservar ${product.name}`}
              >
                Reservar peça
              </Button>
            )}

            {reserved && (
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1} alignItems="center" color="warning.main">
                  <CheckCircleIcon aria-hidden />
                  <Typography variant="body2" fontWeight={700}>
                    Peça reservada em seu nome. Combine a retirada pelo chat.
                  </Typography>
                </Stack>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => cancelReservation(product.id)}
                  aria-label={`Desfazer reserva de ${product.name}`}
                >
                  Desfazer reserva
                </Button>
              </Stack>
            )}

            {!available && !reserved && (
              <Typography variant="body2" color="text.secondary">
                Esta peça não está disponível para reserva no momento.
              </Typography>
            )}
          </Box>

          {/* Coluna: chat (Comunicação) */}
          <Box
            sx={{
              p: { xs: 2.5, md: 4 },
              bgcolor: "background.default",
              borderLeft: { md: "1px solid" },
              borderTop: { xs: "1px solid", md: "none" },
              borderColor: { xs: "divider", md: "divider" },
            }}
          >
            <ChatPanel productId={product.id} />
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
