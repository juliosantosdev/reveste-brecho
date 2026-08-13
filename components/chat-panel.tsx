"use client"

import SendIcon from "@mui/icons-material/Send"
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutlineOutlined"
import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import Paper from "@mui/material/Paper"
import { Stack } from "@/components/flex"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { useEffect, useMemo, useRef, useState } from "react"
import { useStore } from "@/lib/store"
import type { ChatMessage } from "@/lib/types"

/** Respostas automáticas simuladas do brechó para dar feedback ao comprador. */
const autoReplies = [
  "Oi! Obrigado pela mensagem. A peça está disponível e em ótimo estado :)",
  "Podemos combinar a retirada em nosso ateliê ou envio pelos Correios. O que prefere?",
  "Claro! Consigo enviar mais fotos dos detalhes ainda hoje.",
  "Essa peça passou por higienização antes de entrar na vitrine, pode ficar tranquilo!",
]

export function ChatPanel({ productId }: { productId: string }) {
  const { messages, sendMessage } = useStore()
  const [text, setText] = useState("")
  const listRef = useRef<HTMLDivElement>(null)

  const thread = useMemo(
    () => messages.filter((m) => m.productId === productId),
    [messages, productId],
  )

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" })
  }, [thread.length])

  const handleSend = () => {
    const value = text.trim()
    if (!value) return
    sendMessage(productId, value, "cliente")
    setText("")
    // Simula a resposta do brechó (feedback do sistema)
    const reply = autoReplies[Math.floor(Math.random() * autoReplies.length)]
    setTimeout(() => sendMessage(productId, reply, "brecho"), 900)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      if ((e.nativeEvent as any).isComposing || (e as any).keyCode === 229) return
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <Stack sx={{ height: "100%", minHeight: 0 }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
        <ChatBubbleOutlineIcon color="primary" fontSize="small" aria-hidden />
        <Typography variant="subtitle1" component="h4" fontWeight={700}>
          Converse com o brechó
        </Typography>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
        Tire dúvidas sobre o estado da peça ou combine a entrega em tempo real.
      </Typography>

      <Box
        ref={listRef}
        role="log"
        aria-live="polite"
        aria-label="Histórico de mensagens"
        sx={{
          flex: 1,
          minHeight: 220,
          maxHeight: 320,
          overflowY: "auto",
          bgcolor: "background.default",
          borderRadius: 2,
          p: 1.5,
          display: "flex",
          flexDirection: "column",
          gap: 1.25,
        }}
      >
        {thread.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ m: "auto" }}>
            Nenhuma mensagem ainda. Envie a primeira pergunta!
          </Typography>
        )}
        {thread.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
      </Box>

      <Stack direction="row" spacing={1} sx={{ mt: 1.5 }} alignItems="flex-end">
        <TextField
          fullWidth
          size="small"
          multiline
          maxRows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite sua mensagem..."
          aria-label="Escrever mensagem para o brechó"
        />
        <IconButton
          color="primary"
          onClick={handleSend}
          disabled={!text.trim()}
          aria-label="Enviar mensagem"
          sx={{ bgcolor: "primary.main", color: "primary.contrastText", "&:hover": { bgcolor: "primary.dark" }, "&.Mui-disabled": { bgcolor: "action.disabledBackground" } }}
        >
          <SendIcon />
        </IconButton>
      </Stack>
    </Stack>
  )
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isClient = message.sender === "cliente"
  return (
    <Stack
      direction="row"
      spacing={1}
      justifyContent={isClient ? "flex-end" : "flex-start"}
      alignItems="flex-end"
    >
      {!isClient && (
        <Avatar sx={{ width: 28, height: 28, bgcolor: "secondary.main", fontSize: 13 }}>
          BR
        </Avatar>
      )}
      <Paper
        elevation={0}
        sx={{
          maxWidth: "75%",
          px: 1.5,
          py: 1,
          borderRadius: 2,
          bgcolor: isClient ? "primary.main" : "background.paper",
          color: isClient ? "primary.contrastText" : "text.primary",
          border: isClient ? "none" : "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="body2">{message.text}</Typography>
        <Typography
          variant="caption"
          sx={{ display: "block", textAlign: "right", opacity: 0.7, mt: 0.25 }}
        >
          {message.time}
        </Typography>
      </Paper>
    </Stack>
  )
}
