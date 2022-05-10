import Link from 'next/link'
import Image from 'next/image'
import { HeartIcon } from '@heroicons/react/solid'
import { Item } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import classNames from 'classnames'

type Props = Item & {
  favorite: boolean
  onClickFavorite: (id: string) => void
}

const Card: React.FC<Props> = ({
  id = '',
  image = '',
  name = '',
  price = 0,
  favorite = false,
  onClickFavorite = () => null,
}) => {
  const { status } = useSession()
  const [isLoading, setLoading] = useState(true)
  return (
    <Link href={`/items/${id}`}>
      <a className='block w-full'>
        <div className='relative'>
          <div className='relative bg-gray-200 rounded-lg shadow aspect-1'>
            {image && (
              <Image
                src={image}
                alt={name}
                layout='fill'
                objectFit='cover'
                className={classNames(
                  'hover:opacity-80 transition rounded-lg group-hover:opacity-75 duration-700 ease-in-out',
                  isLoading
                    ? 'grayscale blur-2xl scale-110'
                    : 'grayscale-0 blur-0 scale-100'
                )}
                onLoadingComplete={() => setLoading(false)}
              />
            )}
          </div>
          <button
            type='button'
            onClick={(e) => {
              e.preventDefault()
              if (status === 'authenticated') {
                onClickFavorite(id)
              }
            }}
            className='absolute top-2 right-2'
          >
            <HeartIcon
              className={`w-7 h-7 drop-shadow-lg transition ${
                favorite ? 'text-red-500' : 'text-white'
              }`}
            />
          </button>
        </div>
        <div className='mt-2 w-full text-gray-700 font-semibold leading-tight'>
          {name}
        </div>
        <p>
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(price ?? 0)}
        </p>
      </a>
    </Link>
  )
}

export default Card
