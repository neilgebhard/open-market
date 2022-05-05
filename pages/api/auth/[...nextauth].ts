import NextAuth from 'next-auth'
import EmailProvider from 'next-auth/providers/email'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import Handlebars from 'handlebars'
import nodemailer from 'nodemailer'
import { readFileSync } from 'fs'
import path from 'path'
import prisma from '@/lib/prisma'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: process.env.EMAIL_SERVER_PORT,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
  secure: true,
})

const emailsDir = path.resolve(process.cwd(), 'emails')

const sendVerificationRequest = ({
  identifier,
  url,
}: {
  identifier: string
  url: string
}) => {
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

const sendWelcomeEmail = ({ user }) => {
  const { email } = user

  const emailFile = readFileSync(path.join(emailsDir, 'welcome.html'), {
    encoding: 'utf8',
  })

  const emailTemplate = Handlebars.compile(emailFile)

  transporter.sendMail({
    from: `OpenMarket ${process.env.EMAIL_FROM}`,
    to: email,
    subject: 'Welcome to OpenMarket! 🎉',
    html: emailTemplate({
      base_url: process.env.NEXTAUTH_URL,
      support_email: 'openmarketsoftware@gmail.com',
    }),
  })
}

export default NextAuth({
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
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.sub
      }
      return session
    },
  },
  session: {
    strategy: 'jwt',
  },
  events: { createUser: sendWelcomeEmail },
  adapter: PrismaAdapter(prisma),
})
