import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { loginUser } from '../api/authApi'
import { useNavigate } from 'react-router-dom'


const LoginPage = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (loading) return

        setError('')
        setLoading(true)

        try {
            const data = await loginUser(username, password)
            login(data.accessToken, data)
            navigate('/products')
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message)
                console.error(err)
            } else {
                setError('something went wrong. Please try again.')
                console.error(err)
            }
        } finally {
            setLoading(false)
        }
    }


    return (
        <div className='flex items-center justify-center min-h-screen bg-gray-100'>
            <form onSubmit={handleSubmit} className='bg-white p-8 rounded-lg shadow-md w-80'>
                <h1 className='text-xl font-bold mb-4'>Login</h1>

                {error && (<p className='text-red-500 text-sm mb-3'>{error}</p>)}

                <input type="text" placeholder='username' value={username} onChange={(e) => setUsername(e.target.value)} className='w-full border p-2 rounded mb-3' required />

                <input type="password" placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)} className='w-full border p-2 rounded mb-3' required />

                <button type='submit' disabled={loading} className='w-full bg-blue-600 text-white p-2 rounded disabled:opacity-50'>
                    {loading ? 'Loggin in...' : 'Login'}
                </button>
            </form>
        </div>
    )
}

export default LoginPage
