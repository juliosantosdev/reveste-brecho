"use client"

import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Divider from "@mui/material/Divider"
import Typography from "@mui/material/Typography"
import { useEffect, useMemo, useState } from "react"
import { Header } from "@/components/header"
import { Banner } from "@/components/home/banner"
import { ShopByCategory } from "@/components/home/shop-by-category"
import { ProductGrid } from "@/components/home/product-grid"
import { ProductDetailDialog } from "@/components/product-detail-dialog"
import { SellerDashboard } from "@/components/admin/seller-dashboard"
import { ReviewsSection } from "@/components/community/reviews-section"
import { DesapegoCta } from "@/components/community/desapego-cta"
import { WelcomeScreen } from "@/components/welcome-screen"
import {
  MobileBottomNav,
  type ClientTab,
  type VendorTab,
} from "@/components/mobile-bottom-nav"
import { Stack } from "@/components/flex"
import { useStore } from "@/lib/store"
import { supabase } from "@/lib/supabase"
import type { Category, Product } from "@/lib/types"

export default function Page() {
  const { products, view, setView } = useStore()

  const [hasEntered, setHasEntered] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)

  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<Category | "Todas">("Todas")
  const [activeCircle, setActiveCircle] = useState<string>("Todas")
  const [selected, setSelected] = useState<Product | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const [clientTab, setClientTab] = useState<ClientTab>("vitrine")
  const [vendorTab, setVendorTab] = useState<VendorTab>("vitrine")

  useEffect(() => {
    const checkExistingSession = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setView("vendedor")
        setHasEntered(true)
      }
      setCheckingAuth(false)
    }
    checkExistingSession()
  }, [setView])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()

    return (products || []).filter((p) => {
      const pCategory = (p.category || "").toLowerCase()
      const selectedCategory = category.toLowerCase()

      const matchCategory =
        category === "Todas" ||
        pCategory === selectedCategory ||
        (selectedCategory === "roupas" &&
          (pCategory === "camisas" || pCategory === "casacos"))

      const pName = (p.name || "").toLowerCase()
      const matchSearch =
        !term || pName.includes(term) || pCategory.includes(term)

      return matchCategory && matchSearch
    })
  }, [products, search, category])

  const openProduct = (p: Product) => {
    setSelected(p)
    setDialogOpen(true)
  }

  const liveSelected = useMemo(
    () =>
      selected ? products.find((p) => p.id === selected.id) ?? selected : null,
    [selected, products]
  )

  if (checkingAuth) {
    return null
  }

  if (!hasEntered) {
    return (
      <WelcomeScreen
        onEnterClient={() => {
          setView("cliente")
          setHasEntered(true)
        }}
        onEnterVendor={() => {
          setView("vendedor")
          setHasEntered(true)
        }}
      />
    )
  }

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <Header
        search={search}
        onSearch={setSearch}
        category={category}
        onCategory={(cat) => {
          setCategory(cat)
          setActiveCircle(cat)
          setClientTab("vitrine")
        }}
        onBackToWelcome={() => setHasEntered(false)}
      />

      <Container
        maxWidth="lg"
        component="main"
        sx={{
          pt: { xs: 2, md: 3.5 },
          pb: { xs: 11, md: 4 },
        }}
      >
        {view === "cliente" ? (
          <>
            <Box
              sx={{
                display: {
                  xs: clientTab === "vitrine" ? "block" : "none",
                  md: "block",
                },
              }}
            >
              <Banner products={products} onOpen={openProduct} />

              <ShopByCategory
                selectedCategory={activeCircle}
                onSelectCategory={(filterValue, label) => {
                  setActiveCircle(label)
                  setCategory(filterValue as Category | "Todas")
                  setClientTab("vitrine")
                }}
              />

              <Box
                component="section"
                aria-labelledby="catalog-title"
                sx={{ mt: { xs: 3, md: 5 }, mb: { xs: 2, md: 5 } }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="baseline"
                  sx={{ mb: 2 }}
                >
                  <Typography
                    id="catalog-title"
                    variant="h5"
                    component="h2"
                    sx={{
                      fontWeight: 800,
                      fontSize: { xs: "1.2rem", md: "1.5rem" },
                    }}
                  >
                    Vitrine de peças
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    {filtered.length}{" "}
                    {filtered.length === 1 ? "peça" : "peças"}
                  </Typography>
                </Stack>

                <ProductGrid products={filtered} onOpen={openProduct} />
              </Box>
            </Box>

            <Divider sx={{ my: 5, display: { xs: "none", md: "block" } }} />

            <Box
              sx={{
                mb: { xs: 2, md: 5 },
                display: {
                  xs: clientTab === "desapegar" ? "block" : "none",
                  md: "block",
                },
              }}
            >
              <DesapegoCta />
            </Box>

            <Box
              sx={{
                display: {
                  xs: clientTab === "reputacao" ? "block" : "none",
                  md: "block",
                },
              }}
            >
              <ReviewsSection />
            </Box>
          </>
        ) : (
          <SellerDashboard mobileTab={vendorTab} />
        )}
      </Container>

      <MobileBottomNav
        clientTab={clientTab}
        onClientTabChange={setClientTab}
        vendorTab={vendorTab}
        onVendorTabChange={setVendorTab}
      />

      <ProductDetailDialog
        product={liveSelected}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </Box>
  )
}