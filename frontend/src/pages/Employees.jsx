import React, { useState, useEffect } from 'react';
import { getEmployees, addEmployee, deleteEmployee } from '../services/api';
import Layout from '../components/Layout';
import { Trash2, Plus, Search, Users, Mail, Hash, Building, AlertCircle, X, UserPlus } from 'lucide-react';

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [toDelete, setToDelete] = useState(null);
    const [form, setForm] = useState({ employee_id: '', full_name: '', email: '', department: '' });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => { fetchEmployees(); }, []);

    useEffect(() => {
        if (!search.trim()) { setFiltered(employees); return; }
        const q = search.toLowerCase();
        setFiltered(employees.filter(e =>
            e.full_name.toLowerCase().includes(q) ||
            e.employee_id.toLowerCase().includes(q) ||
            e.email.toLowerCase().includes(q) ||
            e.department.toLowerCase().includes(q)
        ));
    }, [search, employees]);

    const fetchEmployees = async () => {
        try {
            const res = await getEmployees();
            setEmployees(res.data);
            setFiltered(res.data);
        } catch {
            setError('Failed to fetch employees.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            await addEmployee(form);
            setSuccess(`${form.full_name} has been added successfully!`);
            setForm({ employee_id: '', full_name: '', email: '', department: '' });
            setIsModalOpen(false);
            fetchEmployees();
            setTimeout(() => setSuccess(null), 4000);
        } catch (err) {
            const d = err.response?.data;
            setError(
                d?.employee_id?.[0] || d?.email?.[0] || d?.non_field_errors?.[0] ||
                'Failed to add employee. Make sure Employee ID and Email are unique.'
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!toDelete) return;
        try {
            await deleteEmployee(toDelete.id);
            setSuccess(`${toDelete.full_name} has been removed.`);
            setToDelete(null);
            fetchEmployees();
            setTimeout(() => setSuccess(null), 4000);
        } catch {
            setError('Failed to delete employee.');
            setToDelete(null);
        }
    };

    const openModal = () => { setError(null); setIsModalOpen(true); };
    const closeModal = () => { setError(null); setForm({ employee_id: '', full_name: '', email: '', department: '' }); setIsModalOpen(false); };

    return (
        <Layout>

            {/* ── Page Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Employees</h1>
                    <p className="text-slate-400 text-sm mt-1">
                        {loading ? '…' : `${employees.length} employee${employees.length !== 1 ? 's' : ''} registered`}
                    </p>
                </div>
                <button onClick={openModal} className="btn-primary flex-shrink-0">
                    <Plus size={17} /> Add Employee
                </button>
            </div>

            {/* ── Alerts ── */}
            {success && (
                <div className="alert-success flex items-center gap-2 mb-5 animate-fadein">
                    <span className="flex-1 text-sm">{success}</span>
                    <button onClick={() => setSuccess(null)} className="opacity-60 hover:opacity-100"><X size={15} /></button>
                </div>
            )}
            {error && !isModalOpen && (
                <div className="alert-error flex items-center gap-2 mb-5 animate-fadein">
                    <AlertCircle size={15} className="flex-shrink-0" />
                    <span className="flex-1 text-sm">{error}</span>
                    <button onClick={() => setError(null)} className="opacity-60 hover:opacity-100"><X size={15} /></button>
                </div>
            )}

            {/* ── Search Bar ── */}
            <div className="glass-card flex items-center gap-3 px-4 py-3 mb-5">
                <Search size={16} className="text-slate-500 flex-shrink-0" />
                <input
                    type="text"
                    placeholder="Search by name, ID, email, or department…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="bg-transparent text-slate-200 placeholder-slate-500 text-sm flex-1 focus:outline-none"
                />
                {search && (
                    <button onClick={() => setSearch('')} className="text-slate-500 hover:text-slate-300 transition-colors">
                        <X size={15} />
                    </button>
                )}
            </div>

            {/* ── Table ── */}
            <div className="glass-card overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-9 h-9 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                    <th className="table-header w-32">
                                        <div className="flex items-center gap-1.5"><Hash size={11} /> Emp ID</div>
                                    </th>
                                    <th className="table-header">
                                        <div className="flex items-center gap-1.5"><Users size={11} /> Full Name</div>
                                    </th>
                                    <th className="table-header">
                                        <div className="flex items-center gap-1.5"><Mail size={11} /> Email</div>
                                    </th>
                                    <th className="table-header w-36">
                                        <div className="flex items-center gap-1.5"><Building size={11} /> Department</div>
                                    </th>
                                    <th className="table-header w-28 text-right pr-6">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(emp => (
                                    <tr key={emp.id} className="table-row">
                                        {/* ID */}
                                        <td className="table-cell">
                                            <span className="font-mono text-xs px-2 py-1 rounded-lg text-indigo-300"
                                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                                #{emp.employee_id}
                                            </span>
                                        </td>
                                        {/* Name */}
                                        <td className="table-cell">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-indigo-300 font-bold text-sm"
                                                    style={{ background: 'rgba(99,102,241,0.2)' }}>
                                                    {emp.full_name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-white text-sm">{emp.full_name}</p>
                                                    <p className="text-xs text-slate-500">Employee</p>
                                                </div>
                                            </div>
                                        </td>
                                        {/* Email */}
                                        <td className="table-cell text-slate-400 text-sm">{emp.email}</td>
                                        {/* Department */}
                                        <td className="table-cell">
                                            <span className="badge-dept">{emp.department}</span>
                                        </td>
                                        {/* Action — right-aligned */}
                                        <td className="table-cell text-right pr-6">
                                            <button
                                                onClick={() => setToDelete(emp)}
                                                className="btn-danger text-xs inline-flex"
                                                title="Remove employee"
                                            >
                                                <Trash2 size={13} /> Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="text-center py-16 text-slate-500">
                                            <Users size={34} className="mx-auto mb-3 opacity-20" />
                                            <p className="text-sm font-medium">
                                                {search ? 'No employees match your search.' : 'No employees yet. Click "Add Employee" to get started.'}
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ── Add Employee Modal ── */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-box animate-fadein" onClick={e => e.stopPropagation()}>

                        {/* Modal header */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-indigo-600/20 flex items-center justify-center">
                                    <UserPlus size={17} className="text-indigo-400" />
                                </div>
                                <h2 className="text-lg font-bold text-white">Add New Employee</h2>
                            </div>
                            <button onClick={closeModal} className="text-slate-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5">
                                <X size={19} />
                            </button>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="alert-error mb-4 text-xs flex items-start gap-2">
                                <AlertCircle size={13} className="flex-shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="form-label">Employee ID <span className="text-rose-400">*</span></label>
                                    <input type="text" placeholder="e.g. EMP001"
                                        value={form.employee_id}
                                        onChange={e => setForm({ ...form, employee_id: e.target.value })}
                                        className="form-input text-sm" required />
                                </div>
                                <div>
                                    <label className="form-label">Department <span className="text-rose-400">*</span></label>
                                    <input type="text" placeholder="e.g. Engineering"
                                        value={form.department}
                                        onChange={e => setForm({ ...form, department: e.target.value })}
                                        className="form-input text-sm" required />
                                </div>
                            </div>
                            <div>
                                <label className="form-label">Full Name <span className="text-rose-400">*</span></label>
                                <input type="text" placeholder="e.g. John Smith"
                                    value={form.full_name}
                                    onChange={e => setForm({ ...form, full_name: e.target.value })}
                                    className="form-input text-sm" required />
                            </div>
                            <div>
                                <label className="form-label">Email Address <span className="text-rose-400">*</span></label>
                                <input type="email" placeholder="e.g. john@company.com"
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    className="form-input text-sm" required />
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 pt-1">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="btn-primary flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? (
                                        <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Adding…</>
                                    ) : (
                                        <><Plus size={16} />Add Employee</>
                                    )}
                                </button>
                                <button type="button" onClick={closeModal} className="btn-ghost px-5">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Confirm Delete Modal ── */}
            {toDelete && (
                <div className="modal-overlay" onClick={() => setToDelete(null)}>
                    <div className="modal-box animate-fadein max-w-sm text-center" onClick={e => e.stopPropagation()}>
                        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                            style={{ background: 'rgba(239,68,68,0.12)' }}>
                            <Trash2 size={24} className="text-red-400" />
                        </div>
                        <h2 className="text-lg font-bold text-white mb-2">Remove Employee</h2>
                        <p className="text-slate-400 text-sm mb-1">
                            Are you sure you want to remove{' '}
                            <span className="text-white font-semibold">{toDelete.full_name}</span>?
                        </p>
                        <p className="text-slate-500 text-xs mb-6">
                            This cannot be undone. All attendance records for this employee will also be deleted.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={handleDelete}
                                className="flex-1 py-2.5 rounded-xl font-semibold text-sm text-white transition-colors"
                                style={{ background: '#dc2626' }}
                                onMouseEnter={e => e.target.style.background = '#b91c1c'}
                                onMouseLeave={e => e.target.style.background = '#dc2626'}
                            >
                                Yes, Remove
                            </button>
                            <button onClick={() => setToDelete(null)} className="btn-ghost flex-1 text-sm justify-center">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </Layout>
    );
};

export default Employees;
