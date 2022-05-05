import Link from 'next/link'
import Image from 'next/image'
import { HeartIcon } from '@heroicons/react/solid'

type CardProps = {
  id: string
  image: string
  name: string
  price: number
  favorite: boolean
  onClickFavorite: (id: string) => void
}

const Card = ({
  id = '',
  image = '',
  name = '',
  price = 0,
  favorite = false,
  onClickFavorite = () => null,
}: CardProps) => (
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
              className='hover:opacity-80 transition rounded-lg'
            />
          )}
        </div>
        <button
          type='button'
          onClick={(e) => {
            e.preventDefault()
            onClickFavorite(id)
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

export default Card
