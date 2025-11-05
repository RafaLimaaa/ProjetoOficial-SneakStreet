"use client"

import { useState } from "react"
import { Heart, ShoppingBag } from "lucide-react"
import ProductModal from "./product-modal"
import type { Product } from "@/types/product"

interface ProductGridProps {
  products: Product[]
  favorites: number[]
  onAddToCart: (product: Product) => void
  onToggleFavorite: (productId: number) => void
}

export default function ProductGrid({ products, favorites, onAddToCart, onToggleFavorite }: ProductGridProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
        <p className="text-lg text-muted-foreground">Nenhum tênis encontrado</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-smooth hover:shadow-lg"
          >
            {/* Imagem */}
            <div
              className="relative w-full h-64 bg-gradient-to-br from-muted to-muted/50 cursor-pointer overflow-hidden"
              onClick={() => setSelectedProduct(product)}
            >
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />

              {/* Badge de desconto */}
              {product.discount && (
                <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold">
                  -{product.discount}%
                </div>
              )}

              {/* Favorite button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleFavorite(product.id)
                }}
                className="absolute top-3 left-3 p-2 bg-card/80 backdrop-blur-sm rounded-full hover:bg-card transition-smooth"
              >
                <Heart
                  className={`w-5 h-5 transition-colors ${
                    favorites.includes(product.id) ? "fill-primary text-primary" : "text-foreground/50"
                  }`}
                />
              </button>
            </div>

            {/* Conteúdo */}
            <div className="p-4">
              <p className="text-xs font-semibold text-primary mb-1 uppercase tracking-wider">{product.brand}</p>
              <h3 className="font-bold text-foreground mb-2 line-clamp-2">{product.name}</h3>

              {/* Especificações rápidas */}
              <div className="flex gap-2 mb-3 flex-wrap">
                {product.colors.slice(0, 3).map((color, idx) => (
                  <div
                    key={idx}
                    className="w-5 h-5 rounded-full border border-border"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>

              {/* Preço */}
              <div className="mb-4">
                {product.originalPrice && (
                  <p className="text-sm text-muted-foreground line-through">R$ {product.originalPrice.toFixed(2)}</p>
                )}
                <p className="text-2xl font-bold text-primary">R$ {product.price.toFixed(2)}</p>
              </div>

              {/* Botões de ação */}
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedProduct(product)}
                  className="flex-1 py-2 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-secondary/80 transition-smooth active:scale-95"
                >
                  Ver Detalhes
                </button>
                <button
                  onClick={() => onAddToCart(product)}
                  className="flex-1 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:shadow-lg hover:glow-red transition-smooth active:scale-95 flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span className="hidden sm:inline">Carrinho</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Detalhes */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={onAddToCart}
          isFavorite={favorites.includes(selectedProduct.id)}
          onToggleFavorite={onToggleFavorite}
        />
      )}
    </>
  )
}
