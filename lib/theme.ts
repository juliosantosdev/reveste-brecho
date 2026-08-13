"use client"

import { createTheme } from "@mui/material/styles"

/**
 * Tema com foco em acessibilidade (WCAG 2.1): alto contraste,
 * tipografia legível e paleta terrosa coerente com moda circular.
 */
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2e5e3a", // verde folha escuro (contraste AA sobre branco)
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#a9541e", // terracota para acentos
      contrastText: "#ffffff",
    },
    success: { main: "#2e7d32" },
    warning: { main: "#b26a00" },
    info: { main: "#1565c0" },
    error: { main: "#c62828" },
    background: {
      default: "#f6f4ee",
      paper: "#ffffff",
    },
    text: {
      primary: "#1c2419",
      secondary: "#455041",
    },
  },
  typography: {
    fontFamily:
      "var(--font-body), system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
    h1: { fontFamily: "var(--font-display)", fontWeight: 700 },
    h2: { fontFamily: "var(--font-display)", fontWeight: 700 },
    h3: { fontFamily: "var(--font-display)", fontWeight: 700 },
    h4: { fontFamily: "var(--font-display)", fontWeight: 700 },
    h5: { fontFamily: "var(--font-display)", fontWeight: 600 },
    h6: { fontFamily: "var(--font-display)", fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
    body1: { fontSize: "1rem", lineHeight: 1.6 },
    body2: { fontSize: "0.9rem", lineHeight: 1.55 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { borderRadius: 999, paddingInline: 20 } },
    },
    MuiCard: {
      styleOverrides: {
        root: { border: "1px solid rgba(28,36,25,0.08)" },
      },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 600 } },
    },
  },
})

export default theme
