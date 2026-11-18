"use client";

import { useState } from "react";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import KeyIcon from "@mui/icons-material/Key";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Stack } from "@/components/flex";
import { supabase } from "@/lib/supabase";
import { asset } from "@/lib/asset";

interface WelcomeScreenProps {
  onEnterClient: () => void;
  onEnterVendor: () => void;
}

type GatewayStep = "select" | "access-code" | "login";

export function WelcomeScreen({
  onEnterClient,
  onEnterVendor,
}: WelcomeScreenProps) {
  const [step, setStep] = useState<GatewayStep>("select");
  const [codeInput, setCodeInput] = useState("");
  const [codeError, setCodeError] = useState<string | null>(null);
  const [verifyingCode, setVerifyingCode] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleBrechoClick = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      onEnterVendor();
      return;
    }

    setCodeInput("");
    setCodeError(null);
    setStep("access-code");
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeInput.trim()) return;

    setVerifyingCode(true);
    setCodeError(null);

    const { data: linkedEmail, error } = await supabase.rpc(
      "validar_codigo_brecho",
      { p_codigo: codeInput.trim() }
    );

    if (error || !linkedEmail) {
      setCodeError("Código de acesso inválido. Verifique com a gestão do brechó.");
    } else {
      setEmail(linkedEmail);
      setLoginError(null);
      setStep("login");
    }

    setVerifyingCode(false);
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
      setLoginError("Senha incorreta para a conta vinculada.");
    } else if (data.user) {
      onEnterVendor();
    }
    setLoading(false);
  };

  const resetToSelect = () => {
    setStep("select");
    setCodeInput("");
    setCodeError(null);
    setEmail("");
    setPassword("");
    setLoginError(null);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        p: 2,
        background:
          "linear-gradient(155deg, #122918 0%, #1f4528 52%, #142e1b 100%)",
      }}
    >
      {/* Padrão botânico cobrindo 100% da tela até os cantos */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: -2,
          backgroundImage: `url('${asset("/pattern-sustentavel.png")}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.18,
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      />

      <Paper
        elevation={0}
        sx={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: 420,
          borderRadius: 4,
          p: { xs: 3, sm: 4 },
          bgcolor: "rgba(251, 249, 245, 0.96)",
          backdropFilter: "blur(14px)",
          border: "1px solid rgba(255, 255, 255, 0.55)",
          boxShadow: `
            0 24px 48px rgba(4, 12, 6, 0.55),
            inset 0 1px 2px rgba(255, 255, 255, 0.9)
          `,
        }}
      >
        <Stack alignItems="center" spacing={1} sx={{ textAlign: "center", mb: 3.5 }}>
          <Box
            component="img"
            src={asset("/logo-brecho.png")}
            alt="Logo ReVeste"
            sx={{ width: 68, height: 68, objectFit: "contain", mb: 0.5 }}
          />
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: 900, letterSpacing: "-0.02em", color: "primary.main" }}
          >
            ReVeste
          </Typography>
          <Typography component="p" variant="body2" color="text.secondary">
            Moda circular colaborativa
          </Typography>
        </Stack>

        {step === "select" && (
          <Stack spacing={2}>
            <Typography
              component="p"
              variant="subtitle1"
              sx={{ fontWeight: 700, textAlign: "center", mb: 0.5 }}
            >
              Como você deseja acessar hoje?
            </Typography>

            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              onClick={onEnterClient}
              startIcon={<ShoppingBagIcon />}
              sx={{
                py: 1.75,
                borderRadius: 3,
                fontWeight: 800,
                fontSize: "1rem",
                textTransform: "none",
                boxShadow: "0 8px 20px rgba(27, 59, 36, 0.28)",
              }}
            >
              Entrar como Cliente
            </Button>

            <Button
              fullWidth
              variant="outlined"
              color="primary"
              size="large"
              onClick={handleBrechoClick}
              startIcon={<StorefrontIcon />}
              sx={{
                py: 1.5,
                borderRadius: 3,
                fontWeight: 700,
                fontSize: "0.95rem",
                textTransform: "none",
                borderWidth: 1.5,
                "&:hover": { borderWidth: 1.5 },
              }}
            >
              Administrador do Brechó
            </Button>
          </Stack>
        )}

        {step === "access-code" && (
          <Box component="form" onSubmit={handleVerifyCode} noValidate>
            <Stack spacing={2}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <KeyIcon color="primary" fontSize="small" />
                <Typography component="span" variant="subtitle1" sx={{ fontWeight: 800 }}>
                  Código de Verificação
                </Typography>
              </Stack>

              <Typography
                component="p"
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 400 }}
              >
                Digite o código de acesso exclusivo da equipe para liberar a área de login do brechó.
              </Typography>

              {codeError && (
                <Alert severity="error" variant="outlined" sx={{ py: 0.5 }}>
                  {codeError}
                </Alert>
              )}

              <TextField
                autoFocus
                fullWidth
                size="small"
                label="Código de acesso"
                type="password"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                placeholder="••••••••"
                required
              />

              <Stack direction="row" spacing={1.5} sx={{ pt: 0.5 }}>
                <Button
                  type="button"
                  variant="text"
                  color="inherit"
                  startIcon={<ArrowBackIcon />}
                  onClick={resetToSelect}
                  sx={{ fontWeight: 600 }}
                >
                  Voltar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={verifyingCode}
                  sx={{ borderRadius: 2.5, fontWeight: 700 }}
                >
                  {verifyingCode ? "Verificando..." : "Verificar código"}
                </Button>
              </Stack>
            </Stack>
          </Box>
        )}

        {step === "login" && (
          <Box component="form" onSubmit={handleLoginSubmit} noValidate>
            <Stack spacing={2}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <LockOutlinedIcon color="primary" fontSize="small" />
                <Typography component="span" variant="subtitle1" sx={{ fontWeight: 800 }}>
                  Login Administrativo
                </Typography>
              </Stack>

              <Typography
                component="p"
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 400 }}
              >
                Código validado. Confirme a senha da conta vinculada para acessar o painel.
              </Typography>

              {loginError && (
                <Alert severity="error" variant="outlined" sx={{ py: 0.5 }}>
                  {loginError}
                </Alert>
              )}

              <TextField
                fullWidth
                size="small"
                label="E-mail vinculado"
                type="email"
                value={email}
                slotProps={{ input: { readOnly: true } }}
                required
              />

              <TextField
                autoFocus
                fullWidth
                size="small"
                label="Senha"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />

              <Stack direction="row" spacing={1.5} sx={{ pt: 0.5 }}>
                <Button
                  type="button"
                  variant="text"
                  color="inherit"
                  startIcon={<ArrowBackIcon />}
                  onClick={resetToSelect}
                  sx={{ fontWeight: 600 }}
                >
                  Voltar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={loading}
                  sx={{ borderRadius: 2.5, fontWeight: 700 }}
                >
                  {loading ? "Entrando..." : "Entrar no Painel"}
                </Button>
              </Stack>
            </Stack>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
```[cite: 25]

### Próximos passos

* Teste localmente com `pnpm run build` para confirmar que a verificação de tipos passa sem erros[cite: 24, 25].
* Faça *commit* e *push* para a *branch* `main`[cite: 23, 25]:

```bash
git add components/welcome-screen.tsx
git commit -m "fix(types): ajusta props component e fontWeight no Typography do WelcomeScreen"
git push origin main