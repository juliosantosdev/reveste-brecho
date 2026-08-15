"use client";

import { useState } from "react";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import RecyclingIcon from "@mui/icons-material/Recycling";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import EditIcon from "@mui/icons-material/Edit";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import { Stack } from "@/components/flex";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import type { OrderStatus, Product } from "@/lib/types";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useStore } from "@/lib/store";

const statusColor: Record<
  OrderStatus,
  "success" | "warning" | "info" | "default"
> = {
  Disponível: "success",
  "Reservado pelo Cliente": "warning",
  "Aguardando Retirada": "info",
  "Concluído/Vendido": "default",
};

const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function ProductCard({
  product,
  onOpen,
  isSortable = false,
}: {
  product: Product;
  onOpen: (p: Product) => void;
  isSortable?: boolean;
}) {
  const sold = product.status === "Concluído/Vendido";
  const { updateProductDetails } = useStore();

  // Estado para controlar o modal de edição e novos campos de imagem
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: product.name,
    price: product.price,
    size: product.size,
    description: product.description,
    category: product.category,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState(product.image);

  // Lógica de sortable do dnd-kit
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id, disabled: !isSortable });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 2 : 0,
    opacity: isDragging ? 0.8 : 1,
  };

  // Função para abrir o modal com os dados atualizados
  const handleOpenEdit = () => {
    setEditForm({
      name: product.name,
      price: product.price,
      size: product.size,
      description: product.description,
      category: product.category,
    });
    setPreviewImage(product.image);
    setImageFile(null);
    setEditOpen(true);
  };

  // Função para salvar a edição incluindo a nova foto se houver
  const handleSaveEdit = async () => {
    await updateProductDetails(product.id, editForm, imageFile);
    setEditOpen(false);
  };

  return (
    <>
      <Box ref={setNodeRef} style={style}>
        <Card
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            transition: isDragging
              ? "none"
              : "transform 120ms ease, box-shadow 120ms ease",
            "&:hover": {
              transform: isDragging ? "none" : "translateY(-4px)",
              boxShadow: isDragging ? 8 : 4,
            },
            position: "relative",
          }}
        >
          {/* Botões do Painel do Brechó */}
          {isSortable && (
            <>
              {/* Botão de Editar */}
              <Box
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 48,
                  zIndex: 10,
                  bgcolor: "rgba(255,255,255,0.9)",
                  borderRadius: "50%",
                  boxShadow: 2,
                }}
              >
                <IconButton
                  size="small"
                  onClick={handleOpenEdit}
                  aria-label="Editar produto"
                >
                  <EditIcon fontSize="small" color="primary" />
                </IconButton>
              </Box>

              {/* Botão de Arrastar */}
              <Box
                {...attributes}
                {...listeners}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  zIndex: 10,
                  bgcolor: "rgba(255,255,255,0.9)",
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

          <Box sx={{ position: "relative" }}>
            <CardMedia
              component="img"
              height="220"
              image={product.image}
              alt={`${product.name} — ${product.condition}, tamanho ${product.size}`}
              sx={{
                objectFit: "cover",
                filter: sold ? "grayscale(0.7)" : "none",
              }}
            />
            <Chip
              size="small"
              label={product.status}
              color={statusColor[product.status]}
              sx={{ position: "absolute", top: 10, left: 10 }}
            />
          </Box>

          <CardContent sx={{ flexGrow: 1 }}>
            <Typography variant="overline" color="text.secondary">
              {product.category}
            </Typography>
            <Typography variant="h6" component="h3" sx={{ mb: 1 }}>
              {product.name}
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              sx={{ mb: 1.5 }}
              flexWrap="wrap"
              useFlexGap
            >
              <Chip
                size="small"
                variant="outlined"
                label={`Tam. ${product.size}`}
              />
              <Chip size="small" variant="outlined" label={product.condition} />
            </Stack>

            <Tooltip
              title={`Reutilizar esta peça economiza cerca de ${product.waterSaved.toLocaleString("pt-BR")} L de água e evita ${product.wasteSaved} g de resíduos têxteis.`}
            >
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{
                  bgcolor: "rgba(46,94,58,0.08)",
                  color: "primary.main",
                  px: 1,
                  py: 0.75,
                  borderRadius: 2,
                  width: "fit-content",
                }}
              >
                <WaterDropIcon fontSize="small" aria-hidden />
                <Typography variant="caption" fontWeight={700}>
                  {(product.waterSaved / 1000).toFixed(1)} mil L
                </Typography>
                <RecyclingIcon fontSize="small" aria-hidden />
                <Typography variant="caption" fontWeight={700}>
                  {product.wasteSaved} g
                </Typography>
              </Stack>
            </Tooltip>

            <Typography variant="h5" color="primary" sx={{ mt: 2 }}>
              {brl(product.price)}
            </Typography>
          </CardContent>

          <CardActions sx={{ p: 2, pt: 0 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => onOpen(product)}
              disabled={sold}
              aria-label={`Ver detalhes e reservar ${product.name}`}
            >
              {sold ? "Vendido" : "Ver Detalhes & Reservar"}
            </Button>
          </CardActions>
        </Card>
      </Box>

      {/* Modal de Edição Completo */}
      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Editar Informações da Peça</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 2 }}
        >
          {/* Seção de Troca de Foto */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Box
              component="img"
              src={previewImage}
              alt="Preview da peça"
              sx={{
                width: 100,
                height: 100,
                objectFit: "cover",
                borderRadius: 2,
                boxShadow: 1,
              }}
            />
            <Button variant="outlined" component="label" size="small">
              Trocar Foto
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    const file = e.target.files[0];
                    setImageFile(file);
                    setPreviewImage(URL.createObjectURL(file));
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
            onChange={(e) =>
              setEditForm({ ...editForm, price: Number(e.target.value) })
            }
            fullWidth
          />
          <TextField
            label="Tamanho"
            value={editForm.size}
            onChange={(e) => setEditForm({ ...editForm, size: e.target.value })}
            fullWidth
          />
          <TextField
            label="Categoria"
            value={editForm.category}
            onChange={(e) =>
              setEditForm({ ...editForm, category: e.target.value })
            }
            fullWidth
          />
          <TextField
            label="Descrição"
            value={editForm.description}
            onChange={(e) =>
              setEditForm({ ...editForm, description: e.target.value })
            }
            fullWidth
            multiline
            rows={2}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setEditOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSaveEdit}>
            Salvar Alterações
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}