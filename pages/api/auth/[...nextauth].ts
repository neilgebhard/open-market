import NextAuth from 'next-auth'
import EmailProvider from 'next-auth/providers/email'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import Handlebars from 'handlebars'
import nodemailer from 'nodemailer'
import { readFileSync } from 'fs'
import path from 'path'
import prisma from '@/lib/prisma'
import { NextApiHandler } from 'next'

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options)
export default authHandler

const options = {
  pages: {
    signIn: '/',
    signOut: '/',
    error: '/',
    verifyRequest: '/',
  },
  providers: [
    EmailProvider({
      maxAge: 10 * 60,
      sendVerificationRequest,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  events: { createUser: sendWelcomeEmail },
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async session({ session, user }: { session: any; user: any }) {
      session.user.id = user.id
      return session
    },
  },
}

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT) || 0,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
  secure: true,
})

const emailsDir = path.resolve(process.cwd(), 'emails')

function sendVerificationRequest({
  identifier,
  url,
}: {
  identifier: string
  url: string
}) {
  const emailFile = readFileSync(path.join(emailsDir, 'confirm-email.html'), {
    encoding: 'utf8',
  })

  const emailTemplate = Handlebars.compile(emailFile)

  transporter.sendMail({
    from: `OpenMarket ${process.env.EMAIL_FROM}`,
    to: identifier,
    subject: 'Your sign-in link for OpenMarket',
    html: emailTemplate({
      base_url: process.env.NEXTAUTH_URL,
      signin_url: url,
      email: identifier,
    }),
  })
}

function sendWelcomeEmail(message: any) {
  const { email } = message.user

  const emailFile = readFileSync(path.join(emailsDir, 'welcome.html'), {
    encoding: 'utf8',
  })

  const emailTemplate = Handlebars.compile(emailFile)

  transporter.sendMail({
    from: `OpenMarket ${process.env.EMAIL_FROM}`,
    to: email!,
    subject: 'Welcome to OpenMarket! 🎉',
    html: emailTemplate({
      base_url: process.env.NEXTAUTH_URL,
      support_email: 'openmarketsoftware@gmail.com',
    }),
  })
}
