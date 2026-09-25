//Shown when an API call succeeds but returns zero results.
// Example: search query that matches nothing, or empty category.
import React from 'react'

const EmptyState = ({message}) => {
  return (
    <div className='flex flex-col items-center justify-center py-10 text-gray-500'>
      <p>{message || 'No products found.'}</p>
    </div>
  )
}

export default EmptyState