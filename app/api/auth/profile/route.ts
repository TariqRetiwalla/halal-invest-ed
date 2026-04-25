import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/withAuth'

const patchSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(8),
})

export const PATCH = withAuth(async (req: NextRequest, { user }) => {
  try {
    const body = await req.json()
    const parsed = patchSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const { currentPassword, newPassword } = parsed.data

    const dbUser = await prisma.user.findUnique({
      where: { id: user.sub },
      select: { passwordHash: true },
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const passwordMatch = await bcrypt.compare(currentPassword, dbUser.passwordHash)

    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      )
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 12)

    await prisma.user.update({
      where: { id: user.sub },
      data: { passwordHash: newPasswordHash },
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') console.error('[PATCH /api/auth/profile]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
})
