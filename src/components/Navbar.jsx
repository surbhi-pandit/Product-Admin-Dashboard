import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"



const Navbar = () => {
    
    const { isLoggedIn, logout, user } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    if(!isLoggedIn) return null


  return (
    <nav className='flex justify-between items-center p-4 bg-white shadow'>
        <span className='font-semibold'>Hi, {user?.username} </span>
        <button onClick={handleLogout} className='bg-red-500 text-white px-4 py-2 rounded'> Logout </button>
    </nav>
  )
}

export default Navbar
