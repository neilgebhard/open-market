import Image from 'next/image'
import Layout from '@/components/Layout'
import prisma from '@/lib/prisma'
import { Item } from '@prisma/client'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import Link from 'next/link'

export const getStaticPaths: GetStaticPaths = async () => {
  const ids = await prisma.item.findMany({
    select: { id: true },
  })

  const paths = ids.map((item) => {
    return {
      params: {
        id: item.id,
      },
    }
  })

  return {
    paths,
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const item = await prisma.item.findUnique({
    where: { id: String(params?.id) },
  })

  if (item) {
    return {
      props: JSON.parse(JSON.stringify(item)),
    }
  }

  return {
    redirect: {
      destination: '/',
      permanent: false,
    },
  }
}

const ListedItem = (item: Item) => {
  const { data: session } = useSession()
  const [isOwner, setIsOwner] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkIfOwner = async () => {
      try {
        const { data } = await axios.get(`/api/items/${item.id}/owner`)
        setIsOwner(session?.user?.email === data.email)
      } catch (e) {
        setIsOwner(false)
      }
    }
    checkIfOwner()
  }, [session?.user, item.id])

  const deleteItem = async () => {
    let toastId
    try {
      toastId = toast.loading('Deleting...')
      setDeleting(true)
      await axios.delete(`/api/items/${item.id}`)
      toast.success('Successfully deleted', { id: toastId })
      router.push('/items')
    } catch (e) {
      toast.error('Failed to delete item', { id: toastId })
      setDeleting(false)
    }
  }

  return (
    <Layout>
      <div className='max-w-screen-lg mx-auto'>
        <div className='flex flex-col lg:flex-row gap-6'>
          <div className='relative aspect-1 bg-gray-200 rounded-lg shadow-md overflow-hidden max-w-sm flex-1'>
            {item?.image && (
              <Image
                src={item.image}
                alt={item.name}
                layout='fill'
                objectFit='cover'
                priority
              />
            )}
          </div>
          <div className='flex-1 text-lg'>
            <h1 className='text-2xl font-bold'>{item?.name}</h1>
            <p className='text-2xl'>
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(item?.price)}
            </p>
            <p className='mt-6'>{item?.description}</p>
            {isOwner && (
              <div className='flex items-center gap-x-2 mt-6'>
                <Link href={`/items/${item.id}/edit`}>
                  <a className='px-4 py-1 border border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white transition rounded-md disabled:text-gray-800 disabled:bg-transparent disabled:opacity-50 disabled:cursor-not-allowed'>
                    Edit
                  </a>
                </Link>
                <button
                  type='button'
                  disabled={deleting}
                  onClick={() => deleteItem()}
                  className='rounded-md border border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-white focus:outline-none transition disabled:bg-rose-500 disabled:text-white disabled:opacity-50 disabled:cursor-not-allowed px-4 py-1'
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            )}
            <div className='mt-6'>
              <button className='px-4 py-1 rounded-md bg-amber-600 hover:bg-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500 focus:ring-opacity-50 text-white transition'>
                Buy
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ListedItem
