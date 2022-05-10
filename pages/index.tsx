import React from 'react'
import Head from 'next/head'
import Layout from '@/components/Layout'
import Grid from '@/components/Grid'
import prisma from '@/lib/prisma'
import { Item } from '@prisma/client'
import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async () => {
  const data = await prisma.item.findMany({
    include: { favoritedBy: true },
    orderBy: {
      createdAt: 'desc',
    },
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

const Home: React.FC<Props> = ({ items }) => {
  return (
    <div>
      <Head>
        <title>OpenMarket - Sell anything!</title>
        <meta
          name='description'
          content='An open marketplace for selling your stuff'
        />
        <link rel='icon' href='/favicons/favicon.ico' />
      </Head>

      <main>
        <Layout>
          <h1 className='text-xl font-medium text-gray-800'>Items for sale</h1>
          <p className='text-gray-500'>
            Explore what kind of stuff people are selling
          </p>
          <div className='mt-8'>
            <Grid items={items} />
          </div>
        </Layout>
      </main>
    </div>
  )
}

export default Home
