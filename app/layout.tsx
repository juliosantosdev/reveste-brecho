import { Analytics } from "@vercel/analytics/next"
import type { Metadata, Viewport } from "next"
import { Nunito, Fraunces } from "next/font/google"
import Providers from "./providers"
import "./globals.css"

const fontBody = Nunito({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
})

const fontDisplay = Fraunces({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-display",
  display: "swap",
})

export const metadata: Metadata = {
  title: "ReVeste — Brechó Colaborativo de Moda Circular",
  description:
    "E-commerce colaborativo de brechó sustentável. Compre, converse e desapegue peças de segunda mão dando uma nova vida à moda circular.",
  generator: "v0.app",
}

export const viewport: Viewport = {
  themeColor: "#2e5e3a",
  colorScheme: "light",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${fontBody.variable} ${fontDisplay.variable}`}>
      <body>
        <Providers>{children}</Providers>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
