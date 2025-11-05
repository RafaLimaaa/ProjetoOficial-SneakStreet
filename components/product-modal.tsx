"use client"

import { useState } from "react"
import { X, Heart, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react"
import type { Product } from "@/types/product"

interface ProductModalProps {
  product: Product
  onClose: () => void
  onAddToCart: (product: Product) => void
  isFavorite: boolean
  onToggleFavorite: (productId: number) => void
}

export default function ProductModal({
  product,
  onClose,
  onAddToCart,
  isFavorite,
  onToggleFavorite,
}: ProductModalProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Por favor, selecione um tamanho!")
      return
    }
    onAddToCart(product)
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-in fade-in" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in slide-in-from-bottom-4">
        <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-muted rounded-lg transition-smooth z-10"
          >
            <X className="w-6 h-6 text-foreground" />
          </button>

          <div className="grid md:grid-cols-2 gap-6 p-6">
            {/* Imagem */}
            <div className="bg-gradient-to-br from-muted to-muted/50 rounded-xl h-80 flex items-center justify-center">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>

            {/* Detalhes */}
            <div className="flex flex-col justify-between">
              <div>
                <p className="text-sm font-semibold text-primary mb-1 uppercase">{product.brand}</p>
                <h2 className="text-3xl font-bold text-foreground mb-2">{product.name}</h2>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-lg ${i < 4 ? "text-yellow-400" : "text-muted-foreground"}`}>
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">(128 avaliações)</span>
                </div>

                {/* Especificações */}
                <div className="space-y-2 mb-6 pb-6 border-b border-border">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">Modelo:</span> {product.model}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">Tipo:</span> {product.type}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">Material:</span> {product.material}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">Descrição:</span> {product.description}
                  </p>
                </div>

                {/* Preço */}
                <div className="mb-6">
                  {product.originalPrice && (
                    <p className="text-sm text-muted-foreground line-through">R$ {product.originalPrice.toFixed(2)}</p>
                  )}
                  <p className="text-4xl font-bold text-primary">R$ {product.price.toFixed(2)}</p>
                </div>

                {/* Cores */}
                <div className="mb-6">
                  <p className="font-semibold text-foreground mb-3">Cores Disponíveis</p>
                  <div className="flex gap-3">
                    {product.colors.map((color, idx) => (
                      <button
                        key={idx}
                        className={`w-8 h-8 rounded-full border-2 transition-smooth ${
                          selectedColor === color ? "border-primary scale-110" : "border-border"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setSelectedColor(color)}
                      />
                    ))}
                  </div>
                </div>

                {/* Tamanhos */}
                <div className="mb-6">
                  <p className="font-semibold text-foreground mb-3">Tamanho</p>
                  <div className="grid grid-cols-4 gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-2 px-3 rounded-lg font-semibold transition-smooth ${
                          selectedSize === size
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted hover:bg-muted/80 text-foreground"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Botões de ação */}
              <div className="space-y-3 pt-6 border-t border-border">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-muted rounded-lg transition-smooth"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                    className="flex-1 text-center py-2 px-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    min="1"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-muted rounded-lg transition-smooth"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full py-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-bold rounded-lg hover:shadow-lg hover:glow-red transition-smooth active:scale-95 flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Adicionar ao Carrinho
                </button>

                <button
                  onClick={() => onToggleFavorite(product.id)}
                  className={`w-full py-3 font-bold rounded-lg transition-smooth active:scale-95 flex items-center justify-center gap-2 ${
                    isFavorite ? "bg-primary/20 text-primary" : "bg-muted hover:bg-muted/80 text-foreground"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
                  {isFavorite ? "Nos Favoritos" : "Adicionar aos Favoritos"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
