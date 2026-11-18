"use client"

import { useState } from "react"
import WaterDropIcon from "@mui/icons-material/WaterDrop"
import RecyclingIcon from "@mui/icons-material/Recycling"
import DragIndicatorIcon from "@mui/icons-material/DragIndicator"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import CardMedia from "@mui/material/CardMedia"
import Chip from "@mui/material/Chip"
import IconButton from "@mui/material/IconButton"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import TextField from "@mui/material/TextField"
import useMediaQuery from "@mui/material/useMediaQuery"
import { Stack } from "@/components/flex"
import Typography from "@mui/material/Typography"
import type { OrderStatus, Product } from "@/lib/types"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useStore } from "@/lib/store"

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
  isSortable = false,
  isMobileExpanded = false,
  onMobileToggle,
}: {
  product: Product
  onOpen: (p: Product) => void
  isSortable?: boolean
  isMobileExpanded?: boolean
  onMobileToggle?: (id: string) => void
}) {
  const sold = product.status === "Concluído/Vendido"
  const { updateProductDetails, deleteProduct } = useStore()

  // Detecta se o dispositivo tem mouse real (desktop) ou tela touch (mobile/tablet)
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)")

  const [editOpen, setEditOpen] = useState(false)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [editForm, setEditForm] = useState({
    name: product.name,
    price: product.price,
    size: product.size,
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState(product.image)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id, disabled: !isSortable })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 2 : 0,
    opacity: isDragging ? 0.8 : 1,
  }

  const handleOpenEdit = () => {
    setEditForm({ name: product.name, price: product.price, size: product.size })
    setPreviewImage(product.image)
    setImageFile(null)
    setEditOpen(true)
  }

  const handleSaveEdit = async () => {
    await updateProductDetails(product.id, editForm, imageFile)
    setEditOpen(false)
  }

  const handleConfirmDelete = async () => {
    setDeleting(true)
    await deleteProduct(product.id)
    setDeleting(false)
    setConfirmDeleteOpen(false)
    setEditOpen(false)
  }

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (isSortable) {
      handleOpenEdit()
      return
    }

    // No Desktop (com mouse), o hover já mostra o overlay e o clique abre direto o modal
    if (canHover) {
      if (!sold) onOpen(product)
      return
    }

    // No Mobile (touch): 1º toque anima o overlay para cima; 2º toque abre o modal
    if (!isMobileExpanded) {
      onMobileToggle?.(product.id)
    } else if (!sold) {
      onOpen(product)
    }
  }

  return (
    <>
      <Box ref={setNodeRef} style={style}>
        <Card
          onClick={handleCardClick}
          sx={{
            position: "relative",
            borderRadius: 3,
            overflow: "hidden",
            cursor: !isSortable && sold ? "default" : "pointer",
            aspectRatio: "4 / 5",
            transition: isDragging
              ? "none"
              : "transform 180ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 180ms ease",
            transform: !canHover && isMobileExpanded ? "scale(0.985)" : "none",
            boxShadow: !canHover && isMobileExpanded ? 6 : 1,
            ...(canHover && {
              "&:hover": {
                transform: isDragging ? "none" : "translateY(-3px)",
                boxShadow: isDragging ? 8 : 5,
              },
              "&:hover .card-overlay": {
                opacity: 1,
                transform: "translateY(0)",
                pointerEvents: "auto",
              },
            }),
          }}
        >
          {/* Botões do Painel do Brechó */}
          {isSortable && (
            <>
              <Box
                onClick={(e) => e.stopPropagation()}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 44,
                  zIndex: 10,
                  bgcolor: "rgba(255,255,255,0.92)",
                  borderRadius: "50%",
                  boxShadow: 2,
                }}
              >
                <IconButton size="small" onClick={handleOpenEdit} aria-label="Editar produto">
                  <EditIcon fontSize="small" color="primary" />
                </IconButton>
              </Box>

              <Box
                {...attributes}
                {...listeners}
                onClick={(e) => e.stopPropagation()}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  zIndex: 10,
                  bgcolor: "rgba(255,255,255,0.92)",
                  borderRadius: "50%",
                  cursor: "grab",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: 2,
                  "&:active": { cursor: "grabbing" },
                }}
              >
                <IconButton size="small" aria-label="Reordenar produto">
                  <DragIndicatorIcon fontSize="small" />
                </IconButton>
              </Box>
            </>
          )}

          {/* Foto ocupando 100% do card */}
          <CardMedia
            component="img"
            image={product.image}
            alt={`${product.name} — ${product.condition}, tamanho ${product.size}`}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              transition: "transform 280ms cubic-bezier(0.22, 1, 0.36, 1)",
              transform: !canHover && isMobileExpanded ? "scale(1.04)" : "scale(1)",
              filter: sold ? "grayscale(0.75)" : "none",
            }}
          />

          {/* Badge de Status */}
          <Chip
            size="small"
            label={product.status}
            color={statusColor[product.status]}
            sx={{
              position: "absolute",
              top: 8,
              left: 8,
              zIndex: 5,
              fontWeight: 600,
              fontSize: { xs: "0.68rem", sm: "0.75rem" },
              height: { xs: 22, sm: 24 },
              boxShadow: 1,
            }}
          />

          {/* Overlay animado (Hover no Desktop / 1º Toque no Mobile) */}
          <Box
            className="card-overlay"
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(16, 26, 19, 0.96) 0%, rgba(16, 26, 19, 0.74) 58%, rgba(16, 26, 19, 0.16) 100%)",
              color: "#fff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              p: { xs: 1.25, sm: 2 },
              opacity: !canHover && isMobileExpanded ? 1 : 0,
              transform: !canHover && isMobileExpanded ? "translateY(0)" : "translateY(14px)",
              pointerEvents: !canHover && isMobileExpanded ? "auto" : "none",
              transition:
                "opacity 240ms cubic-bezier(0.22, 1, 0.36, 1), transform 240ms cubic-bezier(0.22, 1, 0.36, 1)",
              zIndex: 4,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "rgba(255,255,255,0.75)",
                textTransform: "uppercase",
                letterSpacing: 0.5,
                fontSize: { xs: "0.62rem", sm: "0.7rem" },
                lineHeight: 1.2,
              }}
            >
              {product.category} · Tam. {product.size}
            </Typography>

            <Typography
              variant="subtitle1"
              component="h3"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "0.85rem", sm: "1rem" },
                lineHeight: 1.2,
                mt: 0.25,
                mb: 0.5,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {product.name}
            </Typography>

            <Stack
              direction="row"
              spacing={0.75}
              alignItems="center"
              sx={{ mb: { xs: 0.75, sm: 1.25 } }}
            >
              <Stack direction="row" spacing={0.3} alignItems="center">
                <WaterDropIcon sx={{ fontSize: 12, color: "#81c784" }} aria-hidden />
                <Typography
                  variant="caption"
                  sx={{ color: "rgba(255,255,255,0.9)", fontSize: { xs: "0.65rem", sm: "0.75rem" } }}
                >
                  {(product.waterSaved / 1000).toFixed(1)} mil L
                </Typography>
              </Stack>
              <Stack direction="row" spacing={0.3} alignItems="center">
                <RecyclingIcon sx={{ fontSize: 12, color: "#81c784" }} aria-hidden />
                <Typography
                  variant="caption"
                  sx={{ color: "rgba(255,255,255,0.9)", fontSize: { xs: "0.65rem", sm: "0.75rem" } }}
                >
                  {product.wasteSaved} g
                </Typography>
              </Stack>
            </Stack>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems={{ xs: "stretch", sm: "center" }}
              justifyContent="space-between"
              spacing={{ xs: 0.6, sm: 1 }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  color: "#a5d6a7",
                  fontSize: { xs: "0.95rem", sm: "1.15rem" },
                  lineHeight: 1.1,
                }}
              >
                {brl(product.price)}
              </Typography>

              {!isSortable && (
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  disabled={sold}
                  onClick={(e) => {
                    e.stopPropagation()
                    onOpen(product)
                  }}
                  sx={{
                    minWidth: 0,
                    px: 1.25,
                    py: 0.4,
                    fontSize: { xs: "0.72rem", sm: "0.8rem" },
                    textTransform: "none",
                    fontWeight: 700,
                    borderRadius: 2,
                  }}
                >
                  {sold ? "Vendido" : "Ver detalhes"}
                </Button>
              )}
            </Stack>
          </Box>
        </Card>
      </Box>

      {/* Modal de Edição Completo */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Informações da Peça</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5 }}>
            <Box
              component="img"
              src={previewImage}
              alt="Preview da peça"
              sx={{ width: 100, height: 100, objectFit: "cover", borderRadius: 2, boxShadow: 1 }}
            />
            <Button variant="outlined" component="label" size="small">
              Trocar Foto
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    const file = e.target.files[0]
                    setImageFile(file)
                    setPreviewImage(URL.createObjectURL(file))
                  }
                }}
              />
            </Button>
          </Box>

          <TextField
            label="Nome da Peça"
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            fullWidth
            sx={{ mt: 1 }}
          />
          <TextField
            label="Preço (R$)"
            type="number"
            value={editForm.price}
            onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
            fullWidth
          />
          <TextField
            label="Tamanho"
            value={editForm.size}
            onChange={(e) => setEditForm({ ...editForm, size: e.target.value })}
            fullWidth
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0, justifyContent: "space-between" }}>
          <Button
            color="error"
            variant="outlined"
            startIcon={<DeleteIcon />}
            onClick={() => setConfirmDeleteOpen(true)}
          >
            Excluir Peça
          </Button>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button onClick={() => setEditOpen(false)}>Cancelar</Button>
            <Button variant="contained" onClick={handleSaveEdit}>
              Salvar Alterações
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {/* Modal de Confirmação de Exclusão */}
      <Dialog
        open={confirmDeleteOpen}
        onClose={() => !deleting && setConfirmDeleteOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Excluir peça da vitrine?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Tem certeza que deseja excluir <strong>{product.name}</strong>? Essa ação remove a peça
            permanentemente do catálogo.
          </Typography> 
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setConfirmDeleteOpen(false)} disabled={deleting}>
            Cancelar
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleConfirmDelete}
            disabled={deleting}
          >
            {deleting ? "Excluindo..." : "Confirmar Exclusão"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}