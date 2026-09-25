import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getNumberParam, getStringParam } from '../utils/urlParams'
import { getProducts } from '../api/productsApi'
import Loader from '../components/Loader'
import ErrorRetry from '../components/ErrorRetry'
import EmptyState from '../components/EmptyState'
import ProductTable from '../components/ProductTable'
import ProductCard from '../components/ProductCard'
import Pagination from '../components/Pagination'
import SearchBar from '../components/SearchBar'
import CategoryFilter from '../components/CategoryFilter'
import SortControl from '../components/SortControl'
import { applyOverrides, deleteLocalProduct } from '../utils/localOverrides'
import { deleteProduct } from '../api/productsApi'
import { useNavigate } from 'react-router-dom'
import DeleteConfirmModal from '../components/DeleteConfirmModal'



const ProductsPage = () => {

  const [searchParams, setSearchParams] = useSearchParams()

  const navigate = useNavigate()


  // Instead of separate useState for page/search/category/sort,
  // we DERIVE them from the URL on every render. This is the key change.
  const page = getNumberParam(searchParams, 'page',1)
  const limit = getNumberParam(searchParams, 'limit', 10)
  const search = getStringParam(searchParams, 'search', '')
  const category = getStringParam(searchParams, 'category', '')
  const sortBy = getStringParam(searchParams, 'sortBy', '')
  const order = getStringParam(searchParams, 'order', 'asc')


  // These remain as local state because they're NOT meant to be shareable via URL —
  // they're just UI feedback for the current fetch operation
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [deleteTarget, setDeleteTarget] = useState(null) // holds the product being considered for deletion


  //useRef to hold the AbortController across renders WITHOUT causing re-renders itself (unlike useState, changing a ref does not trigger a component re-render)
  const abortControllerRef =useRef(null)


  // Helper function to update the URL — components will call this
  // instead of directly calling setSearchParams everywhere
  const updateParams = (updates) => {
    const newParams = new URLSearchParams(searchParams) // copy current params

    Object.entries(updates).forEach(([key, value]) => {
      if (value === '' || value === null || value === undefined) {
        newParams.delete(key) // remove empty params so URL stays clean
      } else {
        newParams.set(key, value)
      }
    })

    setSearchParams(newParams)
  }


  // This effect re-runs EVERY TIME any URL param changes.
  const fetchProducts = async () => {
    // STEP 1: If a previous request is still in-flight, cancel it before starting a new one.
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // STEP 2: Create a fresh AbortController for THIS request, and save it in the ref.
    const controller = new AbortController()
    abortControllerRef.current = controller

    setLoading(true)
    setError(null)

    try {
      // Fetch all matching products from the API for the current search/category/sort
      const data = await getProducts(
        { limit: 0, skip: 0, search, category, sortBy, order },
        controller.signal
      )

      // Apply overrides: filter deleted, apply edits, merge matching local added products, sort
      const mergedAll = applyOverrides(data.products || [], { search, category, sortBy, order })

      const newTotal = mergedAll.length
      const maxPage = Math.max(1, Math.ceil(newTotal / limit))

      if (page > maxPage) {
        updateParams({ page: maxPage })
        return
      }

      // Slice the exact products for the current page based on selected limit
      const startIndex = (page - 1) * limit
      const paginatedProducts = mergedAll.slice(startIndex, startIndex + limit)

      setProducts(paginatedProducts)
      setTotal(newTotal)

    } catch (err) {
      // If the error is because WE cancelled it, silently ignore
      if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') {
        return
      }
      setError('Failed to load products. Please try again.')

    } finally {
      // Only stop loading if this request wasn't cancelled
      if (abortControllerRef.current === controller) {
        setLoading(false)
      }
    }
  }

  // This effect re-runs EVERY TIME any URL param changes.
  useEffect(() => {
    fetchProducts()

    // Cleanup: if the component unmounts or effect re-runs, cancel any pending request
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, search, category, sortBy, order])

  // Handler passed to Pagination - just updates the URL
  const handlePageChange = (newPage) => {
    updateParams({ page: newPage })
  }

  // Handler for page size change - reset to page 1 when limit changes
  const handleLimitChange = (newLimit) => {
    updateParams({ limit: newLimit, page: 1 })
  }

  // Called by SearchBar whenever the debounced search value changes
  const handleSearchChange = (newSearch) => {
    updateParams({ search: newSearch, category: '', page: 1 })
  }

  const handleCategoryChange = (newCategory) => {
    updateParams({ category: newCategory, page: 1 })
  }

  const handleSortChange = ({ sortBy: newSortBy, order: newOrder }) => {
    updateParams({ sortBy: newSortBy, order: newOrder, page: 1 })
  }

  // Called when user clicks the delete icon on a product
  const handleDeleteClick = (product) => {
    setDeleteTarget(product)
  }

  // Called when user confirms deletion in the modal
  const handleConfirmDelete = async () => {
    const productToDelete = deleteTarget
    setDeleteTarget(null) // close modal immediately for responsive feel

    try {
      await deleteProduct(productToDelete.id) // call fake API
    } catch {
      // Ignore API errors for fake delete
    }

    deleteLocalProduct(productToDelete.id) // update our overlay
    fetchProducts()
  }

  return (
    <div className='p-4'>

      {/* Title + Add Product button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <button
          onClick={() => navigate('/products/new')}
          className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
        >
          + Add Product
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <SearchBar initalValue={search} onSearchChange={handleSearchChange} />

        <CategoryFilter
          value={category}
          onChange={handleCategoryChange}
          disabled={!!search} // disabled whenever search is active
        />

        <SortControl sortBy={sortBy} order={order} onChange={handleSortChange} />
      </div>

      {/* Conditional rendering - only one of these blocks will show at a time */}

      {loading && <Loader />}

      {!loading && error && (
        <ErrorRetry message={error} onRetry={fetchProducts} />
      )}

      {!loading && !error && products.length === 0 && (
        <EmptyState message="No products available"/>
      )}

      {!loading && !error && products.length > 0 && (
        <>
          {/* Desktop view - hidden on small screens, visible on md (768px) and up */}
          <div className='hidden md:block'>
            <ProductTable products={products} onDeleteClick={handleDeleteClick}/>
          </div>

          <div className='block md:hidden'>
            <ProductCard products={products} onDeleteClick={handleDeleteClick}/>
          </div>

          {/* Pagination shown only when we have results */}
          <Pagination
            page={page}
            limit={limit}
            total={total}
            currentCount={products.length}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        </>
      )}

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        productTitle={deleteTarget?.title}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

    </div>
  )
}

export default ProductsPage
