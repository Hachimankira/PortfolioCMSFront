'use client';

import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Award,
    GraduationCap,
    Briefcase,
    User,
    FolderOpen,
    Settings,
    MessageSquare,
    Share2,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { useState } from 'react';
import ProtectedRoute from '../components/ProtectedRoutes';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Certificates', href: '/certificates', icon: Award },
    { name: 'Education', href: '/education', icon: GraduationCap },
    { name: 'Experience', href: '/experience', icon: Briefcase },
    { name: 'Projects', href: '/projects', icon: FolderOpen },
    { name: 'Skills', href: '/skills', icon: Settings },
    { name: 'Social Links', href: '/links', icon: Share2 },
    { name: 'Testimonials', href: '/testimonials', icon: MessageSquare },
];

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <ProtectedRoute>
            <div className="h-screen flex overflow-hidden bg-gray-100">
                {/* Mobile sidebar overlay */}
                {sidebarOpen && (
                    <div className="fixed inset-0 z-40 lg:hidden">
                        <div
                            className="fixed inset-0 bg-gray-600 bg-opacity-75"
                            onClick={() => setSidebarOpen(false)}
                        />
                    </div>
                )}

                {/* Sidebar */}
                <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}>
                    <div className="flex items-center justify-between h-16 px-6 bg-primary-600">
                        <h1 className="text-xl font-bold">Portfolio CMS</h1>
                        <button
                            className="lg:hidden text-white"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <nav className="mt-8">
                        <div className="px-4 space-y-2">
                            {navigation.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${isActive
                                                ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-700'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                        onClick={() => setSidebarOpen(false)}
                                    >
                                        <item.icon className="mr-3 h-5 w-5" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <div className="px-4 space-y-2">
                                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                    Account
                                </div>
                                <button
                                    onClick={logout}
                                    className="group flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                                >
                                    <LogOut className="mr-3 h-5 w-5" />
                                    Sign out
                                </button>
                            </div>
                        </div>
                    </nav>
                </div>

                {/* Main content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Top navigation */}
                    <header className="bg-white shadow-sm border-b border-gray-200">
                        <div className="flex items-center justify-between h-16 px-6">
                            <button
                                className="lg:hidden text-gray-500 hover:text-gray-700"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <Menu className="h-6 w-6" />
                            </button>

                            <div className="flex items-center space-x-4">
                                <div className="text-sm text-gray-500">
                                    Welcome back, {user?.fullName || user?.email}
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Page content */}
                    <main className="flex-1 overflow-auto">
                        <div className="py-6 px-6">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
}