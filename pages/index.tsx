import type { NextPage } from 'next'
import Head from 'next/head'
import Layout from '@/components/Layout'
import Grid from '@/components/Grid'
import prisma from '@/lib/prisma'
import { Item } from '@prisma/client'
import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async () => {
  const items: Item[] = await prisma.item.findMany()
  return {
    props: {
      items: JSON.parse(JSON.stringify(items)),
    },
  }
}

const Home: NextPage = ({ items = [] }) => {
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
          <h1 className='text-xl font-medium text-gray-800'>
            Premium items at a discount
          </h1>
          <p className='text-gray-500'>
            Explore some of the best items available on the market
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
