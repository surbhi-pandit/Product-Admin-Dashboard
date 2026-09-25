import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProductById, updateProduct } from '../api/productsApi'
import { editLocalProduct, getLocalProduct, getOverriddenProduct, isProductDeleted } from '../utils/localOverrides'
import ProductForm from '../components/ProductForm'
import Loader from '../components/Loader'

function EditProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      setError(null)

      if (isProductDeleted(id)) {
        setError('This product has been deleted.')
        setLoading(false)
        return
      }

      // Check if this id belongs to a product that was added locally
      const localProduct = getLocalProduct(id)
      if (localProduct) {
        setProduct(localProduct)
        setLoading(false)
        return
      }

      // Otherwise fetch from the API, then apply this product's own edit-override
      try {
        const data = await getProductById(id)
        const merged = getOverriddenProduct(id, data)
        setProduct(merged)
      } catch {
        setError('Failed to load product.')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleSubmit = async (formData) => {
    setSubmitting(true)

    try {
      await updateProduct(id, formData)
    } catch {
      // Ignore - DummyJSON doesn't persist changes anyway
    }

    editLocalProduct(id, formData)
    setSubmitting(false)
    navigate(`/products/${id}`)
  }

  if (loading) return <Loader />
  if (error && !product) return <p className="text-red-500 p-4">{error}</p>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      <ProductForm initialData={product} onSubmit={handleSubmit} submitting={submitting} />
    </div>
  )
}

export default EditProductPage
