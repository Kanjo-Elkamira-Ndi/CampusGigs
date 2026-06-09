import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { prisma } from './prisma'
import { env } from '../config/env'

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    autoSignIn: true,
  },

  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },

  user: {
    additionalFields: {
      fullName: {
        type: 'string',
        required: false,
        defaultValue: '',
      },
      role: {
        type: 'string',
        required: false,
        defaultValue: 'WORKER',
      },
      universityId: {
        type: 'string',
        required: false,
      },
      bio: {
        type: 'string',
        required: false,
      },
      avatarUrl: {
        type: 'string',
        required: false,
      },
      avgRating: {
        type: 'number',
        required: false,
        defaultValue: 0,
      },
      reviewCount: {
        type: 'number',
        required: false,
        defaultValue: 0,
      },
      isBanned: {
        type: 'boolean',
        required: false,
        defaultValue: false,
      },
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24,      // refresh if older than 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },

  trustedOrigins: [env.FRONTEND_URL, env.ADMIN_PANEL_URL],
})