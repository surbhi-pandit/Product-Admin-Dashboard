// isOpen = whether to show the modal
// productTitle = name of the product being deleted (for a clear message)
// onConfirm = called when user confirms deletion
// onCancel = called when user backs out



const DeleteConfirmModal = ({ isOpen, productTitle, onConfirm, onCancel }) => {

    if (!isOpen) return null // render nothing if modal shouldn't be shown

  return (
    // Full-screen overlay - clicking outside the box also cancels
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onCancel}
    >
      {/* stopPropagation prevents a click INSIDE the box from bubbling up and closing it */}
      <div
        className="bg-white rounded-lg p-6 max-w-sm w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold mb-2">Delete Product</h2>
        <p className="text-gray-600 mb-4">
          Are you sure you want to delete "{productTitle}"? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmModal
