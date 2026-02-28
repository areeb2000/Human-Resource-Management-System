import React, { useState, useEffect, useCallback } from 'react';
import {
    getEmployees, getAttendance, markAttendance,
    updateAttendance, getAttendanceStatistics
} from '../services/api';
import Layout from '../components/Layout';
import CustomSelect from '../components/CustomSelect';
import {
    CheckCircle2, XCircle, Filter, BarChart3, CalendarCheck,
    RefreshCw, X, AlertCircle, Search, Pencil, Save, Clock
} from 'lucide-react';

/* ── Editable Row ─────────────────────────────────────── */
const EditableRow = ({ rec, onSave, onCancel }) => {
    const [newStatus, setNewStatus] = useState(rec.status);
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        await onSave(rec.id, newStatus);
        setSaving(false);
    };

    return (
        <tr style={{ background: 'rgba(99,102,241,0.08)', borderBottom: '1px solid rgba(99,102,241,0.2)' }}>
            <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-indigo-300 text-xs font-bold flex-shrink-0"
                        style={{ background: 'rgba(99,102,241,0.25)' }}>
                        {rec.employee_name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-white text-sm">{rec.employee_name}</span>
                </div>
            </td>
            <td className="px-5 py-4">
                <span className="font-mono text-xs text-indigo-300 px-2 py-1 rounded-lg"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    #{rec.employee_emp_id}
                </span>
            </td>
            <td className="px-5 py-4"><span className="badge-dept">{rec.employee_department || '—'}</span></td>
            <td className="px-5 py-4 text-slate-400 text-sm">
                {new Date(rec.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </td>
            <td className="px-5 py-4">
                <div className="flex items-center gap-2">
                    {['Present', 'Absent'].map(s => (
                        <button
                            key={s}
                            type="button"
                            onClick={() => setNewStatus(s)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150"
                            style={{
                                background: newStatus === s
                                    ? s === 'Present' ? '#059669' : '#dc2626'
                                    : 'rgba(255,255,255,0.06)',
                                color: newStatus === s ? '#fff' : '#94a3b8',
                                border: '1px solid transparent',
                            }}
                        >
                            {s === 'Present' ? <CheckCircle2 size={11} /> : <XCircle size={11} />} {s}
                        </button>
                    ))}
                </div>
            </td>
            <td className="px-5 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                    <button onClick={handleSave} disabled={saving}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors disabled:opacity-50">
                        {saving ? <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={11} />}
                        Save
                    </button>
                    <button onClick={onCancel}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white transition-colors"
                        style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <X size={11} /> Cancel
                    </button>
                </div>
            </td>
        </tr>
    );
};

/* ── Record Row ───────────────────────────────────────────────── */
const RecordRow = ({ rec, onEdit }) => (
    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        className="hover:bg-white/[0.02] transition-colors duration-100">
        <td className="px-5 py-4">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-indigo-300 text-xs font-bold flex-shrink-0"
                    style={{ background: 'rgba(99,102,241,0.2)' }}>
                    {rec.employee_name?.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-white text-sm">{rec.employee_name}</span>
            </div>
        </td>
        <td className="px-5 py-4">
            <span className="font-mono text-xs text-indigo-300 px-2 py-1 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                #{rec.employee_emp_id}
            </span>
        </td>
        <td className="px-5 py-4"><span className="badge-dept">{rec.employee_department || '—'}</span></td>
        <td className="px-5 py-4 text-slate-400 text-sm">
            {new Date(rec.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </td>
        <td className="px-5 py-4">
            <span className={rec.status === 'Present' ? 'status-present' : 'status-absent'}>
                {rec.status === 'Present' ? '✓ Present' : '✗ Absent'}
            </span>
        </td>
        <td className="px-5 py-4 text-right">
            <button onClick={() => onEdit(rec.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-indigo-300 transition-all duration-150"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <Pencil size={11} /> Edit
            </button>
        </td>
    </tr>
);

/* ── Stat Summary Card ─────────────────────────────────── */
const MiniStat = ({ label, value, color }) => (
    <div className="text-center px-4 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <p className="text-2xl font-bold" style={{ color }}>{value}</p>
        <p className="text-xs text-slate-500 mt-0.5">{label}</p>
    </div>
);

/* ── Main Component ───────────────────────────────────── */
const Attendance = () => {
    const [employees, setEmployees] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [statistics, setStatistics] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendanceStatus, setAttendanceStatus] = useState('Present');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [activeTab, setActiveTab] = useState('records');
    const [filterEmployee, setFilterEmployee] = useState('');
    const [filterStartDate, setFilterStartDate] = useState('');
    const [filterEndDate, setFilterEndDate] = useState('');

    const showMessage = useCallback((text, type = 'success') => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 4000);
    }, []);

    const fetchAll = useCallback(async (filters = {}) => {
        const params = {};
        if (filters.employee_id) params.employee_id = filters.employee_id;
        if (filters.start_date) params.start_date = filters.start_date;
        if (filters.end_date) params.end_date = filters.end_date;
        const [attRes, statsRes] = await Promise.all([
            getAttendance(params), getAttendanceStatistics(params)
        ]);
        setAttendance(attRes.data);
        setStatistics(statsRes.data);
    }, []);

    useEffect(() => {
        const init = async () => {
            try {
                const [empRes, attRes, statsRes] = await Promise.all([
                    getEmployees(), getAttendance(), getAttendanceStatistics()
                ]);
                setEmployees(empRes.data);
                setAttendance(attRes.data);
                setStatistics(statsRes.data);
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        init();
    }, []);

    // Build options for CustomSelect
    const employeeOptions = [
        { value: '', label: 'All Employees' },
        ...employees.map(e => ({ value: String(e.id), label: `${e.full_name} — ${e.employee_id}` }))
    ];
    const markEmployeeOptions = employees.map(e => ({
        value: String(e.id),
        label: `${e.full_name} (${e.employee_id})`
    }));

    const handleMarkAttendance = async (e) => {
        e.preventDefault();
        if (!selectedEmployee) { showMessage('Please select an employee.', 'error'); return; }
        setSubmitting(true);
        try {
            await markAttendance({ employee: selectedEmployee, date, status: attendanceStatus });
            showMessage(`Attendance marked as ${attendanceStatus}!`, 'success');
            fetchAll({ employee_id: filterEmployee, start_date: filterStartDate, end_date: filterEndDate });
        } catch (err) {
            const d = err.response?.data;
            showMessage(d?.non_field_errors?.[0] || d?.date?.[0] || d?.employee?.[0] || 'Failed to mark attendance.', 'error');
        } finally { setSubmitting(false); }
    };

    const handleUpdateAttendance = async (id, newStatus) => {
        try {
            await updateAttendance(id, { status: newStatus });
            showMessage('Attendance updated!', 'success');
            setEditingId(null);
            fetchAll({ employee_id: filterEmployee, start_date: filterStartDate, end_date: filterEndDate });
        } catch (err) {
            const d = err.response?.data;
            showMessage(d?.detail || d?.non_field_errors?.[0] || 'Update failed.', 'error');
        }
    };

    const today = new Date().toISOString().split('T')[0];
    const todayPresent = attendance.filter(r => r.date === today && r.status === 'Present').length;
    const todayAbsent = attendance.filter(r => r.date === today && r.status === 'Absent').length;

    return (
        <Layout>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Attendance</h1>
                <p className="text-slate-400 text-sm mt-1">Mark, track and update daily employee attendance</p>
            </div>

            {/* Global alert */}
            {message.text && (
                <div className={`${message.type === 'success' ? 'alert-success' : 'alert-error'} flex items-center gap-2 mb-5 animate-fadein`}>
                    {message.type === 'success' ? <CheckCircle2 size={15} className="flex-shrink-0" /> : <AlertCircle size={15} className="flex-shrink-0" />}
                    <span className="flex-1 text-sm">{message.text}</span>
                    <button onClick={() => setMessage({ text: '', type: '' })} className="opacity-60 hover:opacity-100"><X size={14} /></button>
                </div>
            )}

            {/* ── Mark Attendance Card ── */}
            <div className="glass-card p-6 mb-5">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.2)' }}>
                        <CalendarCheck size={18} className="text-indigo-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white">Mark Attendance</h2>
                        <p className="text-xs text-slate-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                    {/* Today's mini stats */}
                    <div className="ml-auto hidden sm:flex gap-3">
                        <MiniStat label="Present Today" value={todayPresent} color="#34d399" />
                        <MiniStat label="Absent Today" value={todayAbsent} color="#f87171" />
                    </div>
                </div>

                <form onSubmit={handleMarkAttendance}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                        {/* Employee */}
                        <div>
                            <label className="form-label">Employee <span className="text-rose-400">*</span></label>
                            <CustomSelect
                                options={markEmployeeOptions}
                                value={selectedEmployee}
                                onChange={val => setSelectedEmployee(val)}
                                placeholder="Select employee…"
                            />
                        </div>
                        {/* Date */}
                        <div>
                            <label className="form-label">Date <span className="text-rose-400">*</span></label>
                            <input type="date" value={date} max={today}
                                onChange={e => setDate(e.target.value)} className="form-input" required />
                        </div>
                        {/* Status */}
                        <div>
                            <label className="form-label">Status</label>
                            <div className="flex gap-2 h-[46px]">
                                {['Present', 'Absent'].map(s => (
                                    <button key={s} type="button" onClick={() => setAttendanceStatus(s)}
                                        className="flex-1 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-1.5"
                                        style={{
                                            background: attendanceStatus === s
                                                ? s === 'Present' ? '#059669' : '#dc2626'
                                                : 'rgba(255,255,255,0.05)',
                                            border: attendanceStatus === s ? 'none' : '1px solid rgba(255,255,255,0.1)',
                                            color: attendanceStatus === s ? '#fff' : '#94a3b8',
                                        }}>
                                        {s === 'Present' ? <CheckCircle2 size={15} /> : <XCircle size={15} />} {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {/* Submit */}
                        <div className="flex items-end">
                            <button type="submit" disabled={submitting}
                                className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                                {submitting
                                    ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving…</>
                                    : <><CalendarCheck size={16} />Mark Attendance</>}
                            </button>
                        </div>
                    </div>
                    <p className="text-xs text-slate-600 flex items-center gap-1.5">
                        <Clock size={11} /> To change an existing record, use the <strong className="text-slate-500">Edit</strong> button in the Records table below.
                    </p>
                </form>
            </div>

            {/* ── Filters ── */}
            <div className="glass-card p-5 mb-5">
                <div className="flex items-center gap-2 mb-3">
                    <Filter size={14} className="text-slate-500" />
                    <span className="text-sm font-semibold text-slate-300">Filter Records</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <CustomSelect
                        options={employeeOptions}
                        value={filterEmployee}
                        onChange={val => setFilterEmployee(val === '' ? '' : val)}
                        placeholder="All Employees"
                    />
                    <div>
                        <input type="date" value={filterStartDate}
                            onChange={e => setFilterStartDate(e.target.value)}
                            className="form-input text-sm py-2.5" />
                    </div>
                    <div>
                        <input type="date" value={filterEndDate}
                            onChange={e => setFilterEndDate(e.target.value)}
                            className="form-input text-sm py-2.5" />
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => fetchAll({ employee_id: filterEmployee, start_date: filterStartDate, end_date: filterEndDate })}
                            className="btn-primary flex-1 justify-center text-xs py-2.5">
                            <Search size={13} /> Apply
                        </button>
                        <button onClick={() => { setFilterEmployee(''); setFilterStartDate(''); setFilterEndDate(''); fetchAll(); }}
                            className="btn-ghost flex-1 justify-center text-xs py-2.5">
                            <RefreshCw size={13} /> Reset
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Tabs ── */}
            <div className="flex items-center gap-1 mb-4 p-1 rounded-xl w-fit" style={{ background: 'rgba(255,255,255,0.04)' }}>
                {[
                    { key: 'records', emoji: '📋', label: `Records (${attendance.length})` },
                    { key: 'stats', emoji: '📊', label: `Statistics (${statistics.length})` },
                ].map(t => (
                    <button key={t.key} onClick={() => setActiveTab(t.key)}
                        className="px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                        style={{
                            background: activeTab === t.key ? '#4f46e5' : 'transparent',
                            color: activeTab === t.key ? '#fff' : '#94a3b8',
                        }}>
                        {t.emoji} {t.label}
                    </button>
                ))}
            </div>

            {/* ── Records Table ── */}
            {activeTab === 'records' && (
                <div className="glass-card overflow-hidden animate-fadein">
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : attendance.length === 0 ? (
                        <div className="py-16 text-center text-slate-500">
                            <CalendarCheck size={36} className="mx-auto mb-3 opacity-20" />
                            <p className="text-sm">No attendance records found.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                        {['Employee', 'Emp ID', 'Department', 'Date', 'Status', 'Action'].map((h, i) => (
                                            <th key={h} className={`px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider ${i === 5 ? 'text-right' : 'text-left'}`}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendance.map(rec =>
                                        editingId === rec.id
                                            ? <EditableRow key={rec.id} rec={rec} onSave={handleUpdateAttendance} onCancel={() => setEditingId(null)} />
                                            : <RecordRow key={rec.id} rec={rec} onEdit={id => setEditingId(id)} />
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* ── Stats Table ── */}
            {activeTab === 'stats' && (
                <div className="glass-card overflow-hidden animate-fadein">
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : statistics.length === 0 ? (
                        <div className="py-16 text-center text-slate-500">
                            <BarChart3 size={36} className="mx-auto mb-3 opacity-20" />
                            <p className="text-sm">No statistics available yet.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                        <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Employee</th>
                                        <th className="px-5 py-3.5 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider w-28">Total</th>
                                        <th className="px-5 py-3.5 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider w-24">Present</th>
                                        <th className="px-5 py-3.5 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider w-24">Absent</th>
                                        <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-52">Attendance Rate</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {statistics.map(stat => {
                                        const rate = stat.total_days > 0 ? Math.round((stat.present_days / stat.total_days) * 100) : 0;
                                        const barColor = rate >= 75 ? '#10b981' : rate >= 50 ? '#f59e0b' : '#ef4444';
                                        return (
                                            <tr key={stat.employee__id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                                                className="hover:bg-white/[0.02] transition-colors duration-100">
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-indigo-300 flex-shrink-0"
                                                            style={{ background: 'rgba(99,102,241,0.2)' }}>
                                                            {stat.employee__full_name?.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-white text-sm">{stat.employee__full_name}</p>
                                                            <p className="text-xs text-slate-500 font-mono">#{stat.employee__employee_id} · {stat.employee__department}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 text-center font-bold text-white">{stat.total_days}</td>
                                                <td className="px-5 py-4 text-center font-bold text-emerald-400">{stat.present_days}</td>
                                                <td className="px-5 py-4 text-center font-bold text-rose-400">{stat.absent_days}</td>
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex-1 rounded-full h-2 overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                                                            <div className="h-2 rounded-full transition-all duration-700" style={{ width: `${rate}%`, background: barColor }} />
                                                        </div>
                                                        <span className="text-xs font-bold w-10 text-right" style={{ color: barColor }}>{rate}%</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </Layout>
    );
};

export default Attendance;
