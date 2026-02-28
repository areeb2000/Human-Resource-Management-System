import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, CheckCircle2, XCircle, Clock, TrendingUp, ArrowRight, UserPlus, CalendarCheck, Activity } from 'lucide-react';
import Layout from '../components/Layout';
import api from '../services/api';

/* ── Stat Card ── */
const StatCard = ({ label, value, icon: Icon, iconColor, borderColor, loading }) => (
    <div className="glass-card p-5 flex items-center gap-4 transition-all duration-300 hover:translate-y-[-2px]"
        style={{ borderLeft: `3px solid ${borderColor}` }}>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${iconColor}18` }}>
            <Icon size={22} style={{ color: iconColor }} />
        </div>
        <div>
            {loading ? (
                <div className="h-8 w-12 rounded-lg animate-pulse" style={{ background: 'rgba(255,255,255,0.1)' }} />
            ) : (
                <p className="text-3xl font-extrabold text-white leading-none">{value}</p>
            )}
            <p className="text-slate-400 text-sm mt-1">{label}</p>
        </div>
    </div>
);

/* ── Quick Action Card ── */
const ActionCard = ({ to, icon: Icon, iconBg, title, desc }) => (
    <Link to={to} className="glass-card p-5 flex items-center gap-4 group transition-all duration-300 hover:translate-y-[-2px] cursor-pointer">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
            style={{ background: iconBg }}>
            <Icon size={22} className="text-white" />
        </div>
        <div className="flex-1">
            <p className="font-semibold text-white text-sm mb-0.5">{title}</p>
            <p className="text-xs text-slate-500">{desc}</p>
        </div>
        <ArrowRight size={16} className="text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all duration-200" />
    </Link>
);

const Dashboard = () => {
    const [stats, setStats] = useState({ total_employees: 0, present_today: 0, absent_today: 0, not_marked_today: 0 });
    const [recentAttendance, setRecentAttendance] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [statsRes, attRes] = await Promise.all([
                    api.get('attendance/dashboard_stats/'),
                    api.get('attendance/'),
                ]);
                setStats(statsRes.data);
                const today = new Date().toISOString().split('T')[0];
                setRecentAttendance(attRes.data.filter(r => r.date === today).slice(0, 6));
            } catch (err) {
                console.error('Dashboard load error:', err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const attendanceRate = stats.total_employees > 0
        ? Math.round((stats.present_today / stats.total_employees) * 100) : 0;

    const rateColor = attendanceRate >= 75 ? '#10b981' : attendanceRate >= 50 ? '#f59e0b' : '#ef4444';
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

    return (
        <Layout>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-white">Dashboard</h1>
                <p className="text-slate-400 text-sm mt-1 flex items-center gap-1.5">
                    <Activity size={13} /> {today}
                </p>
            </div>

            {/* ── Stat Cards Row ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard label="Total Employees" value={stats.total_employees} icon={Users}
                    iconColor="#818cf8" borderColor="#6366f1" loading={loading} />
                <StatCard label="Present Today" value={stats.present_today} icon={CheckCircle2}
                    iconColor="#34d399" borderColor="#10b981" loading={loading} />
                <StatCard label="Absent Today" value={stats.absent_today} icon={XCircle}
                    iconColor="#f87171" borderColor="#ef4444" loading={loading} />
                <StatCard label="Not Marked" value={stats.not_marked_today} icon={Clock}
                    iconColor="#fbbf24" borderColor="#f59e0b" loading={loading} />
            </div>

            {/* ── Attendance Rate + Today's Activity ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">

                {/* Attendance Rate */}
                <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                            <TrendingUp size={17} style={{ color: rateColor }} />
                            <h3 className="font-bold text-white text-sm">Today's Attendance Rate</h3>
                        </div>
                        <span className="text-2xl font-extrabold" style={{ color: rateColor }}>{attendanceRate}%</span>
                    </div>

                    {/* Progress bar */}
                    <div className="rounded-full h-3 overflow-hidden mb-3" style={{ background: 'rgba(255,255,255,0.08)' }}>
                        <div className="h-3 rounded-full transition-all duration-1000"
                            style={{ width: `${attendanceRate}%`, background: `linear-gradient(90deg, ${rateColor}99, ${rateColor})` }} />
                    </div>
                    <div className="flex justify-between text-xs text-slate-500">
                        <span>{stats.present_today} Present</span>
                        <span>{stats.total_employees} Total</span>
                    </div>

                    {/* Status badges */}
                    <div className="flex gap-2 mt-4">
                        {[
                            { label: 'Present', val: stats.present_today, color: '#34d399', bg: 'rgba(16,185,129,0.12)' },
                            { label: 'Absent', val: stats.absent_today, color: '#f87171', bg: 'rgba(239,68,68,0.12)' },
                            { label: 'Not Marked', val: stats.not_marked_today, color: '#fbbf24', bg: 'rgba(245,158,11,0.12)' },
                        ].map(b => (
                            <div key={b.label} className="flex-1 rounded-lg py-2 text-center"
                                style={{ background: b.bg, border: `1px solid ${b.color}25` }}>
                                <p className="text-lg font-bold" style={{ color: b.color }}>{b.val}</p>
                                <p className="text-xs" style={{ color: `${b.color}99` }}>{b.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Today's Activity */}
                <div className="glass-card p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <CalendarCheck size={17} className="text-indigo-400" />
                        <h3 className="font-bold text-white text-sm">Today's Activity</h3>
                        {recentAttendance.length > 0 && (
                            <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-medium"
                                style={{ background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.2)' }}>
                                {recentAttendance.length} marked
                            </span>
                        )}
                    </div>
                    {recentAttendance.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-slate-600">
                            <CalendarCheck size={32} className="mb-2 opacity-20" />
                            <p className="text-sm">No attendance marked today yet.</p>
                            <Link to="/attendance" className="text-xs text-indigo-400 hover:text-indigo-300 mt-2 transition-colors">
                                Mark attendance →
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {recentAttendance.map(r => (
                                <div key={r.id} className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors"
                                    style={{ background: 'rgba(255,255,255,0.03)' }}>
                                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-indigo-300 flex-shrink-0"
                                        style={{ background: 'rgba(99,102,241,0.2)' }}>
                                        {r.employee_name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white truncate">{r.employee_name}</p>
                                        <p className="text-xs text-slate-500 font-mono">{r.employee_emp_id}</p>
                                    </div>
                                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold flex-shrink-0 ${r.status === 'Present' ? 'status-present' : 'status-absent'}`}>
                                        {r.status === 'Present' ? '✓ Present' : '✗ Absent'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Quick Actions ── */}
            <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Quick Actions</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ActionCard to="/employees" icon={UserPlus} iconBg="linear-gradient(135deg,#4f46e5,#7c3aed)"
                        title="Manage Employees" desc="Add, view, or remove employee records" />
                    <ActionCard to="/attendance" icon={CalendarCheck} iconBg="linear-gradient(135deg,#065f46,#047857)"
                        title="Track Attendance" desc="Mark daily attendance and view history" />
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
