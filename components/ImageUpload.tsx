import React, { useState, useRef } from 'react'
import Image from 'next/image'
import toast from 'react-hot-toast'
import classNames from 'classnames'
import { ArrowUpIcon } from '@heroicons/react/outline'

type Props = {
  initialImage?: { src: string; alt: string } | null
  onChangePicture: (image: string) => void
  sizeLimit?: number
}

const ImageUpload: React.FC<Props> = ({
  initialImage = null,
  sizeLimit = 1024 * 1024, // 1MB
  onChangePicture = () => null,
}) => {
  const pictureRef = useRef<HTMLInputElement>(null)

  const [image, setImage] = useState(initialImage)
  const [updatingPicture, setUpdatingPicture] = useState(false)
  const [pictureError, setPictureError] = useState('')

  const handleOnChangePicture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0]
    const reader = new FileReader()

    const fileName = file?.name?.split('.')?.[0] ?? 'New file'

    reader.addEventListener(
      'load',
      async function () {
        try {
          setImage({ src: String(reader.result), alt: fileName })
          await onChangePicture(String(reader.result))
        } catch (err) {
          toast.error('Unable to update image')
        } finally {
          setUpdatingPicture(false)
        }
      },
      false
    )

    if (file) {
      if (file.size <= sizeLimit) {
        setUpdatingPicture(true)
        setPictureError('')
        reader.readAsDataURL(file)
      } else {
        setPictureError('File size is exceeding 1MB.')
      }
    }
  }

  const handleOnClickPicture = () => {
    pictureRef.current!.click()
  }

  return (
    <div className='flex flex-col space-y-2'>
      <label className='text-gray-600'>Image</label>

      <button
        disabled={updatingPicture}
        onClick={handleOnClickPicture}
        className={classNames(
          'relative aspect-1 overflow-hidden rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition group focus:outline-none',
          image?.src
            ? 'hover:opacity-50 disabled:hover:opacity-100'
            : 'border-2 border-dashed hover:border-gray-400 focus:border-gray-400 disabled:hover:border-gray-200'
        )}
      >
        {image?.src && (
          <Image
            src={image.src}
            alt={image?.alt}
            layout='fill'
            objectFit='cover'
          />
        )}

        <div className='flex items-center justify-center'>
          {!image?.src && (
            <div className='flex flex-col items-center space-y-2'>
              <div className='shrink-0 rounded-full p-2 bg-gray-200 group-hover:scale-110 group-focus:scale-110 transition'>
                <ArrowUpIcon className='w-4 h-4 text-gray-500 transition' />
              </div>
              <span className='text-xs font-semibold text-gray-500 transition'>
                {updatingPicture ? 'Uploading...' : 'Upload'}
              </span>
            </div>
          )}
          <input
            ref={pictureRef}
            type='file'
            accept='.png, .jpg, .jpeg, .gif'
            onChange={handleOnChangePicture}
            className='hidden'
          />
        </div>
      </button>

      {pictureError && (
        <span className='text-red-600 text-sm'>{pictureError}</span>
      )}
    </div>
  )
}

export default ImageUpload
