/**
 * AuthContext — simple login-state store.
 *
 * Currently accepts any non-empty username + password (mock auth).
 * TODO: replace login() body with a real POST /api/auth/login call.
 *       On success the server returns a JWT; store it in httpOnly cookie
 *       or localStorage and attach it to subsequent requests via an
 *       axios interceptor or fetch wrapper.
 */
import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // null = logged out, object = logged in user
  const [user, setUser] = useState(null)

  /**
   * Mock login — accepts any non-empty credentials.
   * TODO: replace with →
   *   const res = await fetch('/api/auth/login', {
   *     method: 'POST',
   *     headers: { 'Content-Type': 'application/json' },
   *     body: JSON.stringify({ username, password }),
   *   })
   *   if (!res.ok) throw new Error('Invalid credentials')
   *   const data = await res.json()
   *   setUser(data.user)
   *
   * @param {string} username
   * @param {string} password
   * @returns {Promise<void>}
   * @throws {Error} if credentials are empty (mock validation)
   */
  async function login(username, password) {
    if (!username.trim() || !password.trim()) {
      throw new Error('Username and password are required.')
    }
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 600))
    setUser({ username, role: 'admin' })
  }

  /**
   * Logout.
   * TODO: replace with → POST /api/auth/logout (clear server-side session / cookie)
   */
  function logout() {
    setUser(null)
  }

  const isLoggedIn = user !== null

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
