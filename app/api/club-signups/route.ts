import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const postSchema = z.object({
  email: z.string().email(),
  name: z.string().max(100).optional(),
  role: z.enum(['TEACHER', 'PARENT', 'OTHER']),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = postSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const { email, name, role } = parsed.data

    await prisma.clubSignup.create({
      data: { email, name: name ?? null, role },
    })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') console.error('[POST /api/club-signups]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
