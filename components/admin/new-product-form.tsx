"use client"

import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import InputAdornment from "@mui/material/InputAdornment"
import MenuItem from "@mui/material/MenuItem"
import { Stack } from "@/components/flex"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { useState } from "react"
import { useStore } from "@/lib/store"
import { CATEGORIES, type Category, type Condition } from "@/lib/types"

const CONDITIONS: Condition[] = ["Novo com etiqueta", "Excelente", "Seminovo", "Bom"]

// Fotos fictícias disponíveis para o cadastro simulado
const PLACEHOLDER_IMAGES = [
  "/products/jaqueta-jeans.png",
  "/products/vestido-floral.png",
  "/products/tenis-couro.png",
  "/products/bolsa-couro.png",
  "/products/camisa-linho.png",
  "/products/botas-cano-curto.png",
]

interface FormState {
  name: string
  category: Category
  size: string
  condition: Condition
  price: string
  description: string
  image: string
}

const emptyForm: FormState = {
  name: "",
  category: "Roupas",
  size: "",
  condition: "Excelente",
  price: "",
  description: "",
  image: PLACEHOLDER_IMAGES[0],
}

export function NewProductForm({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const { addProduct } = useStore()
  const [form, setForm] = useState<FormState>(emptyForm)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const set = (field: keyof FormState, value: string) =>
    setForm((f) => ({ ...f, [field]: value }))

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = "Informe o nome da peça."
    if (!form.size.trim()) e.size = "Informe o tamanho."
    const price = Number(form.price.replace(",", "."))
    if (!form.price.trim() || Number.isNaN(price) || price <= 0)
      e.price = "Informe um preço válido."
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    addProduct({
      name: form.name.trim(),
      category: form.category,
      size: form.size.trim(),
      condition: form.condition,
      price: Number(form.price.replace(",", ".")),
      description: form.description.trim() || "Peça de segunda mão em bom estado.",
      image: form.image,
    })
    setForm(emptyForm)
    setErrors({})
    onClose()
  }

  const handleClose = () => {
    setErrors({})
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <AddPhotoAlternateIcon color="primary" aria-hidden />
        Cadastrar novo desapego
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2.5} sx={{ mt: 0.5 }}>
          <TextField
            label="Nome da peça"
            required
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
          />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              select
              label="Categoria"
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              fullWidth
            >
              {CATEGORIES.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Tamanho"
              required
              value={form.size}
              onChange={(e) => set("size", e.target.value)}
              error={!!errors.size}
              helperText={errors.size}
              fullWidth
            />
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              select
              label="Estado de conservação"
              value={form.condition}
              onChange={(e) => set("condition", e.target.value)}
              fullWidth
            >
              {CONDITIONS.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Preço"
              required
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
              error={!!errors.price}
              helperText={errors.price}
              inputMode="decimal"
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                },
              }}
              fullWidth
            />
          </Stack>

          <TextField
            label="Descrição"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            multiline
            minRows={2}
            fullWidth
          />

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Foto da peça (simulada)
            </Typography>
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              sx={{ mb: 1.5 }}
            >
              Enviar foto
              <input
                type="file"
                accept="image/*"
                hidden
                aria-label="Enviar foto da peça"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) set("image", URL.createObjectURL(file))
                }}
              />
            </Button>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {PLACEHOLDER_IMAGES.map((src) => (
                <Box
                  key={src}
                  component="button"
                  type="button"
                  onClick={() => set("image", src)}
                  aria-label="Selecionar esta foto"
                  aria-pressed={form.image === src}
                  sx={{
                    p: 0,
                    border: "2px solid",
                    borderColor: form.image === src ? "primary.main" : "transparent",
                    borderRadius: 2,
                    overflow: "hidden",
                    cursor: "pointer",
                    lineHeight: 0,
                  }}
                >
                  <Box
                    component="img"
                    src={src}
                    alt=""
                    aria-hidden
                    sx={{ width: 56, height: 56, objectFit: "cover", display: "block" }}
                  />
                </Box>
              ))}
            </Stack>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} color="inherit">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant="contained">
          Cadastrar peça
        </Button>
      </DialogActions>
    </Dialog>
  )
}
