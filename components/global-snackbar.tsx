"use client"

import Alert from "@mui/material/Alert"
import Snackbar from "@mui/material/Snackbar"
import { useStore } from "@/lib/store"

export function GlobalSnackbar() {
  const { snackbar, clearSnackbar } = useStore()

  return (
    <Snackbar
      open={!!snackbar}
      autoHideDuration={4000}
      onClose={clearSnackbar}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      {snackbar ? (
        <Alert
          onClose={clearSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      ) : undefined}
    </Snackbar>
  )
}
