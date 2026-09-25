//Safely reads a URL query param as a number.
// If the value is missing, or not a valid number, or invalid (like negative), 
// it falls back to a safe default instead of breaking the app.

export const getNumberParam = (searchParams, key, defaultValue) => {
    const value = searchParams.get(key)
    const parsed = parseInt(value, 10)

    // isNaN check handles cases like ?page=abc
    // parsed < 1 check handles cases like ?page=0 or ?page=-5
    if(isNaN(parsed) || parsed<1) {
        return defaultValue
    }
    return parsed
}

// Safely reads a URL query param as a string.
// Returns an empty string if missing, so components don't have to handle 'null' checks everywhere.
export const getStringParam = (searchParams, key, defaultValue = '') => {
    return searchParams.get(key) || defaultValue
}
