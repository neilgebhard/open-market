import { GetServerSideProps } from 'next'
import Layout from '@/components/Layout'
import ListingForm from '@/components/ListingForm'
import { prisma } from '@/lib/prisma'
import { getSession } from 'next-auth/react'
import { Item } from '@prisma/client'
import axios from 'axios'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)

  const redirect = {
    redirect: {
      destination: '/',
      permanent: false,
    },
  }

  if (!session) return redirect

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email },
    select: { items: true },
  })

  const item = user.items.find((item) => item.id === context.params.id)

  if (!item) return redirect

  return {
    props: JSON.parse(JSON.stringify(item)),
  }
}

const Edit = (item = null) => {
  const handleSubmit = (data) => axios.patch(`/api/items/${item.id}`, data)

  return (
    <Layout>
      <div className='max-w-screen-sm mx-auto'>
        <h1 className='text-xl font-medium text-gray-800'>Edit your item</h1>
        <p className='text-gray-500'>
          Fill out the form below to update your item.
        </p>
        <div className='mt-8'>
          <ListingForm
            initialValues={item}
            buttonText='Update item'
            redirectPath={`/items/${item.id}`}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </Layout>
  )
}

export default Edit
