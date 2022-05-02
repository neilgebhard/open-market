import Image from 'next/image'
import Layout from '@/components/Layout'
import { prisma } from '@/lib/prisma'
import { useRouter } from 'next/router'

export async function getStaticPaths() {
  const items = await prisma.item.findMany({
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

export async function getStaticProps({ params }) {
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

const ListedItem = (item = null) => {
  const router = useRouter()

  // Fallback version
  if (router.isFallback) {
    return 'Loading...'
  }

  return (
    <Layout>
      <div className='max-w-screen-lg mx-auto'>
        <div className='flex flex-col sm:flex-row sm:justify-between sm:space-x-4 space-y-4'>
          <h1 className='text-2xl font-semibold truncate'>
            {item?.name ?? ''}
          </h1>
        </div>

        <div className='mt-6 relative aspect-1 bg-gray-200 rounded-lg shadow-md overflow-hidden'>
          {item?.image ? (
            <Image
              src={item.image}
              alt={item.name}
              layout='fill'
              objectFit='cover'
            />
          ) : null}
        </div>

        <p className='mt-8 text-lg'>{item?.description ?? ''}</p>
      </div>
    </Layout>
  )
}

export default ListedItem
