import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })
  if (!session) return res.status(401).json({ message: 'Not logged in.' })

  const { id } = req.query

  if (req.method === 'PUT') {
  } else if (req.method === 'DELETE') {
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE'])
    res.status(405).json({ message: 'HTTP method not allowed.' })
  }
}
