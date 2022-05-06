import { useState } from 'react'
import { useRouter } from 'next/router'
import * as Yup from 'yup'
import { toast } from 'react-hot-toast'
import { Formik, Form } from 'formik'
import Input from '@/components/Input'
import ImageUpload from '@/components/ImageUpload'
import axios from 'axios'

type InitialValues = {
  image: string
  name: string
  description: string
  price: number
}

type ListingFormProps = {
  initialValues: InitialValues
  redirectPath: string
  buttonText: string
  onSubmit: () => void
}

const ListingSchema = Yup.object().shape({
  name: Yup.string().trim().required(),
  description: Yup.string().trim().required(),
  price: Yup.number().positive().integer().min(1).required(),
})

const ListingForm = ({
  initialValues,
  redirectPath = '',
  buttonText = 'Submit',
  onSubmit = () => null,
}: ListingFormProps) => {
  const router = useRouter()

  const [disabled, setDisabled] = useState(false)
  const [imageUrl, setImageUrl] = useState(initialValues?.image)

  const upload = async (image: string) => {
    if (!image) return

    let toastId
    try {
      setDisabled(true)
      toastId = toast.loading('Uploading...')
      const { data } = await axios.post('/api/image-upload', { image })
      setImageUrl(data?.url)
      toast.success('Successfully uploaded', { id: toastId })
    } catch (e) {
      toast.error('Unable to upload', { id: toastId })
      setImageUrl('')
    } finally {
      setDisabled(false)
    }
  }

  const handleOnSubmit = async (values = null) => {
    let toastId
    try {
      setDisabled(true)
      toastId = toast.loading('Submitting...')

      await onSubmit({ ...values, image: imageUrl })

      toast.success('Successfully submitted', { id: toastId })

      if (redirectPath) {
        router.push(redirectPath)
      }
    } catch (e) {
      toast.error('Unable to submit', { id: toastId })
      setDisabled(false)
    }
  }

  const { image, ...initialFormValues } = initialValues ?? {
    image: '',
    name: '',
    description: '',
    price: 0,
  }

  return (
    <div>
      <div className='mb-8 max-w-md'>
        <ImageUpload
          initialImage={{ src: image, alt: initialFormValues.title }}
          onChangePicture={upload}
        />
      </div>

      <Formik
        initialValues={initialFormValues}
        validationSchema={ListingSchema}
        validateOnBlur={false}
        onSubmit={handleOnSubmit}
      >
        {({ isSubmitting, isValid }) => (
          <Form className='space-y-8'>
            <div className='space-y-6'>
              <Input
                name='name'
                type='text'
                label='Name'
                placeholder='Mountain bike'
                disabled={disabled}
              />

              <Input
                name='description'
                type='textarea'
                label='Description'
                placeholder='2022 12-speed Aluminum'
                disabled={disabled}
                rows={5}
              />

              <Input
                name='price'
                type='number'
                min='0'
                label='Price of item'
                placeholder='1000'
                disabled={disabled}
              />
            </div>

            <div className='flex justify-end'>
              <button
                type='submit'
                disabled={disabled || !isValid}
                className='bg-amber-600 text-white py-2 px-6 rounded-md focus:outline-none focus:ring-4 focus:ring-amber-600 focus:ring-opacity-50 hover:bg-amber-500 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-amber-600'
              >
                {isSubmitting ? 'Submitting...' : buttonText}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default ListingForm
