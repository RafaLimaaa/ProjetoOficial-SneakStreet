export interface Product {
  id: number
  name: string
  brand: string
  model: string
  type: string
  material: string
  description: string
  price: number
  originalPrice?: number
  stock: number
  sizes: string[]
  colors: string[]
  image: string
  discount?: number
  quantity?: number
}
