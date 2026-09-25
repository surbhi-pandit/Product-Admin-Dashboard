// src/hooks/useDebounce.js

import { useState, useEffect } from 'react'

// This hook takes a fast-changing value (like search input text) and returns a "delayed" version of it that only updates after the value has stopped changing for `delay` milliseconds.
function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    // Set a timer to update debouncedValue after the delay
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // CLEANUP FUNCTION: runs before the NEXT effect execution, or when the component unmounts.
    // This is what cancels the previous timer when `value` changes again quickly.
    return () => {
      clearTimeout(timer)
    }
  }, [value, delay]) // re-run this effect every time `value` changes

  return debouncedValue
}

export default useDebounce