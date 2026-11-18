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
        position: "relative",
        borderRadius: 4,
        overflow: "hidden",
        // Gradiente terracota acolhedor exclusivo desta seção
        background: "linear-gradient(145deg, #a75225 0%, #bd5e2b 55%, #94461e 100%)",
        color: "#ffffff",
        p: { xs: 3, md: 4 },
        // Cavidade 3D (inset) + Glassmorphism externo translúcido com brilho nas bordas
        boxShadow: `
          inset 0 12px 28px rgba(60, 20, 8, 0.75),
          inset 0 -8px 16px rgba(130, 65, 30, 0.5),
          inset 0 1px 3px rgba(255, 255, 255, 0.3),
          0 16px 36px rgba(150, 75, 35, 0.25),
          0 0 0 1.5px rgba(255, 255, 255, 0.3),
          0 0 24px rgba(255, 255, 255, 0.1)
        `,
      }}
    >
      {/* Padrão botânico translúcido idêntico ao do Hero Banner, integrado com blend mode */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('/pattern-sustentavel.png')",
          backgroundSize: { xs: "135% auto", sm: "110% auto", md: "85% auto" },
          backgroundPosition: { xs: "right -15px top -10px", md: "right top" },
          backgroundRepeat: "no-repeat",
          opacity: 0.16,
          mixBlendMode: "screen",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Conteúdo principal alinhado acima da camada 3D */}
      <Box sx={{ position: "relative", zIndex: 2, display: "flex", flexDirection: { xs: "column", md: "row" }, alignItems: { md: "center" }, gap: 3 }}>
        <Box
          sx={{
            display: "flex",
            p: 1.5,
            borderRadius: 3,
            bgcolor: "rgba(0, 0, 0, 0.22)",
            backdropFilter: "blur(6px)",
            border: "1px solid rgba(255, 255, 255, 0.18)",
            width: "fit-content",
          }}
        >
          <VolunteerActivismIcon sx={{ fontSize: 36, color: "#ffccbc" }} aria-hidden />
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography
            id="desapego-cta-title"
            variant="h5"
            component="h3"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "1.35rem", sm: "1.6rem" },
              lineHeight: 1.2,
              mb: 1,
              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            Tem peças paradas no armário?
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "rgba(255, 255, 255, 0.92)",
              lineHeight: 1.5,
              fontSize: { xs: "0.85rem", sm: "0.95rem" },
              maxWidth: "520px",
            }}
          >
            Envie uma solicitação e coopere com a comunidade. O brechó avalia e coloca sua peça à venda na plataforma.
          </Typography>
        </Box>

        <Button
          variant="contained"
          size="large"
          onClick={() => setOpen(true)}
          sx={{
            bgcolor: "#ffffff",
            color: "#94461e",
            fontWeight: 800,
            borderRadius: 99,
            px: 3.5,
            py: 1.2,
            boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
            border: "1px solid rgba(255, 255, 255, 0.6)",
            transition: "transform 150ms ease, background-color 150ms ease",
            "&:hover": {
              bgcolor: "#fdfbf7",
              transform: "translateY(-2px)",
              boxShadow: "0 12px 26px rgba(0,0,0,0.3)",
            },
          }}
        >
          Quero desapegar
        </Button>
      </Box>

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