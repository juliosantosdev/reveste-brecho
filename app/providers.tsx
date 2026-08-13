"use client"

import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter"
import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"
import type { ReactNode } from "react"
import { StoreProvider } from "@/lib/store"
import theme from "@/lib/theme"
import { GlobalSnackbar } from "@/components/global-snackbar"

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AppRouterCacheProvider options={{ key: "mui" }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <StoreProvider>
          {children}
          <GlobalSnackbar />
        </StoreProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  )
}
