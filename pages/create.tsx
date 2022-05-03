import Layout from '@/components/Layout'
import ListingForm from '@/components/ListingForm'
import axios from 'axios'
import { getSession } from 'next-auth/react'
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

  return {
    props: {},
  }
}

const Create = () => {
  const addItem = (data) => axios.post('/api/items', data)

  return (
    <Layout>
      <div className='max-w-screen-sm mx-auto'>
        <h1 className='text-xl font-medium text-gray-800'>List your Item</h1>
        <p className='text-gray-500'>
          Fill out the form below to list a new item.
        </p>
        <div className='mt-8'>
          <ListingForm
            buttonText='Add item'
            redirectPath='/'
            onSubmit={addItem}
          />
        </div>
      </div>
    </Layout>
  )
}

export default Create
