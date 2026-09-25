import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailsPage from './pages/ProductDetailsPage'
import NotFoundPage from './pages/NotFoundPage'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import PublicRoute from './components/PublicRoute'
import AddProductPage from './pages/AddProductPage'
import EditProductPage from './pages/EditProductPage'

function App() {

  return (
    <>
      <Navbar/>
      <Routes>
        {/* Public route - anyone can access login */}
        <Route path="/login" element={<PublicRoute> <LoginPage /> </PublicRoute>} />

          
        <Route path="/products" element={<ProtectedRoute> <ProductsPage /> </ProtectedRoute> } />
        <Route path="/products/:id" element={<ProtectedRoute> <ProductDetailsPage /> </ProtectedRoute> } />

        <Route path="/products/new" element={<ProtectedRoute><AddProductPage /></ProtectedRoute>} />
        <Route path="/products/:id/edit" element={<ProtectedRoute><EditProductPage /></ProtectedRoute>} />

        {/* Catch-all route for unknown paths */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}

export default App
