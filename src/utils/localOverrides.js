const STORAGE_KEY = 'product_overrides'

// Shape of what we store:
// {
//   added: [ {id, title, ...fullProductObject}, ... ],
//   edited: { [id]: {title, price, ...changedFields}, ... },
//   deleted: [id, id, ...]
// }

export const getOverrides = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : { added: [], edited: {}, deleted: [] }
  } catch {
    return { added: [], edited: {}, deleted: [] }
  }
}

const saveOverrides = (overrides) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides))
}

export const addLocalProduct = (product) => {
  const overrides = getOverrides()
  overrides.added.unshift(product)
  saveOverrides(overrides)
}

export const editLocalProduct = (id, updatedFields) => {
  const overrides = getOverrides()
  const numId = Number(id)

  const addedIndex = overrides.added.findIndex((p) => p.id === id || p.id === numId || String(p.id) === String(id))
  if (addedIndex !== -1) {
    overrides.added[addedIndex] = { ...overrides.added[addedIndex], ...updatedFields }
  } else {
    overrides.edited[id] = { ...(overrides.edited[id] || {}), ...updatedFields }
  }

  saveOverrides(overrides)
}

export const deleteLocalProduct = (id) => {
  const overrides = getOverrides()
  const numId = Number(id)

  // Check if it was a locally-added product
  const wasAdded = overrides.added.some((p) => p.id === id || p.id === numId || String(p.id) === String(id))

  if (wasAdded) {
    overrides.added = overrides.added.filter((p) => p.id !== id && p.id !== numId && String(p.id) !== String(id))
  } else {
    // It's a real API product, mark it as deleted
    const isAlreadyDeleted = overrides.deleted.some((delId) => delId === id || delId === numId || String(delId) === String(id))
    if (!isAlreadyDeleted) {
      overrides.deleted.push(numId || id)
    }
  }

  delete overrides.edited[id]
  delete overrides.edited[numId]
  delete overrides.edited[String(id)]

  saveOverrides(overrides)
}

export const isProductDeleted = (id) => {
  const overrides = getOverrides()
  const numId = Number(id)
  return overrides.deleted.some((delId) => delId === id || delId === numId || String(delId) === String(id))
}

// Used by the PRODUCTS LIST page - merges deletes/edits into API results,
// integrates locally-added products that match search/category, and sorts if requested.
export const applyOverrides = (apiProducts = [], { search = '', category = '', sortBy = '', order = 'asc' } = {}) => {
  const overrides = getOverrides()

  const isDeleted = (id) => {
    return overrides.deleted.some((delId) => delId === id || delId === Number(id) || String(delId) === String(id))
  }

  // 1. Process API products: filter out deleted, apply edits
  const activeApiProducts = apiProducts
    .filter((p) => !isDeleted(p.id))
    .map((p) => {
      const edit = overrides.edited[p.id] ?? overrides.edited[String(p.id)] ?? overrides.edited[Number(p.id)]
      return edit ? { ...p, ...edit } : p
    })

  // 2. Process locally added products: must match search & category, and not be deleted
  const query = search.trim().toLowerCase()
  const catFilter = category.trim().toLowerCase()

  const matchingAdded = overrides.added
    .filter((p) => !isDeleted(p.id))
    .map((p) => {
      const edit = overrides.edited[p.id] ?? overrides.edited[String(p.id)] ?? overrides.edited[Number(p.id)]
      return edit ? { ...p, ...edit } : p
    })
    .filter((p) => {
      // Category match
      if (catFilter && (p.category || '').toLowerCase() !== catFilter) {
        return false
      }
      // Search match
      if (query) {
        const titleMatch = (p.title || '').toLowerCase().includes(query)
        const descMatch = (p.description || '').toLowerCase().includes(query)
        const catMatch = (p.category || '').toLowerCase().includes(query)
        if (!titleMatch && !descMatch && !catMatch) {
          return false
        }
      }
      return true
    })

  // 3. Combine matching added products + active API products
  let combined = [...matchingAdded, ...activeApiProducts]

  // 4. Sort if requested
  if (sortBy) {
    combined.sort((a, b) => {
      let valA = a[sortBy]
      let valB = b[sortBy]

      if (typeof valA === 'string' || typeof valB === 'string') {
        const strA = (valA ?? '').toString().toLowerCase()
        const strB = (valB ?? '').toString().toLowerCase()
        return order === 'desc' ? strB.localeCompare(strA) : strA.localeCompare(strB)
      }

      const numA = Number(valA) || 0
      const numB = Number(valB) || 0
      return order === 'desc' ? numB - numA : numA - numB
    })
  }

  return combined
}

// checks if a given id belongs to a product that was created ENTIRELY locally
export const getLocalProduct = (id) => {
  const overrides = getOverrides()
  const numId = Number(id)
  return overrides.added.find((p) => p.id === id || p.id === numId || String(p.id) === String(id)) || null
}

// for a SINGLE real product (fetched fresh from the API), applies only its own edit-override if one exists
export const getOverriddenProduct = (id, apiProduct) => {
  const overrides = getOverrides()
  const numId = Number(id)
  const edit = overrides.edited[id] ?? overrides.edited[String(id)] ?? overrides.edited[numId]

  if (edit) {
    return { ...apiProduct, ...edit }
  }

  return apiProduct
}

