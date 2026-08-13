"use client"

import StarIcon from "@mui/icons-material/Star"
import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import Collapse from "@mui/material/Collapse"
import Rating from "@mui/material/Rating"
import { Stack } from "@/components/flex"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { useMemo, useState } from "react"
import { useStore } from "@/lib/store"

export function ReviewsSection() {
  const { reviews, addReview } = useStore()
  const [open, setOpen] = useState(false)
  const [author, setAuthor] = useState("")
  const [rating, setRating] = useState<number | null>(5)
  const [comment, setComment] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const average = useMemo(
    () =>
      reviews.length
        ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
        : 0,
    [reviews],
  )

  const handleSubmit = () => {
    const e: Record<string, string> = {}
    if (!author.trim()) e.author = "Informe seu nome."
    if (!rating) e.rating = "Selecione uma nota."
    if (!comment.trim()) e.comment = "Escreva um comentário."
    setErrors(e)
    if (Object.keys(e).length) return

    addReview(author.trim(), rating as number, comment.trim())
    setAuthor("")
    setComment("")
    setRating(5)
    setOpen(false)
  }

  return (
    <Box component="section" aria-labelledby="reviews-title">
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={1.5}
        sx={{ mb: 2 }}
      >
        <Box>
          <Typography id="reviews-title" variant="h5" component="h3">
            Reputação do brechó
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Rating
              value={average}
              precision={0.1}
              readOnly
              aria-label={`Nota média ${average.toFixed(1)} de 5`}
            />
            <Typography variant="body2" color="text.secondary">
              {average.toFixed(1)} · {reviews.length} avaliações
            </Typography>
          </Stack>
        </Box>
        <Button
          variant={open ? "text" : "contained"}
          startIcon={<StarIcon />}
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
        >
          {open ? "Cancelar" : "Avaliar brechó"}
        </Button>
      </Stack>

      <Collapse in={open}>
        <Card sx={{ p: 2.5, mb: 3, bgcolor: "background.default" }}>
          <Stack spacing={2}>
            <TextField
              label="Seu nome"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              error={!!errors.author}
              helperText={errors.author}
              size="small"
              fullWidth
            />
            <Box>
              <Typography variant="body2" gutterBottom>
                Sua nota
              </Typography>
              <Rating
                value={rating}
                onChange={(_, v) => setRating(v)}
                aria-label="Selecione uma nota"
              />
              {errors.rating && (
                <Typography variant="caption" color="error" display="block">
                  {errors.rating}
                </Typography>
              )}
            </Box>
            <TextField
              label="Comentário"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              error={!!errors.comment}
              helperText={errors.comment}
              multiline
              minRows={2}
              fullWidth
            />
            <Box>
              <Button variant="contained" onClick={handleSubmit}>
                Publicar avaliação
              </Button>
            </Box>
          </Stack>
        </Card>
      </Collapse>

      <Stack spacing={1.5}>
        {reviews.map((r) => (
          <Card key={r.id} variant="outlined" sx={{ p: 2 }}>
            <Stack direction="row" spacing={1.5}>
              <Avatar sx={{ bgcolor: "secondary.main" }}>
                {r.author.charAt(0)}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  flexWrap="wrap"
                >
                  <Typography variant="subtitle2" fontWeight={700}>
                    {r.author}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {r.date}
                  </Typography>
                </Stack>
                <Rating value={r.rating} readOnly size="small" sx={{ my: 0.5 }} />
                <Typography variant="body2" color="text.secondary">
                  {r.comment}
                </Typography>
              </Box>
            </Stack>
          </Card>
        ))}
      </Stack>
    </Box>
  )
}
