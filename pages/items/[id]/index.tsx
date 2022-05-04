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
  const items: Item[] = await prisma.item.findMany({
    select: { id: true },
  })

  const paths = items.map((item) => {
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
    where: { id: params.id },
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
  }, [session?.user?.id])

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
        <div className='flex flex-col items-center sm:flex-row sm:justify-between sm:space-x-4'>
          <div className='flex flex-col sm:flex-row sm:justify-between sm:space-x-4 space-y-4'>
            <h1 className='text-2xl font-semibold truncate'>{item?.name}</h1>
          </div>
          {isOwner && (
            <div className='flex items-center gap-x-2'>
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
        </div>

        <div className='mt-6 relative aspect-1 bg-gray-200 rounded-lg shadow-md overflow-hidden max-w-sm'>
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

        <p className='mt-8 text-lg'>{item?.description}</p>
      </div>
    </Layout>
  )
}

export default ListedItem
