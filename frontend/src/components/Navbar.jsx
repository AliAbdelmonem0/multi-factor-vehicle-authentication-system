import { Link, useLocation } from "react-router-dom";
import { ShieldCheck, LayoutDashboard, User, LogIn, LogOut, AlertCircle, Menu, X } from "lucide-react";
import { useAuth } from "../AuthContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="fixed w-full z-50 top-0 bg-slate-900 border-b border-white/10 shadow-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="bg-gradient-to-tr from-[var(--primary)] to-blue-500 p-2 rounded-lg text-black group-hover:shadow-[0_0_20px_rgba(0,242,234,0.5)] transition-all duration-300">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <span className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-white">
                            SmartTraffic
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-6">
                        <NavLink to="/" active={isActive('/')}>Home</NavLink>
                        <NavLink to="/stolen-cars" active={isActive('/stolen-cars')}>
                            <div className="flex items-center gap-1">
                                <AlertCircle size={16} />
                                <span>Stolen Cars</span>
                            </div>
                        </NavLink>

                        {!user ? (
                            <div className="flex items-center gap-4">
                                <Link to="/login" className="text-gray-200 hover:text-white font-bold transition-colors">
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="btn-primary text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                {user.role === "admin" && (
                                    <NavLink to="/dashboard" active={isActive('/dashboard')}>
                                        <div className="flex items-center gap-1">
                                            <LayoutDashboard size={16} />
                                            <span>Dashboard</span>
                                        </div>
                                    </NavLink>
                                )}
                                <Link
                                    to="/my-profile"
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 transition-all ${isActive('/my-profile') ? 'bg-white/10 border-white/20' : ''}`}
                                >
                                    <User size={18} className="text-[var(--primary)]" />
                                    <span className="text-sm font-medium">{user.username}</span>
                                </Link>
                                <button
                                    onClick={logout}
                                    className="p-2 text-red-400 hover:text-red-300 hover:bg-white/5 rounded-lg transition-all"
                                    title="Sign Out"
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2">
                            {isOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-[var(--card-bg)] border-b border-white/10 overflow-hidden"
                    >
                        <div className="px-4 py-4 space-y-3">
                            <MobileNavLink to="/" onClick={() => setIsOpen(false)}>Home</MobileNavLink>
                            <MobileNavLink to="/stolen-cars" onClick={() => setIsOpen(false)}>Stolen Cars</MobileNavLink>

                            {!user ? (
                                <>
                                    <MobileNavLink to="/login" onClick={() => setIsOpen(false)}>Sign In</MobileNavLink>
                                    <MobileNavLink to="/register" onClick={() => setIsOpen(false)}>Sign Up</MobileNavLink>
                                </>
                            ) : (
                                <>
                                    {user.role === "admin" && (
                                        <MobileNavLink to="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</MobileNavLink>
                                    )}
                                    <MobileNavLink to="/my-profile" onClick={() => setIsOpen(false)}>My Profile</MobileNavLink>
                                    <button
                                        onClick={() => { logout(); setIsOpen(false); }}
                                        className="w-full text-left px-4 py-3 text-base font-medium text-red-400 hover:text-red-300 hover:bg-white/5 rounded-lg flex items-center gap-2"
                                    >
                                        <LogOut size={18} />
                                        Sign Out
                                    </button>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}

const NavLink = ({ to, children, active }) => (
    <Link
        to={to}
        className={`relative px-3 py-2 text-sm font-bold tracking-wide transition-colors ${active ? 'text-cyan-400' : 'text-gray-200 hover:text-white'
            }`}
    >
        {children}
        {active && (
            <motion.div
                layoutId="navbar-underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary)] shadow-[0_0_10px_var(--primary)]"
            />
        )}
    </Link>
);

const MobileNavLink = ({ to, children, onClick }) => (
    <Link
        to={to}
        onClick={onClick}
        className="block px-4 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg"
    >
        {children}
    </Link>
);
