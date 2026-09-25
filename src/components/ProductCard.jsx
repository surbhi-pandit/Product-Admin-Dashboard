import { useNavigate } from 'react-router-dom'

// Renders products as individual cards - meant for mobile/smaller screens.

const ProductCard = ({products, onDeleteClick}) => {

    const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-3">
        {products.map((product) => (
            <div key={product.id} onClick={() => navigate(`/products/${product.id}`)} className="border rounded-lg p-3 flex gap-3 items-center shadow-sm">
                <img src={product.thumbnail} alt={product.title} className="w-16 h-16 object-cover rounded"/>
                <div className="flex-1">
                    <h3 className="font-semibold">{product.title}</h3>
                    <p className="text-sm text-gray-500 capitalize">{product.category}</p>
                    <div className="flex justify-between text-sm mt-1">
                        <span>${product.price}</span>
                        <span>{product.rating}⭐</span>
                        <span>Stock: {product.stock}</span>
                    </div>

                    <div className="flex gap-3 mt-2">
                        <button
                            onClick={(e) => {
                            e.stopPropagation() // card ka onClick (navigate to details) trigger hone se roko
                            navigate(`/products/${product.id}/edit`)
                            }}
                            className="text-blue-600 text-sm hover:underline"
                        >
                            Edit
                        </button>
                        <button
                            onClick={(e) => {
                            e.stopPropagation()
                            onDeleteClick(product)
                            }}
                            className="text-red-600 text-sm hover:underline"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>               
        ))}
    </div>
  )
}

export default ProductCard
