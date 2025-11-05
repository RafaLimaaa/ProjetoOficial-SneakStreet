"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import type { Product } from "@/types/product"

interface AdminProductFormProps {
  product?: Product | null
  onSubmit: (product: Product | Omit<Product, "id">) => void
  onCancel: () => void
}

export default function AdminProductForm({ product, onSubmit, onCancel }: AdminProductFormProps) {
  const [formData, setFormData] = useState<Omit<Product, "id"> & { id?: number }>({
    name: "",
    brand: "Nike",
    model: "",
    type: "Casual",
    material: "Têxtil e Borracha",
    description: "",
    price: 0,
    originalPrice: undefined,
    stock: 0,
    sizes: ["34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"],
    colors: ["#000000", "#FFFFFF"],
    image: "/nike-sneaker.jpg",
    discount: undefined,
    quantity: undefined,
  })

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
      })
    }
  }, [product])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (product) {
      onSubmit({ ...formData, id: formData.id! } as Product)
    } else {
      onSubmit(formData)
    }
  }

  return (
    <div className="mb-8 bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-foreground">{product ? "Editar Produto" : "Novo Produto"}</h3>
        <button onClick={onCancel} className="p-2 hover:bg-muted rounded-lg transition-smooth">
          <X className="w-6 h-6 text-foreground" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Nome */}
          <div>
            <label className="block font-semibold text-foreground mb-2">Nome do Produto *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Air Jordan 1 Retro"
              className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Brand */}
          <div>
            <label className="block font-semibold text-foreground mb-2">Marca *</label>
            <select
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option>Nike</option>
              <option>Adidas</option>
              <option>Puma</option>
            </select>
          </div>

          {/* Modelo */}
          <div>
            <label className="block font-semibold text-foreground mb-2">Modelo</label>
            <input
              type="text"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              placeholder="Ex: High Top"
              className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Tipo */}
          <div>
            <label className="block font-semibold text-foreground mb-2">Tipo</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option>Casual</option>
              <option>Esportivo</option>
              <option>Running</option>
              <option>Basquete</option>
              <option>Skateboard</option>
            </select>
          </div>

          {/* Preço */}
          <div>
            <label className="block font-semibold text-foreground mb-2">Preço (R$) *</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: Number.parseFloat(e.target.value) || 0,
                })
              }
              placeholder="0.00"
              step="0.01"
              className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Preço Original */}
          <div>
            <label className="block font-semibold text-foreground mb-2">Preço Original (R$) - Opcional</label>
            <input
              type="number"
              value={formData.originalPrice || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  originalPrice: e.target.value ? Number.parseFloat(e.target.value) : undefined,
                })
              }
              placeholder="0.00"
              step="0.01"
              className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Estoque */}
          <div>
            <label className="block font-semibold text-foreground mb-2">Quantidade em Estoque *</label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  stock: Number.parseInt(e.target.value) || 0,
                })
              }
              placeholder="0"
              className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Material */}
          <div>
            <label className="block font-semibold text-foreground mb-2">Material</label>
            <input
              type="text"
              value={formData.material}
              onChange={(e) => setFormData({ ...formData, material: e.target.value })}
              placeholder="Ex: Couro"
              className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Desconto */}
          <div>
            <label className="block font-semibold text-foreground mb-2">Desconto (%) - Opcional</label>
            <input
              type="number"
              value={formData.discount || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  discount: e.target.value ? Number.parseInt(e.target.value) : undefined,
                })
              }
              placeholder="0"
              max="100"
              className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Descrição */}
        <div>
          <label className="block font-semibold text-foreground mb-2">Descrição</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Descreva o produto..."
            rows={4}
            className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* URL da Imagem */}
        <div>
          <label className="block font-semibold text-foreground mb-2">URL da Imagem</label>
          <input
            type="url"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            placeholder="https://..."
            className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {formData.image && (
            <div className="mt-2 w-20 h-20 rounded-lg overflow-hidden border border-border">
              <img
                src={formData.image || "/placeholder.svg"}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/diverse-products-still-life.png"
                }}
              />
            </div>
          )}
        </div>

        {/* Botões */}
        <div className="flex gap-3 pt-6 border-t border-border">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 bg-muted hover:bg-muted/80 text-foreground font-bold rounded-lg transition-smooth"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:shadow-lg hover:glow-red transition-smooth"
          >
            {product ? "Atualizar Produto" : "Criar Produto"}
          </button>
        </div>
      </form>
    </div>
  )
}
