import { useState } from 'react'

// initialData = existing product (for edit) or null (for add)
// onSubmit = function called with valid form data when user submits
// submitting = loading state passed from parent (to disable button)

const ProductForm = ({ initialData, onSubmit, submitting }) => {

    const [formData, setFormData] = useState({
    title: initialData?.title || '',
    price: initialData?.price || '',
    category: initialData?.category || '',
    stock: initialData?.stock || '',
    description: initialData?.description || '',
    })

    const [errors, setErrors] = useState({})

    // Validates all fields and returns an errors object (empty object = valid)
    const validate = () => {
        const newErrors = {}

        if (!formData.title.trim()) {
        newErrors.title = 'Title is required'
        }

        if (!formData.price || Number(formData.price) <= 0) {
        newErrors.price = 'Price must be a positive number'
        }

        if (!formData.category.trim()) {
        newErrors.category = 'Category is required'
        }

        if (!formData.stock || Number(formData.stock) < 0) {
        newErrors.stock = 'Stock must be 0 or more'
        }

        if (!formData.description.trim()) {
        newErrors.description = 'Description is required'
        }

        return newErrors
    }

    const handleChange = (field) => (e) => {
        setFormData({ ...formData, [field]: e.target.value })

        // Clear the error for a field as soon as the user starts fixing it
        if (errors[field]) {
        setErrors({ ...errors, [field]: undefined })
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        // Prevent double-submit: if already submitting, ignore extra clicks
        if (submitting) return

        const validationErrors = validate()

        if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors)
        return // stop here - don't call onSubmit if invalid
        }

        // Convert price/stock to numbers before sending, since inputs give strings
        onSubmit({
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        })
    }


  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={handleChange('title')}
          className="w-full border rounded px-3 py-2"
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Price</label>
        <input
          type="number"
          value={formData.price}
          onChange={handleChange('price')}
          className="w-full border rounded px-3 py-2"
        />
        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <input
          type="text"
          value={formData.category}
          onChange={handleChange('category')}
          className="w-full border rounded px-3 py-2"
        />
        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Stock</label>
        <input
          type="number"
          value={formData.stock}
          onChange={handleChange('stock')}
          className="w-full border rounded px-3 py-2"
        />
        {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={handleChange('description')}
          rows={4}
          className="w-full border rounded px-3 py-2"
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="bg-blue-600 text-white py-2 rounded disabled:opacity-50"
      >
        {submitting ? 'Saving...' : 'Save'}
      </button>
    </form>
  )
}

export default ProductForm
