import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import type { User, AuthResponse, RegisterData, LoginData } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = () => {
    const token = localStorage.getItem('accessToken')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      setUser(JSON.parse(userData))
    }
    setLoading(false)
  }

  const register = async (data: RegisterData) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed')
      }

      toast.success('Registration successful! Please login.')
      router.push('/login')
    } catch (error: any) {
      toast.error(error.message)
      throw error
    }
  }

  const login = async (data: LoginData) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Login failed')
      }

      const authResponse = result as AuthResponse

      localStorage.setItem('accessToken', authResponse.accessToken)
      localStorage.setItem('refreshToken', authResponse.refreshToken)
      localStorage.setItem('user', JSON.stringify(authResponse.user))

      setUser(authResponse.user)
      toast.success('Login successful!')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.message)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    setUser(null)
    toast.success('Logged out successfully')
    router.push('/login')
  }

  return {
    user,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!user,
  }
}