import { useState } from 'react'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import * as Yup from 'yup'
import { toast } from 'react-hot-toast'
import { Formik, Form } from 'formik'
import Input from '@/components/Input'
import ImageUpload from '@/components/ImageUpload'
import axios from 'axios'

const ListingSchema = Yup.object().shape({
  name: Yup.string().trim().required(),
  description: Yup.string().trim().required(),
  price: Yup.number().positive().integer().min(1).required(),
})

const ListingForm = ({
  initialValues = null,
  redirectPath = '',
  buttonText = 'Submit',
  onSubmit = () => null,
}) => {
  const router = useRouter()

  const [disabled, setDisabled] = useState(false)
  const [imageUrl, setImageUrl] = useState(initialValues?.image ?? '')

  const upload = async (image) => {
    if (!image) return

    try {
      setDisabled(true)
      const { data } = axios.post('/api/image-upload', { image })
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
      // Submit data
      if (typeof onSubmit === 'function') {
        await onSubmit({ ...values, image: imageUrl })
      }
      toast.success('Successfully submitted', { id: toastId })
      // Redirect user
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
                className='bg-indigo-600 text-white py-2 px-6 rounded-md focus:outline-none focus:ring-4 focus:ring-indigo-600 focus:ring-opacity-50 hover:bg-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600'
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

ListingForm.propTypes = {
  initialValues: PropTypes.shape({
    image: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.number,
  }),
  redirectPath: PropTypes.string,
  buttonText: PropTypes.string,
  onSubmit: PropTypes.func,
}

export default ListingForm
