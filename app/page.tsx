"use client"

import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Divider from "@mui/material/Divider"
import Typography from "@mui/material/Typography"
import { useMemo, useState } from "react"
import { Header } from "@/components/header"
import { Banner } from "@/components/home/banner"
import { ProductGrid } from "@/components/home/product-grid"
import { ProductDetailDialog } from "@/components/product-detail-dialog"
import { SellerDashboard } from "@/components/admin/seller-dashboard"
import { ReviewsSection } from "@/components/community/reviews-section"
import { DesapegoCta } from "@/components/community/desapego-cta"
import { useStore } from "@/lib/store"
import type { Category, Product } from "@/lib/types"

export default function Page() {
  const { products, view } = useStore()
  
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<Category | "Todas">("Todas")
  const [selected, setSelected] = useState<Product | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  // Filtro seguro contra dados nulos
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()

    return (products || []).filter((p) => {
      const pCategory = (p.category || "").toLowerCase()
      const selectedCategory = category.toLowerCase()

      const matchCategory =
        category === "Todas" ||
        pCategory === selectedCategory ||
        (selectedCategory === "roupas" && (pCategory === "camisas" || pCategory === "casacos"))

      const pName = (p.name || "").toLowerCase()
      const matchSearch =
        !term ||
        pName.includes(term) ||
        pCategory.includes(term)

      return matchCategory && matchSearch
    })
  }, [products, search, category])

  const openProduct = (p: Product) => {
    setSelected(p)
    setDialogOpen(true)
  }

  const liveSelected = useMemo(
    () => (selected ? products.find((p) => p.id === selected.id) ?? selected : null),
    [selected, products],
  )

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <Header
        search={search}
        onSearch={setSearch}
        category={category}
        onCategory={setCategory}
      />

      <Container maxWidth="lg" component="main" sx={{ py: 4 }}>
        {view === "cliente" ? (
          <>
            <Banner />

            <Box component="section" aria-labelledby="catalog-title" sx={{ mb: 5 }}>
              <Typography id="catalog-title" variant="h4" component="h2" sx={{ mb: 0.5 }}>
                Vitrine de peças
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {filtered.length} peça{filtered.length === 1 ? "" : "s"} para dar um novo
                ciclo de vida.
              </Typography>
              <ProductGrid products={filtered} onOpen={openProduct} />
            </Box>

            <Divider sx={{ my: 5 }} />

            <Box sx={{ mb: 5 }}>
              <DesapegoCta />
            </Box>

            <ReviewsSection />
          </>
        ) : (
          <SellerDashboard />
        )}
      </Container>

      <ProductDetailDialog
        product={liveSelected}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </Box>
  )
}