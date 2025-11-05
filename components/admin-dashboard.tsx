"use client"

import { useState } from "react"
import { LogOut, Plus, Edit2, Trash2, Package } from "lucide-react"
import SneakStreetLogo from "./sneakstreet-logo"
import AdminProductForm from "./admin-product-form"
import type { Product } from "@/types/product"
import { DEFAULT_PRODUCTS } from "@/data/products"

interface AdminDashboardProps {
  userName: string
  onLogout: () => void
}

export default function AdminDashboard({ userName, onLogout }: AdminDashboardProps) {
  const [products, setProducts] = useState(DEFAULT_PRODUCTS)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddProduct = (product: Omit<Product, "id">) => {
    const newProduct: Product = {
      ...product,
      id: Math.max(...products.map((p) => p.id), 0) + 1,
    }
    setProducts([...products, newProduct])
    setIsAddingNew(false)
  }

  const handleUpdateProduct = (product: Product) => {
    setProducts(products.map((p) => (p.id === product.id ? product : p)))
    setEditingProduct(null)
  }

  const handleDeleteProduct = (productId: number) => {
    if (confirm("Tem certeza que deseja deletar este produto?")) {
      setProducts(products.filter((p) => p.id !== productId))
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SneakStreetLogo size={40} />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              SneakStreet! Admin
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-foreground">{userName}</p>
              <p className="text-xs text-muted-foreground">Administrador</p>
            </div>
            <button
              onClick={onLogout}
              className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-smooth"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Gerenciamento de Produtos</h2>
            <p className="text-muted-foreground">
              Total de produtos: <span className="font-bold text-primary">{products.length}</span>
            </p>
          </div>

          <button
            onClick={() => {
              setIsAddingNew(true)
              setEditingProduct(null)
            }}
            className="flex items-center gap-2 px-4 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:shadow-lg hover:glow-red transition-smooth"
          >
            <Plus className="w-5 h-5" />
            Novo Produto
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome ou marca..."
            className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
          />
        </div>

        {/* Formulário */}
        {(isAddingNew || editingProduct) && (
          <AdminProductForm
            product={editingProduct}
            onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
            onCancel={() => {
              setIsAddingNew(false)
              setEditingProduct(null)
            }}
          />
        )}

        {/* Tabela de Produtos */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Imagem</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Produto</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Marca</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">Preço</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-foreground">Estoque</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-border hover:bg-muted/30 transition-smooth">
                    <td className="px-6 py-4">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-foreground">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.model}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-primary">{product.brand}</td>
                    <td className="px-6 py-4 text-right">
                      <p className="font-bold text-foreground">R$ {product.price.toFixed(2)}</p>
                      {product.originalPrice && (
                        <p className="text-xs text-muted-foreground line-through">
                          R$ {product.originalPrice.toFixed(2)}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <Package className="w-4 h-4 text-muted-foreground mr-2" />
                        <span
                          className={`font-bold ${
                            product.stock > 10
                              ? "text-green-600"
                              : product.stock > 0
                                ? "text-yellow-600"
                                : "text-red-600"
                          }`}
                        >
                          {product.stock}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="p-2 hover:bg-accent/20 text-accent rounded-lg transition-smooth"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 hover:bg-destructive/20 text-destructive rounded-lg transition-smooth"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 mx-auto text-muted-foreground mb-3 opacity-50" />
              <p className="text-muted-foreground">Nenhum produto encontrado</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
