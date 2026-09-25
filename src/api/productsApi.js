import axiosInstance from "./axiosInstance";


export const getCategories =async() =>{
    const response = await axiosInstance.get('/products/categories')
    return response.data
}

//Fetch a paginated list of products
//Now accepts a single options object instead of positional arguments.
// This is more maintainable as we add more filters/sort options over time.
export const getProducts = async ({limit = 10, skip = 0, search = '', category = '', sortBy='', order='asc'} = {}, signal) =>{
    const params = {limit, skip}

    // Only add sortBy/order to params if sorting is actually requested
    if(sortBy){
        params.sortBy = sortBy
        params.order =order
    }

    // If search is present, we always hit the search endpoint, regardless of category.
    let url = '/products'

    if(search){
        url = '/products/search'
        params.q = search
    } else if(category){
        // Only apply category filtering when there is NO active search
        url = `/products/category/${category}`
    }
    
    const response = await axiosInstance.get(url, {params,signal})
    return response.data
}

// Get a single product by its ID - used later in Product Details page
export const getProductById = async (id) => {
    const response = await axiosInstance.get(`/products/${id}`)
    return response.data
}


// Calls DummyJSON's fake "add" endpoint - it returns a success response
// with a generated id, but doesn't actually save anything server-side.
export const addProduct = async (productData) => {
  const response = await axiosInstance.post('/products/add', productData)
  return response.data // includes a fake `id` like 195
}

// Calls DummyJSON's fake "update" endpoint - same limitation, response looks real but nothing persists
export const updateProduct = async (id, productData) => {
  const response = await axiosInstance.put(`/products/${id}`, productData)
  return response.data
}

// Calls DummyJSON's fake "delete" endpoint
export const deleteProduct = async (id) => {
  const response = await axiosInstance.delete(`/products/${id}`)
  return response.data
}
