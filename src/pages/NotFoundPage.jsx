import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-6xl font-bold text-gray-300 mb-2">404</h1>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h2>
      <p className="text-gray-500 mb-6 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/products"
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-md font-medium text-sm transition"
      >
        Back to Products
      </Link>
    </div>
  )
}

export default NotFoundPage
