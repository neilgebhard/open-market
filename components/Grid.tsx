import Card from '@/components/Card'
import { ExclamationIcon } from '@heroicons/react/outline'
import axios from 'axios'
import { useEffect, useState } from 'react'

type Item = {
  id: string
  image: string
  name: string
  price: number
  favorite: boolean
  onClickFavorite: () => void
}

const Grid = ({ items = [] }: { items: Item[] }) => {
  const [favorites, setFavorites] = useState<string[]>([])

  const isEmpty = items.length === 0

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const isFavorited = prev.includes(id)
      if (isFavorited) {
        axios.delete(`/api/items/${id}/favorite`)
        return prev.filter((favorite) => favorite !== id)
      } else {
        axios.put(`/api/items/${id}/favorite`)
        return [...prev, id]
      }
    })
  }

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const { data } = await axios.get(`/api/user/favorites`)
        setFavorites(data)
      } catch (e) {
        console.error(e)
      }
    }

    fetchFavorites()
  }, [])

  return isEmpty ? (
    <p className='text-amber-700 bg-amber-100 px-4 rounded-md py-2 max-w-max inline-flex items-center space-x-1'>
      <ExclamationIcon className='shrink-0 w-5 h-5 mt-px' />
      <span>Unfortunately, there is nothing to display yet.</span>
    </p>
  ) : (
    <div className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
      {items.map((item) => (
        <Card
          key={item.id}
          {...item}
          onClickFavorite={toggleFavorite}
          favorite={favorites.includes(item.id)}
        />
      ))}
    </div>
  )
}

export default Grid
