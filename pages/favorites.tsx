import { getSession } from 'next-auth/react'
import Layout from '@/components/Layout'
import Grid from '@/components/Grid'
import prisma from '@/lib/prisma'
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

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { favoriteItems: true },
  })
  return {
    props: { items: JSON.parse(JSON.stringify(user.favoriteItems)) },
  }
}

const Favorites = ({ items = [] }) => {
  return (
    <Layout>
      <h1 className='text-xl font-medium text-gray-800'>Your listings</h1>
      <p className='text-gray-500'>
        Manage your homes and update your listings
      </p>
      <div className='mt-8'>
        <Grid items={items} />
      </div>
    </Layout>
  )
}

export default Favorites
