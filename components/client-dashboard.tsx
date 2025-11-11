"use client"

import { useState, useEffect } from "react"
import { LogOut, Search, CarIcon as CartIcon, Home } from "lucide-react"
import SneakStreetLogo from "./sneakstreet-logo"
import ProductGrid from "./product-grid"
import CartPage from "./cart-page"
import type { Product } from "@/types/product"

interface ClientDashboardProps {
  userName: string
  onLogout: () => void
}

type View = "home" | "cart"

export default function ClientDashboard({ userName, onLogout }: ClientDashboardProps) {
  const [view, setView] = useState<View>("home")
  const [cart, setCart] = useState<Product[]>([])
  const [favorites, setFavorites] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Carregar carrinho e favoritos do localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    const savedFavorites = localStorage.getItem("favorites")
    if (savedCart) setCart(JSON.parse(savedCart))
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites))
  }, [])

  // Salvar carrinho
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  // Salvar favoritos
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites))
  }, [favorites])

  // Buscar produtos da API
  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch("/api/products", { cache: "no-store" })
        if (!res.ok) throw new Error(`Falha ao carregar produtos: ${res.status}`)
        const data = await res.json()

        const normalized: Product[] = data.map((p: any) => ({
          ...p,
          price: typeof p.price === "string" ? parseFloat(p.price) : p.price,
          originalPrice:
            p.originalPrice == null
              ? null
              : typeof p.originalPrice === "string"
                ? parseFloat(p.originalPrice)
                : p.originalPrice,
        }))

        setProducts(normalized)
        setFilteredProducts(normalized)
      } catch (e: any) {
        setError(e?.message || "Erro ao buscar produtos")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Filtro de busca
  useEffect(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) {
      setFilteredProducts(products)
      return
    }
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(term) ||
        product.brand.toLowerCase().includes(term)
    )
    setFilteredProducts(filtered)
  }, [searchTerm, products])

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.id === product.id)
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        )
      )
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
  }

  const toggleFavorite = (productId: number) => {
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter((id) => id !== productId))
    } else {
      setFavorites([...favorites, productId])
    }
  }

  const cartCount = cart.reduce((total, item) => total + (item.quantity || 1), 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView("home")}>
            <SneakStreetLogo size={40} />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              SneakStreet!
            </h1>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar tênis..."
                className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-4">
            {view === "cart" && (
              <button
                onClick={() => setView("home")}
                className="flex items-center gap-2 px-4 py-2 text-primary font-semibold hover:bg-primary/10 rounded-lg transition-smooth"
              >
                <Home className="w-5 h-5" />
                <span className="hidden sm:inline">Loja</span>
              </button>
            )}

            {view === "home" && (
              <button
                onClick={() => setView("cart")}
                className="relative p-2 hover:bg-primary/10 rounded-lg transition-smooth"
              >
                <CartIcon className="w-6 h-6 text-primary" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            <div className="flex items-center gap-3 pl-4 border-l border-border">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-foreground">{userName}</p>
                <p className="text-xs text-muted-foreground">Cliente</p>
              </div>
              <button
                onClick={onLogout}
                className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-smooth"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar tênis..."
              className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {view === "home" && (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">Bem-vindo, {userName}!</h2>
              <p className="text-muted-foreground">
                Explore nossa coleção exclusiva de sneakers das melhores marcas
              </p>
            </div>

            {loading ? (
              <p className="text-muted-foreground">Carregando produtos...</p>
            ) : error ? (
              <p className="text-destructive">Erro: {error}</p>
            ) : (
              <ProductGrid
                products={filteredProducts}
                favorites={favorites}
                onAddToCart={addToCart}
                onToggleFavorite={toggleFavorite}
              />
            )}
          </>
        )}

        {view === "cart" && (
          <CartPage
            cart={cart}
            onUpdateCart={setCart}
            onBackToShop={() => setView("home")}
          />
        )}
      </main>
    </div>
  )
}
