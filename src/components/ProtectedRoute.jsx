import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

//This component wraps around any page that should be private. It checks login status and either renders the page or redirects.
function ProtectedRoute({children}){
    const {isLoggedIn} = useAuth()

    if(!isLoggedIn){
        return <Navigate to='/login' replace/>
    }

    return children
}



export default ProtectedRoute
