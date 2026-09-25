import { useState, useEffect } from 'react'
import { getCategories } from '../api/productsApi'


// value = currently selected category (from URL)
// onChange = callback fired when user picks a new category
// disabled = true when search is active (our conflict-resolution decision)

const CategoryFilter = ({ value, onChange, disabled }) => {

    const [categories, setCategories] = useState([])


    // Fetch categories once when this component mounts - they rarely change,
    // so no need to refetch on every render or every filter change
    useEffect(() => {
        const fetchCategories = async () => {
        try {
            const data = await getCategories()
            setCategories(data)
        } catch (err) {
            // If categories fail to load, we just leave the dropdown with only "All Categories"
            // Not critical enough to show a full error screen for this
            console.error('Failed to load categories', err)
        }
        }
        fetchCategories()
    }, [])



  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      title={disabled ? 'Clear search to use category filter' : ''}
      className="border rounded px-2 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <option value="">All Categories</option>
      {categories.map((cat) => (
        <option key={cat.slug} value={cat.slug}>
          {cat.name}
        </option>
      ))}
    </select>
  )
}

export default CategoryFilter
