import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addProduct } from '../api/productsApi'
import { addLocalProduct } from '../utils/localOverrides'
import ProductForm from '../components/ProductForm'

const AddProductPage = () => {

    const navigate = useNavigate()
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState(null)

    const handleSubmit = async (formData) => {
        setSubmitting(true)
        setError(null)

        try {
          await addProduct(formData)
        } catch {
          // Ignore - doesn't block the local add, since the API doesn't persist anyway
        }
        
        const newProduct = {
          ...formData,
            id: Date.now(), // always generate our own unique id locally - guaranteed unique, no collisions
            thumbnail: 'https://placehold.co/200x200?text=New+Product',
            images: [],
            rating: 0,
            reviews: [],
        }
        
        addLocalProduct(newProduct)
        setSubmitting(false)
        navigate('/products')
    }


  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Add Product</h1>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      <ProductForm onSubmit={handleSubmit} submitting={submitting} />
    </div>
  )
}

export default AddProductPage
