// app/api/products/[id]/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

type Ctx = {
  params: { id: string }
}

// PUT /api/products/:id
export async function PUT(req: Request, { params }: Ctx) {
  const id = Number(params.id)
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 })
  }

  const body = await req.json()

  const updated = await prisma.product.update({
    where: { id },
    data: {
      name: body.name,
      brand: body.brand,
      model: body.model,
      type: body.type,
      material: body.material,
      description: body.description,
      price: body.price,
      originalPrice: body.originalPrice ?? null,
      stock: body.stock,
      sizes: body.sizes ?? [],
      colors: body.colors ?? [],
      image: body.image,
      discount: body.discount ?? null,
    },
  })

  return NextResponse.json(updated)
}

// DELETE /api/products/:id
export async function DELETE(_req: Request, { params }: Ctx) {
  const id = Number(params.id)
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 })
  }

  await prisma.product.delete({ where: { id } })

  return NextResponse.json({ ok: true })
}
