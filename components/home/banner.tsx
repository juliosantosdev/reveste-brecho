"use client"

import { useRef } from "react"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import RecyclingIcon from "@mui/icons-material/Recycling"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import Chip from "@mui/material/Chip"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import { Stack } from "@/components/flex"
import type { Product } from "@/lib/types"

const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

export function Banner({
  products = [],
  onOpen,
}: {
  products?: Product[]
  onOpen?: (p: Product) => void
}) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const featured = products
    .filter((p) => p.status !== "Concluído/Vendido")
    .slice(0, 6)

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return
    const offset = direction === "left" ? -220 : 220
    scrollRef.current.scrollBy({ left: offset, behavior: "smooth" })
  }

  return (
    <Box component="section" aria-labelledby="banner-title" sx={{ mb: { xs: 3, md: 4 } }}>
      {/* Card Editorial Principal (Compacto e limpo) */}
      <Box
        sx={{
          position: "relative",
          borderRadius: 4,
          overflow: "hidden",
          background:
            "linear-gradient(135deg, #1b3b24 0%, #2e5e3a 55%, #3d754b 100%)",
          color: "primary.contrastText",
          pt: { xs: 2.5, md: 4 },
          px: { xs: 2, md: 4 },
          pb: featured.length > 0 ? { xs: 2.5, md: 3.5 } : { xs: 3, md: 4 },
          boxShadow: "0 12px 28px rgba(27, 59, 36, 0.16)",
        }}
      >
        {/* Detalhe decorativo sutil no fundo */}
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            top: -50,
            right: -40,
            width: 220,
            height: 220,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Cabeçalho curto e editorial */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "flex-end" }}
          spacing={1.5}
          sx={{ mb: featured.length > 0 ? 2.5 : 0 }}
        >
          <Box>
            <Chip
              size="small"
              icon={<RecyclingIcon sx={{ fontSize: 14, color: "#a5d6a7 !important" }} />}
              label="Curadoria Circular"
              sx={{
                bgcolor: "rgba(255,255,255,0.12)",
                color: "#e8f5e9",
                fontWeight: 600,
                fontSize: "0.7rem",
                height: 24,
                mb: 1,
                backdropFilter: "blur(6px)",
              }}
            />
            <Typography
              id="banner-title"
              variant="h4"
              component="h1"
              sx={{
                fontSize: { xs: "1.45rem", sm: "1.9rem", md: "2.25rem" },
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
              }}
            >
              Moda com nova história.
            </Typography>
          </Box>

          <Typography
            variant="body2"
            sx={{
              color: "rgba(255,255,255,0.82)",
              maxWidth: 340,
              fontSize: { xs: "0.8rem", sm: "0.875rem" },
              lineHeight: 1.4,
            }}
          >
            Peças únicas selecionadas com impacto ambiental reduzido.
          </Typography>
        </Stack>

        {/* Faixa de Destaques (estilo referência visual) */}
        {featured.length > 0 && (
          <Box
            ref={scrollRef}
            sx={{
              display: "flex",
              gap: { xs: 1.5, sm: 2 },
              overflowX: "auto",
              scrollSnapType: "x mandatory",
              pb: 0.5,
              "&::-webkit-scrollbar": { display: "none" },
              scrollbarWidth: "none",
            }}
          >
            {featured.map((item) => (
              <Card
                key={item.id}
                onClick={() => onOpen?.(item)}
                sx={{
                  flex: { xs: "0 0 132px", sm: "0 0 164px", md: "0 0 185px" },
                  scrollSnapAlign: "start",
                  bgcolor: "#ffffff",
                  color: "text.primary",
                  borderRadius: 3,
                  p: 1,
                  cursor: "pointer",
                  boxShadow: "0 6px 16px rgba(0,0,0,0.18)",
                  transition: "transform 160ms ease, box-shadow 160ms ease",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 10px 22px rgba(0,0,0,0.24)",
                  },
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "1 / 1",
                    borderRadius: 2,
                    overflow: "hidden",
                    bgcolor: "#f4f3ef",
                    mb: 1,
                  }}
                >
                  <Box
                    component="img"
                    src={item.image}
                    alt={item.name}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </Box>

                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: "0.78rem", sm: "0.85rem" },
                    lineHeight: 1.2,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    mb: 0.35,
                  }}
                >
                  {item.name}
                </Typography>

                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 800,
                      color: "primary.main",
                      fontSize: { xs: "0.78rem", sm: "0.85rem" },
                    }}
                  >
                    {brl(item.price)}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: "0.68rem", fontWeight: 600 }}
                  >
                    Tam. {item.size}
                  </Typography>
                </Stack>
              </Card>
            ))}
          </Box>
        )}
      </Box>

      {/* Controles circulares sutis abaixo do card (igual à referência) */}
      {featured.length > 2 && (
        <Stack direction="row" justifyContent="center" spacing={1} sx={{ mt: 1.25 }}>
          <IconButton
            size="small"
            onClick={() => handleScroll("left")}
            aria-label="Destaque anterior"
            sx={{
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              width: 30,
              height: 30,
              boxShadow: 1,
            }}
          >
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleScroll("right")}
            aria-label="Próximo destaque"
            sx={{
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              width: 30,
              height: 30,
              boxShadow: 1,
            }}
          >
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </Stack>
      )}
    </Box>
  )
}