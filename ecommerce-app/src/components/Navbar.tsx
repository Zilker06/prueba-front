'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { onAuthChange, logout } from '@/lib/auth'
import HomeIcon from '@mui/icons-material/Home'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import StoreIcon from '@mui/icons-material/Store'

const Navbar = () => {
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const navItems = [
    { label: '', path: '/', icon: <HomeIcon /> },
    { label: 'Productos', path: '/products', icon: <StoreIcon /> },
    { label: '', path: '/cart', icon: <ShoppingCartIcon /> },
  ]

  useEffect(() => {
    const unsubscribe = onAuthChange(setUser)
    return () => unsubscribe()
  }, [])

  return (
    <nav className="bg-white shadow px-6 py-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-indigo-600">
          Ecommerce
        </Link>

        <div className="flex items-center space-x-4">
          {navItems.map(({ label, path, icon }) => (
            <Link
              key={path}
              href={path}
              className={`hover:text-indigo-600 transition flex items-center gap-2 ${
                pathname === path ? 'text-indigo-600 font-semibold' : 'text-gray-700'
              }`}
            >
              {icon}
              {label}
            </Link>
          ))}

          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100"
              >
                <span>{user.displayName || user.email?.split('@')[0]}</span>
                <span className="text-sm">▼</span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 bg-white shadow rounded w-40">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setMenuOpen(false)}
                  >
                    Perfil
                  </Link>
                  <Link
                    href="/orders" // Nueva ruta para Pedidos
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setMenuOpen(false)}
                  >
                    Pedidos
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
