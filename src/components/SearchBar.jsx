import {useState, useEffect} from 'react'
import useDebounce from '../hooks/useDebounce'


// initialValue = current search value from URL (so input stays in sync on refresh)
// onSearchChange = callback that fires only after debounce settles

const SearchBar = ({ initialValue, onSearchChange }) => {

    // Local state for what the user is literally typing right now (updates instantly, every keystroke)
    const [inputValue, setInputValue] = useState(initialValue)

    // Debounced version - only changes 500ms after the user stops typing
    const debouncedValue = useDebounce(inputValue, 500)

    // Whenever the debounced value settles, notify the parent (ProductsPage) to update the URL
  useEffect(() => {
    // Avoid firing on initial mount if the value hasn't actually changed from the URL
    if (debouncedValue !== initialValue) {
      onSearchChange(debouncedValue)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue])

  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search products..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full md:w-80 border rounded px-3 py-2 text-sm"
      />
    </div>
  )
}

export default SearchBar
