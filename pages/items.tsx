import Grid from '@/components/Grid'
import Layout from '@/components/Layout'
import { getSession } from 'next-auth/react'
import prisma from '@/lib/prisma'
import { Item } from '@prisma/client'
import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const data = await prisma.item.findMany({
    where: {
      owner: { email: session.user?.email },
    },
    orderBy: { createdAt: 'desc' },
  })

  const items = JSON.parse(JSON.stringify(data))

  return {
    props: {
      items,
    },
  }
}

type Props = {
  items: Item[]
}

const Items: React.FC<Props> = ({ items = [] }) => {
  return (
    <Layout>
      <h1 className='text-xl font-medium text-gray-800'>Your items</h1>
      <p className='text-gray-500'>Manage your items here</p>
      <div className='mt-8'>
        <Grid items={items} />
      </div>
    </Layout>
  )
}

export default Items
