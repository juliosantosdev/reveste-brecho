"use client";

import { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Tooltip from "@mui/material/Tooltip";
import { Stack } from "@/components/flex";
import { CATEGORIES, type Category } from "@/lib/types";
import { useStore, type ViewMode } from "@/lib/store";
import { supabase } from "@/lib/supabase";

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

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const categories: (Category | "Todas")[] = ["Todas", ...CATEGORIES];

  useEffect(() => {
    const checkSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
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

  const handleViewChange = (_: React.MouseEvent<HTMLElement>, newView: ViewMode | null) => {
    if (!newView || newView === view) return;

    if (newView === "vendedor") {
      if (isAuthenticated) {
        setView("vendedor");
      } else {
        setLoginError(null);
        setEmail("");
        setPassword("");
        setIsLoginOpen(true);
      }
    } else {
      setView("cliente");
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoginError(error.message);
    } else if (data.user) {
      setIsAuthenticated(true);
      setIsLoginOpen(false);
      setEmail("");
      setPassword("");
      setView("vendedor");
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setView("cliente");
  };

  return (
    <>
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
        <Toolbar sx={{ flexDirection: "column", alignItems: "stretch", gap: 1.25, py: 1.25 }}>
          {/* Linha Superior: Logo, Nome, Botões Comprador/Brechó e Logout alinhados */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ width: "100%" }}
          >
            {/* Esquerda: Logo + Título */}
            <Stack direction="row" alignItems="center" spacing={1}>
              <Box
                component="img"
                src="/logo-brecho.png"
                alt="Logo ReVeste"
                sx={{ width: { xs: 40, sm: 48 }, height: { xs: 40, sm: 48 }, objectFit: "contain" }}
              />
              <Box>
                <Typography
                  variant="h6"
                  component="p"
                  sx={{ lineHeight: 1.1, fontWeight: 800, fontSize: { xs: "1.05rem", sm: "1.2rem" } }}
                >
                  ReVeste
                </Typography>
               
              </Box>
            </Stack>

            {/* Direita: Botões Comprador/Brechó + Logout compactos */}
            <Stack direction="row" alignItems="center" spacing={0.75}>
              <ToggleButtonGroup
                value={view}
                exclusive
                size="small"
                color="primary"
                onChange={handleViewChange}
                aria-label="Alternar visão da aplicação"
              >
                <ToggleButton
                  value="cliente"
                  aria-label="Visão do cliente"
                  sx={{ px: { xs: 1, sm: 1.25 }, py: 0.4, fontSize: "0.74rem" }}
                >
                  <ShoppingBagIcon fontSize="small" sx={{ mr: 0.3 }} aria-hidden />
                  Comprador
                </ToggleButton>
                <ToggleButton
                  value="vendedor"
                  aria-label="Visão do vendedor"
                  sx={{ px: { xs: 1, sm: 1.25 }, py: 0.4, fontSize: "0.74rem" }}
                >
                  <StorefrontIcon fontSize="small" sx={{ mr: 0.3 }} aria-hidden />
                  Brechó
                </ToggleButton>
              </ToggleButtonGroup>

              {view === "vendedor" && isAuthenticated && (
                <Tooltip title="Sair do painel administrativo">
                  <IconButton
                    size="small"
                    color="default"
                    onClick={handleLogout}
                    aria-label="Encerrar sessão do brechó"
                    sx={{ border: "1px solid", borderColor: "divider", p: 0.5 }}
                  >
                    <LogoutIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          </Stack>

          {/* Barra de Busca logo abaixo */}
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

        {/* Abas de categoria minimalistas */}
        {view === "cliente" && (
          <Box
            component="nav"
            aria-label="Filtro de categorias"
            sx={{
              px: { xs: 2, sm: 3 },
              display: "flex",
              gap: { xs: 2.5, sm: 3.5 },
              overflowX: "auto",
              "&::-webkit-scrollbar": { display: "none" },
              scrollbarWidth: "none",
            }}
          >
            {categories.map((c) => {
              const active = category === c;
              return (
                <Box
                  key={c}
                  component="button"
                  type="button"
                  onClick={() => onCategory(c)}
                  aria-pressed={active}
                  sx={{
                    position: "relative",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    py: 1,
                    px: 0.25,
                    whiteSpace: "nowrap",
                    fontFamily: "inherit",
                    fontSize: "0.85rem",
                    fontWeight: active ? 800 : 500,
                    color: active ? "text.primary" : "text.secondary",
                    transition: "color 150ms ease",
                    "&:hover": { color: "text.primary" },
                  }}
                >
                  {c}
                  {active && (
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 2.5,
                        borderRadius: 2,
                        bgcolor: "primary.main",
                      }}
                    />
                  )}
                </Box>
              );
            })}
          </Box>
        )}
      </AppBar>

      <Dialog
        open={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        maxWidth="xs"
        fullWidth
        aria-labelledby="login-dialog-title"
      >
        <Box component="form" onSubmit={handleLoginSubmit} noValidate>
          <DialogTitle id="login-dialog-title" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LockOutlinedIcon color="primary" />
            Acesso Restrito ao Brechó
          </DialogTitle>

          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Insira as credenciais do brechó para acessar o painel de pedidos e gestão de estoque.
            </Typography>

            {loginError && (
              <Alert severity="error" variant="outlined" sx={{ py: 0.5 }}>
                {loginError}
              </Alert>
            )}

            <TextField
              autoFocus
              label="E-mail"
              type="email"
              fullWidth
              size="small"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@reveste.com"
              required
            />

            <TextField
              label="Senha"
              type="password"
              fullWidth
              size="small"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button onClick={() => setIsLoginOpen(false)} color="inherit">
              Cancelar
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}