import { useContext, useState, createContext } from "react";


const AuthContext = createContext()

//Create a Provider component - this wraps our whole app and actually holds the state + logic
export function AuthProvider({ children }){

    // We initialize isLoggedIn by checking if a token already exists in localStorage. This handles page refresh - if user refreshes, they shouldn't be logged out
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return !!localStorage.getItem('token')
    })

    const [user, setUser] = useState(() =>{
        const savedUser = localStorage.getItem('user')
        return savedUser ? JSON.parse(savedUser) : null
    })

    // This function will be called after successful login API call
    const login = (token, userData) =>{
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(userData))
        setIsLoggedIn(true)
        setUser(userData)
    }


    // This function will be called when user clicks logout
    const logout = () =>{
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setIsLoggedIn(false)
        setUser(null)
    }


    return (
        <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}


//Custom hook to use this context easily in any component. Instead of writing useContext(AuthContext) everywhere, we just write useAuth()
export function useAuth(){
    return useContext(AuthContext)
}