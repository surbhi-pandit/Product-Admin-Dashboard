import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProductById } from '../api/productsApi'
import { getLocalProduct, getOverriddenProduct, isProductDeleted } from '../utils/localOverrides'
import Loader from '../components/Loader'
import ErrorRetry from '../components/ErrorRetry'


const ProductDetailsPage = () => {

  const { id } = useParams() // get the id from the URL

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [notFound, setNotFound] = useState(false) // separate flag from generic error

  const fetchProduct = async () => {
    setLoading(true)
    setError(null)
    setNotFound(false)

    // Check if the product was locally deleted
    if (isProductDeleted(id)) {
      setNotFound(true)
      setLoading(false)
      return
    }

    const localProduct = getLocalProduct(id)
    if (localProduct) {
      setProduct(localProduct)
      setLoading(false)
      return
    }


    try {
      const data = await getProductById(id)
      const merged = getOverriddenProduct(Number(id), data)
      setProduct(merged)
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setNotFound(true)
      } else {
        setError('Failed to load product details. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  // Re-fetch whenever the id in the URL changes
  // (e.g. user navigates from one product's details straight to another)
  useEffect(() => {
    fetchProduct()
  }, [id])

  if (loading) return <Loader />

  if (notFound) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
        <p className="text-gray-500 mb-4">
          We couldn't find a product with id "{id}".
        </p>
        <Link to="/products" className="text-blue-600 underline">
          Back to Products
        </Link>
      </div>
    )
  }

  if (error) {
    return <ErrorRetry message={error} onRetry={fetchProduct} />
  }

  // If we reach here, product is guaranteed to be loaded successfully
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Link to="/products" className="text-blue-600 underline text-sm mb-4 inline-block">
        ← Back to Products
      </Link>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Images section */}
        <div>
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-64 object-cover rounded-lg mb-3"
          />
          <div className="flex gap-2 overflow-x-auto">
            {product.images?.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${product.title} ${index + 1}`}
                className="w-16 h-16 object-cover rounded border"
              />
            ))}
          </div>
        </div>

        {/* Details section */}
        <div>
          <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
          <p className="text-gray-500 capitalize mb-2">{product.category}</p>
          <p className="text-gray-700 mb-4">{product.description}</p>

          <div className="flex items-center gap-4 mb-4">
            <span className="text-2xl font-bold text-green-600">${product.price}</span>
            <span className="text-yellow-500">{product.rating} ⭐</span>
            <span className="text-sm text-gray-500">Stock: {product.stock}</span>
          </div>
        </div>
      </div>

      {/* Reviews section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-3">Reviews</h2>

        {(!product.reviews || product.reviews.length === 0) && (
          <p className="text-gray-500">No reviews yet.</p>
        )}

        <div className="flex flex-col gap-3">
          {product.reviews?.map((review, index) => (
            <div key={index} className="border rounded-lg p-3">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold">{review.reviewerName}</span>
                <span className="text-yellow-500 text-sm">{review.rating} ⭐</span>
              </div>
              <p className="text-sm text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProductDetailsPage
