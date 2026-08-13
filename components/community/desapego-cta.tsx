"use client"

import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import MenuItem from "@mui/material/MenuItem"
import { Stack } from "@/components/flex"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { useState } from "react"
import { useStore } from "@/lib/store"
import { CATEGORIES, type Category } from "@/lib/types"

interface FormState {
  memberName: string
  contact: string
  itemName: string
  category: Category
  description: string
}

const emptyForm: FormState = {
  memberName: "",
  contact: "",
  itemName: "",
  category: "Roupas",
  description: "",
}

export function DesapegoCta() {
  const { addDesapego } = useStore()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const set = (field: keyof FormState, value: string) =>
    setForm((f) => ({ ...f, [field]: value }))

  const handleSubmit = () => {
    const e: Record<string, string> = {}
    if (!form.memberName.trim()) e.memberName = "Informe seu nome."
    if (!form.contact.trim()) e.contact = "Informe um contato (e-mail ou telefone)."
    if (!form.itemName.trim()) e.itemName = "Informe a peça que deseja desapegar."
    setErrors(e)
    if (Object.keys(e).length) return

    addDesapego({
      memberName: form.memberName.trim(),
      contact: form.contact.trim(),
      itemName: form.itemName.trim(),
      category: form.category,
      description: form.description.trim() || "Sem descrição adicional.",
    })
    setForm(emptyForm)
    setErrors({})
    setOpen(false)
  }

  return (
    <Box
      component="section"
      aria-labelledby="desapego-cta-title"
      sx={{
        bgcolor: "secondary.main",
        color: "secondary.contrastText",
        borderRadius: 4,
        p: { xs: 3, md: 4 },
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: { md: "center" },
        gap: 2,
      }}
    >
      <VolunteerActivismIcon sx={{ fontSize: 48 }} aria-hidden />
      <Box sx={{ flex: 1 }}>
        <Typography id="desapego-cta-title" variant="h5" component="h3">
          Tem peças paradas no armário?
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.92 }}>
          Envie uma solicitação e coopere com a comunidade. O brechó avalia e coloca sua
          peça à venda na plataforma.
        </Typography>
      </Box>
      <Button
        variant="contained"
        size="large"
        onClick={() => setOpen(true)}
        sx={{
          bgcolor: "secondary.contrastText",
          color: "secondary.main",
          "&:hover": { bgcolor: "rgba(255,255,255,0.88)" },
        }}
      >
        Quero desapegar
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Quero desapegar</DialogTitle>
        <DialogContent dividers>
          <DialogContentText sx={{ mb: 2 }}>
            Conte sobre a peça que deseja doar ou vender. O brechó entrará em contato para
            combinar a coleta.
          </DialogContentText>
          <Stack spacing={2.5}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Seu nome"
                required
                value={form.memberName}
                onChange={(e) => set("memberName", e.target.value)}
                error={!!errors.memberName}
                helperText={errors.memberName}
                fullWidth
              />
              <TextField
                label="Contato (e-mail ou telefone)"
                required
                value={form.contact}
                onChange={(e) => set("contact", e.target.value)}
                error={!!errors.contact}
                helperText={errors.contact}
                fullWidth
              />
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Peça"
                required
                value={form.itemName}
                onChange={(e) => set("itemName", e.target.value)}
                error={!!errors.itemName}
                helperText={errors.itemName}
                fullWidth
              />
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
            </Stack>
            <TextField
              label="Descrição (estado, tamanho, etc.)"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              multiline
              minRows={2}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpen(false)} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            Enviar solicitação
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
