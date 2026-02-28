import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, CalendarCheck, Menu, X, Building2, ChevronRight } from 'lucide-react';

const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/employees', label: 'Employees', icon: Users },
    { path: '/attendance', label: 'Attendance', icon: CalendarCheck },
];

const Layout = ({ children }) => {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        /*
         * Root wrapper: fills the full viewport height.
         * The sidebar and main column sit side-by-side with flex.
         * Each column independently manages its own scroll.
         */
        <div className="flex h-screen overflow-hidden" style={{ background: '#0b0f1a' }}>

            {/* ── Mobile backdrop overlay ── */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ══════════════════════════════════════════════════
          SIDEBAR — always full viewport height
      ══════════════════════════════════════════════════ */}
            <aside
                className={`
          fixed inset-y-0 left-0 z-40
          w-64 flex flex-col
          transition-transform duration-300
          lg:relative lg:translate-x-0 lg:z-auto lg:flex-shrink-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
                style={{
                    background: 'linear-gradient(180deg, #0f1323 0%, #111827 60%, #0d1220 100%)',
                    borderRight: '1px solid rgba(255,255,255,0.06)',
                }}
            >
                {/* ── Logo / Brand ── */}
                <div
                    className="flex items-center gap-3 px-5 py-5 flex-shrink-0"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                >
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
                    >
                        <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="text-white font-bold text-sm tracking-wide">HRMS Lite</p>
                        <p className="text-slate-500 text-xs mt-0.5">Admin Portal</p>
                    </div>
                </div>

                {/* ── Navigation ── */}
                <nav className="flex-1 px-3 py-5 overflow-y-auto">
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest px-3 mb-4">
                        Main Menu
                    </p>

                    <div className="space-y-1">
                        {navItems.map(({ path, label, icon: Icon }) => {
                            const isActive = location.pathname === path;
                            return (
                                <Link
                                    key={path}
                                    to={path}
                                    onClick={() => setSidebarOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group"
                                    style={{
                                        background: isActive
                                            ? 'linear-gradient(135deg, rgba(79,70,229,0.25), rgba(124,58,237,0.15))'
                                            : 'transparent',
                                        border: isActive
                                            ? '1px solid rgba(99,102,241,0.25)'
                                            : '1px solid transparent',
                                        color: isActive ? '#a5b4fc' : '#64748b',
                                    }}
                                    onMouseEnter={e => {
                                        if (!isActive) {
                                            e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                                            e.currentTarget.style.color = '#94a3b8';
                                        }
                                    }}
                                    onMouseLeave={e => {
                                        if (!isActive) {
                                            e.currentTarget.style.background = 'transparent';
                                            e.currentTarget.style.color = '#64748b';
                                        }
                                    }}
                                >
                                    {/* Icon container */}
                                    <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200"
                                        style={{
                                            background: isActive ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)',
                                        }}
                                    >
                                        <Icon size={16} />
                                    </div>

                                    <span className="flex-1">{label}</span>

                                    {isActive && (
                                        <ChevronRight size={14} className="text-indigo-400 opacity-70" />
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                {/* ── Divider line ── */}
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '0 16px' }} />

                {/* ── Admin profile footer ── */}
                <div className="px-4 py-4 flex-shrink-0">
                    <div
                        className="flex items-center gap-3 p-3 rounded-xl"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                        <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-indigo-300 flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg, rgba(79,70,229,0.3), rgba(124,58,237,0.2))' }}
                        >
                            A
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-white truncate">Admin</p>
                            <p className="text-xs text-slate-500 truncate">Super Admin</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* ══════════════════════════════════════════════════
          MAIN CONTENT COLUMN
      ══════════════════════════════════════════════════ */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

                {/* Top bar — mobile hamburger */}
                <header
                    className="lg:hidden flex items-center justify-between px-4 py-4 flex-shrink-0"
                    style={{ background: '#0f1323', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
                            <Building2 className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-white font-bold text-sm">HRMS Lite</span>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </header>

                {/* Top bar — desktop (System Online only) */}
                <header
                    className="hidden lg:flex items-center justify-end px-8 py-3.5 flex-shrink-0"
                    style={{ background: 'rgba(11,15,26,0.85)', borderBottom: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)' }}
                >
                    <div
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
                        style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}
                    >
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-emerald-400 text-xs font-medium">System Online</span>
                    </div>
                </header>

                {/* Page content — scrollable */}
                <main className="flex-1 overflow-y-auto p-6 lg:p-8 animate-fadein">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
