"use client"

import RecyclingIcon from "@mui/icons-material/Recycling"
import WaterDropIcon from "@mui/icons-material/WaterDrop"
import Favorite from "@mui/icons-material/Favorite"
import Box from "@mui/material/Box"
import { Stack } from "@/components/flex"
import Typography from "@mui/material/Typography"

const highlights = [
  { icon: <RecyclingIcon aria-hidden />, label: "Cada peça reaproveitada evita resíduos têxteis" },
  { icon: <WaterDropIcon aria-hidden />, label: "Economize milhares de litros de água por item" },
  { icon: <Favorite aria-hidden />, label: "Comunidade que compra, conversa e desapega" },
]

export function Banner() {
  return (
    <Box
      component="section"
      aria-labelledby="banner-title"
      sx={{
        bgcolor: "primary.main",
        color: "primary.contrastText",
        borderRadius: 4,
        p: { xs: 3, md: 5 },
        mb: 4,
      }}
    >
      <Typography
        id="banner-title"
        variant="h3"
        component="h1"
        sx={{ fontSize: { xs: "1.9rem", md: "2.6rem" }, maxWidth: 720 }}
        gutterBottom
      >
        Dê uma nova vida às roupas. Vista a moda circular.
      </Typography>
      <Typography variant="body1" sx={{ maxWidth: 640, opacity: 0.92 }}>
        No ReVeste, cada desapego vira oportunidade. Compre peças de segunda mão com
        qualidade garantida, converse direto com o brechó e ajude a reduzir o impacto da
        indústria da moda.
      </Typography>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ mt: 3 }}
        divider={
          <Box
            aria-hidden
            sx={{
              width: { xs: "100%", sm: "1px" },
              height: { xs: "1px", sm: "auto" },
              bgcolor: "rgba(255,255,255,0.3)",
            }}
          />
        }
      >
        {highlights.map((h) => (
          <Stack key={h.label} direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1 }}>
            <Box sx={{ display: "flex", opacity: 0.95 }}>{h.icon}</Box>
            <Typography variant="body2" sx={{ opacity: 0.95 }}>
              {h.label}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  )
}
