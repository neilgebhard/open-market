import Card from '@/components/Card'
import { ExclamationIcon } from '@heroicons/react/outline'

type Item = {
  id: string
  image: string
  name: string
  price: number
  favorite: boolean
  onClickFavorite: () => void
}

type GridProps = {
  items: Item[]
}
const Grid = ({ items = [] }: GridProps) => {
  const isEmpty = items.length === 0

  const toggleFavorite = async (id: string) => {
    // TODO: Add/remove item from the authenticated user's favorites
  }

  return isEmpty ? (
    <p className='text-amber-700 bg-amber-100 px-4 rounded-md py-2 max-w-max inline-flex items-center space-x-1'>
      <ExclamationIcon className='shrink-0 w-5 h-5 mt-px' />
      <span>Unfortunately, there is nothing to display yet.</span>
    </p>
  ) : (
    <div className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
      {items.map((item) => (
        <Card key={item.id} {...item} onClickFavorite={toggleFavorite} />
      ))}
    </div>
  )
}

export default Grid
