
//Shows an error message with a "Retry" button.
// The parent component passes a function (onRetry) that re-triggers the failed API call.
const ErrorRetry = ({message, onRetry}) => {
  return (
    <div className='flex flex-col items-center justify-center py-10 text-center'>
      <p className='text-red-500 mb-3'>
        {message || 'Something went wrong while loading data.'}
      </p>
      <button onClick={onRetry} className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'>
        Retry
      </button>
    </div>
  )
}

export default ErrorRetry
