"use client";

import { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from "@mui/icons-material/Logout";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { Stack } from "@/components/flex";
import type { Category } from "@/lib/types";
import { useStore } from "@/lib/store";
import { supabase } from "@/lib/supabase";
import { asset } from "@/lib/asset";

interface HeaderProps {
  search: string;
  onSearch: (value: string) => void;
  category?: Category | "Todas";
  onCategory?: (value: Category | "Todas") => void;
  onBackToWelcome?: () => void;
}

export function Header({
  search,
  onSearch,
  onBackToWelcome,
}: HeaderProps) {
  const { view, setView } = useStore();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        if (view === "vendedor") {
          setView("cliente");
        }
      }
    };
    checkSession();
  }, [view, setView]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setView("cliente");
    onBackToWelcome?.();
  };

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
      <Toolbar
        sx={{
          flexDirection: "column",
          alignItems: "stretch",
          gap: 1.25,
          py: 1.25,
        }}
      >
        {/* Linha Superior: Logo + Título (e Logout apenas quando logado como Brechó) */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ width: "100%" }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            onClick={onBackToWelcome}
            sx={{
              cursor: onBackToWelcome ? "pointer" : "default",
              userSelect: "none",
            }}
          >
            <Box
              component="img"
              src={asset("/logo-brecho.png")}
              alt="Logo ReVeste"
              sx={{
                width: { xs: 40, sm: 48 },
                height: { xs: 40, sm: 48 },
                objectFit: "contain",
              }}
            />
            <Box>
              <Typography
                variant="h6"
                component="p"
                sx={{
                  lineHeight: 1.1,
                  fontWeight: 800,
                  fontSize: { xs: "1.05rem", sm: "1.2rem" },
                }}
              >
                ReVeste
              </Typography>
              {view === "cliente" && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: "0.68rem", display: "block" }}
                >
                  Moda circular colaborativa
                </Typography>
              )}
            </Box>
          </Stack>

          {view === "vendedor" && isAuthenticated && (
            <Tooltip title="Sair do painel do brechó">
              <IconButton
                size="small"
                color="default"
                onClick={handleLogout}
                aria-label="Encerrar sessão do brechó"
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  p: 0.75,
                }}
              >
                <LogoutIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Stack>

        {/* Barra de Busca */}
        <TextField
          size="small"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Buscar peças..."
          aria-label="Buscar peças no brechó"
          sx={{
            width: "100%",
            "& .MuiOutlinedInput-root": {
              borderRadius: 99,
              bgcolor: "background.default",
              height: 38,
              fontSize: "0.85rem",
            },
          }}
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
      </Toolbar>
    </AppBar>
  );
}