import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';

/**
 * CustomSelect — dark dropdown rendered via ReactDOM.createPortal into document.body.
 * This escapes ALL stacking contexts (backdrop-filter, overflow, transform, etc.)
 * so the panel always appears on top of every other element on the page.
 */
const CustomSelect = ({ options = [], value, onChange, placeholder = 'Select…', className = '' }) => {
    const [open, setOpen] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
    const triggerRef = useRef(null);

    const recalc = useCallback(() => {
        if (triggerRef.current) {
            const r = triggerRef.current.getBoundingClientRect();
            setCoords({ top: r.bottom + 4, left: r.left, width: r.width });
        }
    }, []);

    const handleOpen = () => {
        recalc();
        setOpen(v => !v);
    };

    // Close on outside click or window scroll/resize
    useEffect(() => {
        if (!open) return;
        const close = (e) => {
            if (triggerRef.current && !triggerRef.current.contains(e.target)) setOpen(false);
        };
        const closeOnScroll = () => setOpen(false);
        window.addEventListener('mousedown', close);
        window.addEventListener('scroll', closeOnScroll, true);
        window.addEventListener('resize', closeOnScroll);
        return () => {
            window.removeEventListener('mousedown', close);
            window.removeEventListener('scroll', closeOnScroll, true);
            window.removeEventListener('resize', closeOnScroll);
        };
    }, [open]);

    const selected = options.find(o => String(o.value) === String(value));

    // The portal panel — rendered into document.body, bypassing all stacking contexts
    const portal = open ? ReactDOM.createPortal(
        <div
            onMouseDown={e => e.stopPropagation()} // prevent the window mousedown from closing it immediately
            style={{
                position: 'fixed',
                top: coords.top,
                left: coords.left,
                width: coords.width,
                zIndex: 99999,
                background: '#1e2640',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '0.75rem',
                maxHeight: '220px',
                overflowY: 'auto',
                boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
            }}
        >
            {options.map(opt => {
                const isSel = String(opt.value) === String(value);
                return (
                    <button
                        key={opt.value}
                        type="button"
                        onClick={() => { onChange(opt.value); setOpen(false); }}
                        className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-left"
                        style={{
                            background: isSel ? 'rgba(99,102,241,0.2)' : 'transparent',
                            color: isSel ? '#a5b4fc' : '#cbd5e1',
                            transition: 'background 0.1s',
                        }}
                        onMouseEnter={e => { if (!isSel) e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
                        onMouseLeave={e => { if (!isSel) e.currentTarget.style.background = 'transparent'; }}
                    >
                        <span className="truncate">{opt.label}</span>
                        {isSel && <Check size={13} className="text-indigo-400 flex-shrink-0 ml-2" />}
                    </button>
                );
            })}
            {options.length === 0 && (
                <p className="px-4 py-3 text-sm text-slate-500 text-center">No options</p>
            )}
        </div>,
        document.body
    ) : null;

    return (
        <div className={`relative ${className}`}>
            {/* Trigger */}
            <button
                ref={triggerRef}
                type="button"
                onClick={handleOpen}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm text-left transition-all duration-200"
                style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: open ? '1px solid rgba(99,102,241,0.6)' : '1px solid rgba(255,255,255,0.1)',
                    color: selected ? '#e2e8f0' : '#64748b',
                    boxShadow: open ? '0 0 0 3px rgba(99,102,241,0.12)' : 'none',
                }}
            >
                <span className="truncate">{selected ? selected.label : placeholder}</span>
                <ChevronDown
                    size={14}
                    className="flex-shrink-0 ml-2 text-slate-500"
                    style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                />
            </button>

            {/* Portal panel */}
            {portal}
        </div>
    );
};

export default CustomSelect;
