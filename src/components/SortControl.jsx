

// sortBy = current sort field ('', 'price', 'rating', 'title')
// order = 'asc' or 'desc'
// onChange = callback fired with { sortBy, order } when user picks a new option

const SortControl = ({ sortBy, order, onChange }) => {


  // We combine sortBy+order into a single dropdown value like "price-asc"
  // for a simpler single-select UI, then split it back apart when it changes
  const currentValue = sortBy ? `${sortBy}-${order}` : ''

  const handleChange = (e) => {
    const val = e.target.value

    if (val === '') {
      onChange({ sortBy: '', order: 'asc' }) // "No sorting" option selected
      return
    }

    const [newSortBy, newOrder] = val.split('-')
    onChange({ sortBy: newSortBy, order: newOrder })
  }


  return (
    <select
      value={currentValue}
      onChange={handleChange}
      className="border rounded px-2 py-2 text-sm"
    >
      <option value="">Sort: Default</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
      <option value="rating-asc">Rating: Low to High</option>
      <option value="rating-desc">Rating: High to Low</option>
      <option value="title-asc">Title: A to Z</option>
      <option value="title-desc">Title: Z to A</option>
    </select>
  )
}

export default SortControl
