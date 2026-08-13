"use client";

import RecyclingIcon from "@mui/icons-material/Recycling";
import SearchIcon from "@mui/icons-material/Search";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import InputAdornment from "@mui/material/InputAdornment";
import { Stack } from "@/components/flex";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { CATEGORIES, type Category } from "@/lib/types";
import { useStore, type ViewMode } from "@/lib/store";

interface HeaderProps {
  search: string;
  onSearch: (value: string) => void;
  category: Category | "Todas";
  onCategory: (value: Category | "Todas") => void;
}

export function Header({
  search,
  onSearch,
  category,
  onCategory,
}: HeaderProps) {
  const { view, setView } = useStore();

  const categories: (Category | "Todas")[] = ["Todas", ...CATEGORIES];

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      sx={{
        bgcolor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Toolbar sx={{ flexWrap: "wrap", gap: 2, py: 1.5 }}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ mr: "auto" }}
        >
          <RecyclingIcon color="primary" sx={{ fontSize: 32 }} aria-hidden />
          <Box>
            <Typography variant="h6" component="p" sx={{ lineHeight: 1 }}>
              ReVeste
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Moda circular colaborativa
            </Typography>
          </Box>
        </Stack>

        <TextField
          size="small"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Buscar peças..."
          aria-label="Buscar peças no brechó"
          sx={{ flex: "1 1 240px", maxWidth: 380 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" aria-hidden />
                </InputAdornment>
              ),
            },
          }}
        />

        <ToggleButtonGroup
          value={view}
          exclusive
          size="small"
          color="primary"
          onChange={(_, newView: ViewMode | null) => {
            // Se o usuário clicar no botão ativo, newView vem null.
            // Garantimos que o estado só altere se houver um valor real ("cliente" ou "vendedor").
            if (newView && newView !== view) {
              setView(newView);
            }
          }}
          aria-label="Alternar visão da aplicação"
        >
          <ToggleButton value="cliente" aria-label="Visão do cliente">
            <ShoppingBagIcon fontSize="small" sx={{ mr: 0.5 }} aria-hidden />
            Comprador
          </ToggleButton>
          <ToggleButton value="vendedor" aria-label="Visão do vendedor">
            <StorefrontIcon fontSize="small" sx={{ mr: 0.5 }} aria-hidden />
            Brechó
          </ToggleButton>
        </ToggleButtonGroup>
      </Toolbar>

      {view === "cliente" && (
        <Box
          component="nav"
          aria-label="Filtro de categorias"
          sx={{
            px: 2,
            pb: 1.5,
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            borderTop: "1px solid",
            borderColor: "divider",
            pt: 1.5,
          }}
        >
          {categories.map((c) => (
            <Chip
              key={c}
              label={c}
              onClick={() => onCategory(c)}
              color={category === c ? "primary" : "default"}
              variant={category === c ? "filled" : "outlined"}
              aria-pressed={category === c}
              clickable
            />
          ))}
        </Box>
      )}
    </AppBar>
  );
}
