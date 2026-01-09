'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';
import Image from 'next/image';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-primary-600">
                {/* Portfolio CMS */}
                <Image
                  src="/logo.jpg"
                  alt="Logo"
                  width={124}
                  height={124}
                />
              </Link>

            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-md font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
              >
                Home
              </Link>

              <Link
                href="/dashboard"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-md font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
              >
                Dashboard
              </Link>

              <Link
                href="/documentation"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-md font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
              >
                Documentation
              </Link>
              {/* <Link 
                href="/features" 
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
              >
                Features
              </Link>
              <Link 
                href="/pricing" 
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
              >
                Pricing
              </Link> */}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isAuthenticated ? (
              <div className="relative ml-3">
                <div className="flex items-center space-x-4">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="text-sm font-medium text-gray-500 hover:text-gray-700"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-md font-medium text-gray-500 hover:text-gray-700"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-md font-medium rounded-md text-gray-500 hover:text-gray-700"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-opacity-25 z-40 sm:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} sm:hidden absolute top-full left-0 w-full bg-white shadow-lg z-50 border-t border-gray-200`}>
        <div className="px-4 py-3 space-y-1">
          <Link
            href="/"
            className="block py-2 text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md px-2"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/documentation"
            className="block py-2 text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md px-2"
            onClick={() => setIsOpen(false)}
          >
            Documentation
          </Link>
          {isAuthenticated && (
            <Link
              href="/dashboard"
              className="block py-2 text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md px-2"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
          )}
          
          {/* Auth section */}
          <div className="border-t border-gray-100 pt-3 mt-3">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="block w-full text-left py-2 text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md px-2"
              >
                Logout
              </button>
            ) : (
              <div className="space-y-1">
                <Link
                  href="/login"
                  className="block py-2 text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md px-2"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block py-2 text-base font-semibold text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-md px-2"
                  onClick={() => setIsOpen(false)}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}