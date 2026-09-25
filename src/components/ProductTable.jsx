import { useNavigate } from 'react-router-dom'

// Renders products in a table format - meant for desktop/larger screens.

const ProductTable = ({products, onDeleteClick}) => {

    const navigate = useNavigate()


  return (
    <table className="w-full border-collapse">
        <thead>
            <tr className="bg-gray-100 text-left">
                <th className="p-3">Image</th>
                <th className="p-3">Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Rating</th>
                <th className="p-3">Stock</th>
            </tr>
        </thead>
        <tbody>
            {/* Loop through each product and render a table row */}
            {products.map((product) =>(
                <tr key={product.id} onClick={() => navigate(`/products/${product.id}`)} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                        <img src={product.thumbnail} alt={product.title} className="w-12 h-12 object-cover rounded"/>
                    </td>
                    <td className="p-3">{product.title}</td>
                    <td className="p-3 capitalize">{product.category}</td>
                    <td className="p-3">${product.price}</td>
                    <td className="p-3">{product.rating}⭐</td>
                    <td className="p-3">{product.stock}</td>
                    <td className="p-3">
                        <button
                            onClick={(e) => {
                            e.stopPropagation() // prevent row's onClick (navigate to details) from firing
                            navigate(`/products/${product.id}/edit`)
                            }}
                            className="text-blue-600 mr-3 text-sm"
                        >
                            Edit
                        </button>
                        <button
                            onClick={(e) => {
                            e.stopPropagation()
                            onDeleteClick(product) // this prop needs to be passed down from ProductsPage
                            }}
                            className="text-red-600 text-sm"
                        >
                            Delete
                        </button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
  )
}

export default ProductTable
