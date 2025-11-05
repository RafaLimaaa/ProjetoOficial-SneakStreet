"use client"

import { useState } from "react"
import { Trash2, Plus, Minus, Truck, CreditCard, Check } from "lucide-react"
import type { Product } from "@/types/product"

interface CartPageProps {
  cart: Product[]
  onUpdateCart: (cart: Product[]) => void
  onBackToShop: () => void
}

export default function CartPage({ cart, onUpdateCart, onBackToShop }: CartPageProps) {
  const [step, setStep] = useState<"cart" | "shipping" | "payment" | "confirm">("cart")
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express" | "urgent">("standard")
  const [address, setAddress] = useState("")
  const [cardDetails, setCardDetails] = useState({ number: "", name: "", exp: "", cvc: "" })

  const subtotal = cart.reduce((total, item) => total + item.price * (item.quantity || 1), 0)

  const shippingCosts = {
    standard: 15.9,
    express: 24.9,
    urgent: 49.9,
  }

  const shippingCost = shippingCosts[shippingMethod]
  const total = subtotal + shippingCost

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity === 0) {
      onUpdateCart(cart.filter((item) => item.id !== productId))
    } else {
      onUpdateCart(cart.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item)))
    }
  }

  const removeItem = (productId: number) => {
    onUpdateCart(cart.filter((item) => item.id !== productId))
  }

  if (cart.length === 0 && step === "cart") {
    return (
      <div className="text-center py-16">
        <Truck className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
        <p className="text-lg text-muted-foreground mb-6">Seu carrinho está vazio</p>
        <button
          onClick={onBackToShop}
          className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:shadow-lg transition-smooth"
        >
          Continuar Comprando
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progresso */}
      <div className="mb-8 flex items-center justify-between">
        {(["cart", "shipping", "payment", "confirm"] as const).map((s, idx) => (
          <div key={s} className="flex items-center flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-smooth ${
                step === s
                  ? "bg-primary text-primary-foreground"
                  : step > s
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {step > s ? <Check className="w-5 h-5" /> : idx + 1}
            </div>
            {idx < 3 && <div className={`flex-1 h-1 mx-2 transition-smooth ${step > s ? "bg-accent" : "bg-muted"}`} />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Conteúdo principal */}
        <div className="lg:col-span-2">
          {step === "cart" && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-6 text-foreground">Seu Carrinho</h2>

              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth"
                  >
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />

                    <div className="flex-1">
                      <h3 className="font-bold text-foreground">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.brand}</p>
                      <p className="font-semibold text-primary mt-1">R$ {item.price.toFixed(2)}</p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                          className="p-1 hover:bg-muted rounded transition-smooth"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-semibold">{item.quantity || 1}</span>
                        <button
                          onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                          className="p-1 hover:bg-muted rounded transition-smooth"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 hover:bg-destructive/10 text-destructive rounded transition-smooth"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setStep("shipping")}
                className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:shadow-lg transition-smooth"
              >
                Continuar para Envio
              </button>
            </div>
          )}

          {step === "shipping" && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-6 text-foreground">Envio</h2>

              <div className="mb-6">
                <label className="block font-semibold text-foreground mb-3">Endereço de Entrega</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Rua, número, complemento, cidade, estado, CEP"
                  className="w-full p-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={4}
                />
              </div>

              <div className="mb-6">
                <label className="block font-semibold text-foreground mb-3">Método de Envio</label>
                <div className="space-y-3">
                  {(
                    [
                      { id: "standard", label: "Padrão", days: "7-10 dias", cost: 15.9 },
                      { id: "express", label: "Express", days: "3-5 dias", cost: 24.9 },
                      { id: "urgent", label: "Urgente", days: "1-2 dias", cost: 49.9 },
                    ] as const
                  ).map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-smooth ${
                        shippingMethod === method.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <input
                        type="radio"
                        value={method.id}
                        checked={shippingMethod === method.id}
                        onChange={(e) => setShippingMethod(e.target.value as "standard" | "express" | "urgent")}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{method.label}</p>
                        <p className="text-sm text-muted-foreground">{method.days}</p>
                      </div>
                      <p className="font-bold text-primary">R$ {method.cost.toFixed(2)}</p>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep("cart")}
                  className="flex-1 py-3 bg-muted hover:bg-muted/80 text-foreground font-bold rounded-lg transition-smooth"
                >
                  Voltar
                </button>
                <button
                  onClick={() => setStep("payment")}
                  disabled={!address.trim()}
                  className="flex-1 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
                >
                  Continuar para Pagamento
                </button>
              </div>
            </div>
          )}

          {step === "payment" && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-6 text-foreground">Pagamento</h2>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block font-semibold text-foreground mb-2">Número do Cartão</label>
                  <input
                    type="text"
                    value={cardDetails.number}
                    onChange={(e) =>
                      setCardDetails({
                        ...cardDetails,
                        number: e.target.value.replace(/\s/g, "").slice(0, 16),
                      })
                    }
                    placeholder="1234 5678 9012 3456"
                    className="w-full p-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    maxLength={19}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-foreground mb-2">Nome do Titular</label>
                  <input
                    type="text"
                    value={cardDetails.name}
                    onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                    placeholder="João Silva"
                    className="w-full p-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-foreground mb-2">Validade</label>
                    <input
                      type="text"
                      value={cardDetails.exp}
                      onChange={(e) => setCardDetails({ ...cardDetails, exp: e.target.value.slice(0, 5) })}
                      placeholder="MM/AA"
                      className="w-full p-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-foreground mb-2">CVC</label>
                    <input
                      type="text"
                      value={cardDetails.cvc}
                      onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value.slice(0, 3) })}
                      placeholder="123"
                      className="w-full p-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      maxLength={3}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep("shipping")}
                  className="flex-1 py-3 bg-muted hover:bg-muted/80 text-foreground font-bold rounded-lg transition-smooth"
                >
                  Voltar
                </button>
                <button
                  onClick={() => setStep("confirm")}
                  disabled={!cardDetails.number || !cardDetails.name || !cardDetails.exp || !cardDetails.cvc}
                  className="flex-1 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-smooth flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-5 h-5" />
                  Finalizar Compra
                </button>
              </div>
            </div>
          )}

          {step === "confirm" && (
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-accent" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Compra Confirmada!</h2>
              <p className="text-muted-foreground mb-6">
                Seu pedido foi processado com sucesso. Você receberá um email de confirmação em breve.
              </p>

              <div className="bg-muted/30 rounded-lg p-4 mb-6 text-left">
                <p className="font-semibold text-foreground mb-2">Número do Pedido:</p>
                <p className="text-lg text-primary font-mono">#{Math.random().toString().slice(2, 10)}</p>
              </div>

              <button
                onClick={onBackToShop}
                className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:shadow-lg transition-smooth"
              >
                Continuar Comprando
              </button>
            </div>
          )}
        </div>

        {/* Resumo */}
        <div className="bg-card border border-border rounded-xl p-6 h-fit">
          <h3 className="font-bold text-foreground mb-4 text-lg">Resumo do Pedido</h3>

          <div className="space-y-2 mb-4 pb-4 border-b border-border">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Subtotal:</span>
              <span>R$ {subtotal.toFixed(2)}</span>
            </div>
            {step !== "cart" && (
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Envio ({shippingMethod}):</span>
                <span>R$ {shippingCost.toFixed(2)}</span>
              </div>
            )}
          </div>

          <div className="flex justify-between mb-6">
            <span className="font-bold text-foreground">Total:</span>
            <span className="text-2xl font-bold text-primary">
              R$ {(step !== "cart" ? total : subtotal).toFixed(2)}
            </span>
          </div>

          <div className="text-xs text-muted-foreground">
            {cart.length} {cart.length === 1 ? "item" : "itens"} no carrinho
          </div>
        </div>
      </div>
    </div>
  )
}
