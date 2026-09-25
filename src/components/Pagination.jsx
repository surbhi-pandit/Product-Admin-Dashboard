import { getShowingRange, getPageNumbers } from '../utils/pagination'

const Pagination = ({page, limit, total, currentCount, onPageChange, onLimitChange}) => {

    const totalPages = Math.max(1, Math.ceil(total / limit))
    const {start, end} = getShowingRange(page, limit, total, currentCount)
    const pageNumbers = getPageNumbers(page, totalPages)

  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-3 mt-4 py-3">
        {/* "Showing X-Y of Z" text */}
        <p className="text-sm text-gray-600">
            Showing {start}–{end} of {total}
        </p>

        <div className="flex items-center gap-2">
            <select value={limit} onChange={(e) => onLimitChange(Number(e.target.value))} className="border rounded px-2 py-1 text-sm">
                <option value={10}>10 / page</option>
                <option value={20}>20 / page</option>
                <option value={50}>50 / page</option>
            </select>

            {/* Previous button */}
            <button onClick={() => onPageChange(page - 1)} disabled={page <= 1} className="px-3 py-1 border rounded text-sm disabled:opacity-40 disabled:cursor-not-allowed">
            Previous
            </button>

            {/* Page number buttons */}
            {pageNumbers.map((num) => (
                <button key={num} onClick={() => onPageChange(num)} className={`px-3 py-1 border rounded text-sm ${num === page ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}>
                    {num}
                </button>
            ))}

            {/* Next button */}
            <button
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
                className="px-3 py-1 border rounded text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                Next
            </button>
        </div>
    </div>
  )
}

export default Pagination
