import { Geist_Mono, Mulish, Playfair_Display } from "next/font/google"

import "./globals.css"

import { Navbar } from "@/components/navbar"
import Providers from "@/components/providers"
import { cn } from "@/lib/utils"

const mulish = Mulish({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const fontFancy = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-fancy",
  style: ["normal", "italic"],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        mulish.variable,
        "font-sans",
        fontFancy.variable
      )}
    >
      <body>
        <Navbar />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
