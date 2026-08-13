"use client"

import CheckIcon from "@mui/icons-material/Check"
import CloseIcon from "@mui/icons-material/Close"
import Inventory2Icon from "@mui/icons-material/Inventory2"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import Chip from "@mui/material/Chip"
import { Stack } from "@/components/flex"
import Typography from "@mui/material/Typography"
import { useStore } from "@/lib/store"
import type { DesapegoRequest } from "@/lib/types"

const statusColor: Record<DesapegoRequest["status"], "warning" | "success" | "default"> = {
  Pendente: "warning",
  Aceito: "success",
  Recusado: "default",
}

export function DesapegoInbox() {
  const { desapegos, resolveDesapego } = useStore()

  return (
    <Box>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
        <Inventory2Icon color="primary" aria-hidden />
        <Typography variant="h6" component="h3">
          Solicitações de desapego da comunidade
        </Typography>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Membros que querem colocar peças à venda. Aceite para adicioná-las ao fluxo do brechó.
      </Typography>

      <Stack spacing={1.5}>
        {desapegos.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            Nenhuma solicitação no momento.
          </Typography>
        )}
        {desapegos.map((d) => (
          <Card key={d.id} variant="outlined" sx={{ p: 2 }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              justifyContent="space-between"
            >
              <Box>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                  <Typography variant="subtitle1" fontWeight={700}>
                    {d.itemName}
                  </Typography>
                  <Chip size="small" label={d.category} variant="outlined" />
                  <Chip size="small" label={d.status} color={statusColor[d.status]} />
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {d.description}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Enviado por {d.memberName} · {d.contact}
                </Typography>
              </Box>

              {d.status === "Pendente" && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    startIcon={<CheckIcon />}
                    onClick={() => resolveDesapego(d.id, true)}
                    aria-label={`Aceitar desapego ${d.itemName}`}
                  >
                    Aceitar
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="inherit"
                    startIcon={<CloseIcon />}
                    onClick={() => resolveDesapego(d.id, false)}
                    aria-label={`Recusar desapego ${d.itemName}`}
                  >
                    Recusar
                  </Button>
                </Stack>
              )}
            </Stack>
          </Card>
        ))}
      </Stack>
    </Box>
  )
}
