// Calculates the "Showing X-Y of Z" text values

export const getShowingRange = (page, limit, total, currentCount = null) => {
  if (total === 0 || (currentCount !== null && currentCount === 0)) {
    return { start: 0, end: 0, total: 0 }
  }

  const start = Math.min((page - 1) * limit + 1, total)
  const end = currentCount !== null
    ? Math.min(start + currentCount - 1, total)
    : Math.min(page * limit, total)

  return { start: Math.max(1, start), end: Math.max(start, end), total }
}

// Generates an array of page numbers to display.
// For large totals, we don't want to show ALL page numbers (e.g. 1 to 50) —
// so we show a limited "window" around the current page.
export const getPageNumbers = (currentPage, totalPages, windowSize = 2) => {
  const pages = []

  const start = Math.max(1, currentPage - windowSize)
  const end = Math.min(totalPages, currentPage + windowSize)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
}