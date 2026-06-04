import { useState, useRef, useEffect, useCallback } from 'react';
import BackendLayout from '@/Layouts/BackendLayout';
import api from '@/api/axios';

// ─── Tipe / view database ────────────────────────────────────────────────────
const DB_TYPES = [
    {
        key: 'grid', label: 'Grid', color: 'bg-blue-100 text-blue-700',
        icon: (
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-blue-600">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
        ),
    },
    {
        key: 'calendar', label: 'Calendar', color: 'bg-orange-100 text-orange-700',
        icon: (
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-orange-500">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
        ),
    },
    {
        key: 'gallery', label: 'Gallery', color: 'bg-purple-100 text-purple-700',
        icon: (
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-purple-500">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
        ),
    },
    {
        key: 'kanban', label: 'Kanban', color: 'bg-green-100 text-green-700',
        icon: (
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-green-600">
                <path d="M2 4a1 1 0 011-1h3a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V4zm6-1a1 1 0 00-1 1v7a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1H8zm5 0a1 1 0 00-1 1v4a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3z" />
            </svg>
        ),
    },
    {
        key: 'timeline', label: 'Timeline', color: 'bg-teal-100 text-teal-700',
        icon: (
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-teal-500">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
        ),
    },
    {
        key: 'list', label: 'List', color: 'bg-sky-100 text-sky-700',
        icon: (
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-sky-500">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
        ),
    },
    {
        key: 'gantt', label: 'Gantt', color: 'bg-slate-100 text-slate-700',
        icon: (
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-slate-500">
                <path d="M2 5a1 1 0 011-1h6a1 1 0 011 1v2a1 1 0 01-1 1H3a1 1 0 01-1-1V5zm7 6a1 1 0 011-1h5a1 1 0 011 1v2a1 1 0 01-1 1h-5a1 1 0 01-1-1v-2zm-7 1a1 1 0 011-1h4a1 1 0 110 2H3a1 1 0 01-1-1z" />
            </svg>
        ),
    },
    {
        key: 'form', label: 'Form', color: 'bg-pink-100 text-pink-700',
        icon: (
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-pink-500">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
        ),
    },
];

const CARD_BG = {
    grid:     'from-blue-50   to-blue-100   dark:from-blue-950/40   dark:to-blue-900/30',
    calendar: 'from-orange-50 to-orange-100 dark:from-orange-950/40 dark:to-orange-900/30',
    gallery:  'from-purple-50 to-purple-100 dark:from-purple-950/40 dark:to-purple-900/30',
    kanban:   'from-green-50  to-green-100  dark:from-green-950/40  dark:to-green-900/30',
    timeline: 'from-teal-50   to-teal-100   dark:from-teal-950/40   dark:to-teal-900/30',
    list:     'from-sky-50    to-sky-100    dark:from-sky-950/40    dark:to-sky-900/30',
    gantt:    'from-slate-50  to-slate-100  dark:from-slate-900/60  dark:to-slate-800/40',
    form:     'from-pink-50   to-pink-100   dark:from-pink-950/40   dark:to-pink-900/30',
};

// ─── Tipe kolom lengkap ──────────────────────────────────────────────────────
const COL_TYPES = {
    // ── Teks ──
    text: {
        label: 'Single line text', group: 'Teks', color: 'text-blue-500',
        icon: <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><path d="M2 3h12v2H9v8H7V5H2V3z"/></svg>,
    },
    longtext: {
        label: 'Long text', group: 'Teks', color: 'text-blue-400',
        icon: <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><path d="M2 3h12v2H2V3zm0 4h12v2H2V7zm0 4h8v2H2v-2z"/></svg>,
    },
    email: {
        label: 'Email', group: 'Teks', color: 'text-red-400',
        icon: <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><path d="M2 3a1 1 0 00-1 1v8a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H2zm0 2.5l6 3.5 6-3.5V4L8 7.5 2 4v1.5z"/></svg>,
    },
    phone: {
        label: 'Phone number', group: 'Teks', color: 'text-green-500',
        icon: <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><path d="M3.654 1.328a.678.678 0 00-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 004.168 6.608 17.6 17.6 0 006.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 00-.063-1.015l-2.307-1.794a.678.678 0 00-.58-.122l-2.19.547a1.745 1.745 0 01-1.657-.459L5.482 8.062a1.745 1.745 0 01-.46-1.657l.548-2.19a.678.678 0 00-.122-.58L3.654 1.328z"/></svg>,
    },
    url: {
        label: 'URL', group: 'Teks', color: 'text-indigo-400',
        icon: <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><path d="M4.715 6.542L3.343 7.914a3 3 0 104.243 4.243l1.828-1.829A3 3 0 008.586 5.5L8 6.086a1.002 1.002 0 00-.154.199 2 2 0 01.861 3.337L6.88 11.45a2 2 0 11-2.83-2.83l.793-.792a4.018 4.018 0 01-.128-1.287z"/><path d="M6.586 4.672A3 3 0 007.414 9.5l.775-.776a2 2 0 01-.896-3.346L9.12 3.55a2 2 0 012.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 00-4.243-4.243L6.586 4.672z"/></svg>,
    },
    // ── Angka ──
    number: {
        label: 'Number', group: 'Angka', color: 'text-gray-600',
        icon: <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><path d="M4 1.5H3a2 2 0 00-2 2V14a2 2 0 002 2h10a2 2 0 002-2V3.5a2 2 0 00-2-2h-1v1h1a1 1 0 011 1V9H2V3.5a1 1 0 011-1h1v-1zM6 6.5a.5.5 0 01.5-.5h3a.5.5 0 010 1h-3a.5.5 0 01-.5-.5z"/></svg>,
    },
    currency: {
        label: 'Currency', group: 'Angka', color: 'text-green-600',
        icon: <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.45 0-1.895-1.225-2.798-3.142-3.233l-.536-.114V3.9c1.247.093 2.022.714 2.163 1.662h1.873c-.166-1.87-1.51-2.967-4.036-3.1V1H7.591v1.464C5.5 2.718 4.136 3.964 4.136 5.88c0 1.7 1.09 2.71 2.832 3.11l.72.168v3.393c-1.27-.136-2.13-.794-2.288-1.77H4zm2.57-6.024c0-.823.723-1.384 1.892-1.46V6.88c-1.184-.232-1.893-.733-1.893-1.603zm1.976 4.396c1.412.275 2.07.793 2.07 1.751 0 1.07-.81 1.718-2.07 1.855V9.153z"/></svg>,
    },
    percent: {
        label: 'Percent', group: 'Angka', color: 'text-orange-500',
        icon: <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><path d="M13.442 2.558a.625.625 0 010 .884l-10 10a.625.625 0 11-.884-.884l10-10a.625.625 0 01.884 0zM4.5 6a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 1a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm7 6a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 1a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"/></svg>,
    },
    rating: {
        label: 'Rating', group: 'Angka', color: 'text-yellow-500',
        icon: <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/></svg>,
    },
    // ── Pilihan ──
    select: {
        label: 'Single select', group: 'Pilihan', color: 'text-teal-500',
        icon: <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><path d="M8 15A7 7 0 108 1a7 7 0 000 14zm0 1A8 8 0 108 0a8 8 0 000 16z"/><path d="M10.97 4.97a.235.235 0 00-.02.022L7.477 9.417 5.384 7.323a.75.75 0 00-1.06 1.06L6.97 11.03a.75.75 0 001.079-.02l3.992-4.99a.75.75 0 00-1.071-1.05z"/></svg>,
    },
    multiselect: {
        label: 'Multiple select', group: 'Pilihan', color: 'text-purple-500',
        icon: <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><path d="M14 1a1 1 0 011 1v12a1 1 0 01-1 1H2a1 1 0 01-1-1V2a1 1 0 011-1h12zm-1 1H3a.5.5 0 00-.5.5v11a.5.5 0 00.5.5h10a.5.5 0 00.5-.5v-11A.5.5 0 0013 2z"/><path d="M10.97 6.47a.75.75 0 010 1.06l-3.5 3.5a.75.75 0 01-1.06 0l-1.5-1.5a.75.75 0 111.06-1.06l.97.97 2.97-2.97a.75.75 0 011.06 0z"/></svg>,
    },
    checkbox: {
        label: 'Checkbox', group: 'Pilihan', color: 'text-blue-500',
        icon: <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><path d="M2 1.5A1.5 1.5 0 013.5 0h9A1.5 1.5 0 0114 1.5v9a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 012 10.5v-9zm1.5-.5a.5.5 0 00-.5.5v9a.5.5 0 00.5.5h9a.5.5 0 00.5-.5v-9a.5.5 0 00-.5-.5h-9zm6.854 3.646a.5.5 0 010 .708l-3 3a.5.5 0 01-.708 0l-1.5-1.5a.5.5 0 11.708-.708L7 7.793l2.646-2.647a.5.5 0 01.708 0z"/></svg>,
    },
    // ── Tanggal ──
    date: {
        label: 'Date', group: 'Tanggal', color: 'text-orange-500',
        icon: <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><path d="M3.5 0a.5.5 0 01.5.5V1h8V.5a.5.5 0 011 0V1h1a2 2 0 012 2v11a2 2 0 01-2 2H2a2 2 0 01-2-2V3a2 2 0 012-2h1V.5a.5.5 0 01.5-.5zM1 4v10a1 1 0 001 1h12a1 1 0 001-1V4H1z"/></svg>,
    },
    datetime: {
        label: 'Date & time', group: 'Tanggal', color: 'text-orange-400',
        icon: <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><path d="M8 3.5a.5.5 0 00-1 0V9a.5.5 0 00.252.434l3.5 2a.5.5 0 00.496-.868L8 8.71V3.5z"/><path d="M8 16A8 8 0 108 0a8 8 0 000 16zm7-8A7 7 0 111 8a7 7 0 0114 0z"/></svg>,
    },
    // ── Otomatis ──
    autonumber: {
        label: 'Autonumber', group: 'Otomatis', color: 'text-slate-500',
        icon: <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><path d="M5.5 0a.5.5 0 01.5.5v4a.5.5 0 01-.5.5H2a.5.5 0 010-1h3V.5a.5.5 0 01.5-.5zm0 11a.5.5 0 01.5.5v4a.5.5 0 01-1 0v-4a.5.5 0 01.5-.5zm5.5 1a.5.5 0 000 1h1.5v2.5a.5.5 0 001 0V12h1.5a.5.5 0 000-1H11zm-5.5-7A.5.5 0 016 4.5v3h1.5a.5.5 0 010 1H5.5a.5.5 0 01-.5-.5V4.5a.5.5 0 01.5-.5z"/></svg>,
    },
    // ── Media ──
    image: {
        label: 'Image / Upload', group: 'Media', color: 'text-cyan-500',
        icon: <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><path d="M6.002 5.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/><path d="M2.002 1a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V3a2 2 0 00-2-2h-12zm12 1a1 1 0 011 1v6.5l-3.777-1.947a.5.5 0 00-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 00-.63.062L1.002 12V3a1 1 0 011-1h12z"/></svg>,
    },
};

const SELECT_COLORS = [
    'bg-blue-100 text-blue-700',
    'bg-green-100 text-green-700',
    'bg-orange-100 text-orange-700',
    'bg-violet-100 text-violet-700',
    'bg-red-100 text-red-600',
    'bg-yellow-100 text-yellow-700',
];

function genId() { return 'id_' + Math.random().toString(36).slice(2, 9); }

// ─── Modal buat database baru ────────────────────────────────────────────────
function CreateDbModal({ onClose, onCreate }) {
    const [name, setName] = useState('');
    const [type, setType] = useState('general');

    const submit = () => {
        if (!name.trim()) return;
        onCreate({ name: name.trim(), type });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md p-6 space-y-5">
                <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">Buat Database Baru</h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Database akan menjadi tabel data tersendiri</p>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Nama Database *</label>
                    <input value={name} onChange={e => setName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && submit()}
                        placeholder="cth: Data Customer Q1, Stok Peralatan..."
                        autoFocus
                        className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Tipe Database</label>
                    <div className="grid grid-cols-2 gap-2">
                        {DB_TYPES.map(t => (
                            <button key={t.key} onClick={() => setType(t.key)}
                                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border-2 text-left transition ${
                                    type === t.key
                                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50'
                                        : 'border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 bg-gray-50 dark:bg-gray-800'
                                }`}>
                                <span className="flex-shrink-0">{t.icon}</span>
                                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">{t.label}</p>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex gap-3 pt-1">
                    <button onClick={onClose}
                        className="flex-1 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800">
                        Batal
                    </button>
                    <button onClick={submit} disabled={!name.trim()}
                        className="flex-1 bg-indigo-600 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-indigo-700 disabled:opacity-40 transition">
                        Buat Database
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Card database di home ───────────────────────────────────────────────────
function DbCard({ db, onOpen, onDelete }) {
    const typeInfo = DB_TYPES.find(t => t.key === db.type) ?? DB_TYPES[0];
    const bg       = CARD_BG[db.type] ?? CARD_BG.general;

    return (
        <div className={`group relative bg-gradient-to-br ${bg} border border-white/60 dark:border-white/5 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer`}
            onClick={() => onOpen(db)}>
            {/* Delete button */}
            <button onClick={e => { e.stopPropagation(); onDelete(db.id); }}
                className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-100 text-red-400 transition text-xs">
                ✕
            </button>

            <div className="w-10 h-10 bg-white dark:bg-gray-800/80 rounded-xl shadow-sm flex items-center justify-center mb-3">{typeInfo.icon}</div>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-tight mb-1">{db.name}</h3>
            <div className="flex items-center gap-2 mt-2">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${typeInfo.color}`}>
                    {typeInfo.label}
                </span>
                <span className="text-[10px] text-gray-400 dark:text-gray-500">{db.rows_count ?? 0} baris</span>
            </div>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-3">Dibuat {db.createdAt}</p>

            {/* Open arrow */}
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition">
                <div className="w-7 h-7 bg-white rounded-lg shadow-sm flex items-center justify-center text-indigo-500 text-xs font-bold">→</div>
            </div>
        </div>
    );
}

// ─── Cell editor ─────────────────────────────────────────────────────────────
function RatingEditor({ value, onChange, onBlur }) {
    const [hovered, setHovered] = useState(0);
    const cur = Number(value) || 0;
    return (
        <div className="flex items-center px-2 h-full gap-0.5" onBlur={onBlur} tabIndex={0}>
            {[1,2,3,4,5].map(n => (
                <button key={n} type="button"
                    onMouseEnter={() => setHovered(n)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => { onChange(n); onBlur(); }}
                    className={`text-lg leading-none transition ${n <= (hovered || cur) ? 'text-yellow-400' : 'text-gray-200'}`}>
                    ★
                </button>
            ))}
        </div>
    );
}

// ─── Upload helper ────────────────────────────────────────────────────────────
async function uploadImage(dbId, file) {
    const fd = new FormData();
    fd.append('file', file);
    const { data } = await api.post(`/user-databases/${dbId}/upload-image`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.url;
}

// ─── Parse image value → always returns string[] ─────────────────────────────
function parseImages(val) {
    if (!val) return [];
    if (Array.isArray(val)) return val.filter(Boolean);
    if (typeof val === 'string') {
        try { const p = JSON.parse(val); if (Array.isArray(p)) return p.filter(Boolean); } catch {}
        return val ? [val] : [];
    }
    return [];
}

// ─── Image cell — standalone, supports multiple images ────────────────────────
function ImageCell({ dbId, colKey, rowId, value, onSave }) {
    const [uploading, setUploading] = useState(false);
    const inputRef = useRef(null);
    const images = parseImages(value);

    const handleFile = async (file) => {
        if (!file) return;
        setUploading(true);
        try {
            const url = await uploadImage(dbId, file);
            onSave(rowId, colKey, [...images, url]);   // append, not replace
        } catch { /* silent */ } finally { setUploading(false); }
    };

    const removeImage = (idx) => {
        const next = images.filter((_, i) => i !== idx);
        onSave(rowId, colKey, next.length ? next : null);
    };

    return (
        <div className="flex items-center gap-1 px-2 h-full w-full overflow-x-auto group/imgcell">
            {images.map((url, idx) => (
                <div key={idx} className="relative flex-shrink-0 group/thumb">
                    <img src={url} alt="" onClick={() => window.open(url, '_blank')}
                        className="h-7 w-7 object-cover rounded border border-gray-100 cursor-pointer hover:opacity-80 transition" />
                    <button onClick={() => removeImage(idx)}
                        className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-white rounded-full text-[8px] hidden group-hover/thumb:flex items-center justify-center leading-none">✕</button>
                </div>
            ))}
            {uploading
                ? <span className="w-3.5 h-3.5 border border-cyan-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                : <button onClick={() => inputRef.current?.click()}
                    title="Tambah gambar"
                    className={`flex items-center justify-center w-7 h-7 rounded border border-dashed transition flex-shrink-0
                        ${images.length
                            ? 'opacity-0 group-hover/imgcell:opacity-100 border-gray-200 text-gray-300 hover:border-cyan-400 hover:text-cyan-500'
                            : 'border-gray-200 text-gray-300 hover:border-cyan-400 hover:text-cyan-500'}`}>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
                    </svg>
                </button>
            }
            <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
                onChange={e => { [...(e.target.files ?? [])].forEach(f => handleFile(f)); }} />
        </div>
    );
}

// ─── Image uploader — drawer & form (full mode, multi-image) ─────────────────
function ImageUploader({ dbId, value, onChange }) {
    const [uploading, setUploading] = useState(false);
    const inputRef = useRef(null);
    const images = parseImages(value);

    const handleFiles = async (files) => {
        if (!files?.length) return;
        setUploading(true);
        try {
            const urls = await Promise.all([...files].map(f => uploadImage(dbId, f)));
            onChange([...images, ...urls]);
        } catch { /* silent */ } finally { setUploading(false); }
    };

    const remove = (idx) => {
        const next = images.filter((_, i) => i !== idx);
        onChange(next.length ? next : null);
    };

    return (
        <div className="space-y-2">
            {images.length > 0 && (
                <div className="space-y-3">
                    {images.map((url, idx) => (
                        <div key={idx} className="relative group/img rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 h-64 w-full">
                            <img src={url} alt="" className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition"
                                onClick={() => window.open(url, '_blank')} />
                            <button onClick={() => remove(idx)}
                                className="absolute top-3 right-3 w-9 h-9 bg-black/60 hover:bg-red-500 text-white rounded-full flex items-center justify-center text-sm opacity-0 group-hover/img:opacity-100 transition shadow-lg">✕</button>
                        </div>
                    ))}
                </div>
            )}
            <button onClick={() => inputRef.current?.click()} disabled={uploading}
                className="w-full flex flex-col items-center justify-center gap-4 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/20 text-gray-400 dark:text-gray-500 hover:text-cyan-600 py-10 rounded-2xl transition">
                {uploading ? (
                    <>
                        <span className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-base font-medium">Mengupload...</span>
                    </>
                ) : (
                    <>
                        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                        </svg>
                        <div className="text-center">
                            <p className="font-bold text-gray-600 dark:text-gray-300 text-lg">{images.length ? 'Tambah gambar lagi' : 'Upload gambar'}</p>
                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Atau drag & drop di sini</p>
                        </div>
                    </>
                )}
            </button>
            <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
                onChange={e => handleFiles(e.target.files)} />
        </div>
    );
}

function CellEditor({ col, value, onChange, onBlur }) {
    const ref = useRef(null);
    useEffect(() => { ref.current?.focus?.(); }, []);

    if (col.type === 'select') {
        return (
            <select ref={ref} value={value} onChange={e => onChange(e.target.value)} onBlur={onBlur}
                className="w-full h-full px-2 text-sm bg-indigo-50 dark:bg-indigo-950 dark:text-white border-0 outline-none rounded">
                <option value="">—</option>
                {col.options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
        );
    }
    if (col.type === 'multiselect') {
        const selected = value ? String(value).split(',').map(s => s.trim()).filter(Boolean) : [];
        const toggle = (opt) => {
            const next = selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt];
            onChange(next.join(', '));
        };
        return (
            <div ref={ref} tabIndex={0} onBlur={onBlur}
                className="flex flex-wrap gap-1 px-2 py-1 bg-indigo-50 min-h-full items-center">
                {col.options.map((o, i) => (
                    <button key={o} type="button" onClick={() => toggle(o)}
                        className={`text-[11px] px-2 py-0.5 rounded-full font-medium transition ${
                            selected.includes(o)
                                ? SELECT_COLORS[i % SELECT_COLORS.length]
                                : 'bg-gray-200 text-gray-500'
                        }`}>
                        {o}
                    </button>
                ))}
            </div>
        );
    }
    if (col.type === 'checkbox') {
        return (
            <div className="flex items-center justify-center h-full">
                <input ref={ref} type="checkbox" checked={!!value} onChange={e => { onChange(e.target.checked); onBlur(); }}
                    className="w-4 h-4 rounded text-indigo-600 cursor-pointer" />
            </div>
        );
    }
    if (col.type === 'rating') {
        return <RatingEditor value={value} onChange={onChange} onBlur={onBlur} />;
    }
    if (col.type === 'longtext') {
        return (
            <textarea ref={ref} value={value} onChange={e => onChange(e.target.value)} onBlur={onBlur} rows={3}
                className="w-full px-2 py-1 text-sm bg-indigo-50 border-0 outline-none resize-none" />
        );
    }
    const inputType = col.type === 'date' ? 'date'
        : col.type === 'datetime' ? 'datetime-local'
        : col.type === 'number' || col.type === 'currency' || col.type === 'percent' ? 'number'
        : col.type === 'email' ? 'email'
        : col.type === 'url' ? 'url'
        : col.type === 'phone' ? 'tel'
        : 'text';
    return (
        <input ref={ref} type={inputType} value={value} onChange={e => onChange(e.target.value)} onBlur={onBlur}
            className="w-full h-full px-2 text-sm bg-indigo-50 dark:bg-indigo-950 dark:text-white border-0 outline-none" />
    );
}

function SelectBadge({ value, options }) {
    const idx = options.indexOf(value);
    const cls = idx >= 0 ? SELECT_COLORS[idx % SELECT_COLORS.length] : 'bg-gray-100 text-gray-500';
    return value ? <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${cls}`}>{value}</span> : null;
}

// ─── Modal tambah kolom — Airtable-style ─────────────────────────────────────
const COL_GROUPS = ['Teks', 'Angka', 'Pilihan', 'Tanggal', 'Media', 'Otomatis'];

function AddColModal({ onClose, onAdd }) {
    const [step,       setStep]       = useState('pick');
    const [type,       setType]       = useState(null);
    const [label,      setLabel]      = useState('');
    const [opts,       setOpts]       = useState('');
    const [search,     setSearch]     = useState('');
    const [showInForm, setShowInForm] = useState(true);

    const pick = (key) => {
        setType(key);
        setLabel(COL_TYPES[key].label);
        setStep('config');
    };

    const submit = () => {
        if (!label.trim() || !type) return;
        onAdd({
            label: label.trim(),
            type,
            options: (type === 'select' || type === 'multiselect')
                ? opts.split(',').map(o => o.trim()).filter(Boolean)
                : [],
            show_in_form: showInForm,
        });
        onClose();
    };

    const filtered = Object.entries(COL_TYPES).filter(([, v]) =>
        v.label.toLowerCase().includes(search.toLowerCase()) ||
        v.group.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-80 flex flex-col max-h-[80vh]">

                {step === 'pick' ? (
                    <>
                        <div className="px-4 pt-4 pb-2">
                            <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-3">Pilih Tipe Kolom</h3>
                            <input value={search} onChange={e => setSearch(e.target.value)}
                                placeholder="Cari tipe..."
                                className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                        </div>
                        <div className="overflow-y-auto flex-1 px-2 pb-3">
                            {COL_GROUPS.map(group => {
                                const items = filtered.filter(([, v]) => v.group === group);
                                if (!items.length) return null;
                                return (
                                    <div key={group}>
                                        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-2 pt-3 pb-1">{group}</p>
                                        {items.map(([key, v]) => (
                                            <button key={key} onClick={() => pick(key)}
                                                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-700 text-left transition group">
                                                <span className={`flex-shrink-0 ${v.color}`}>{v.icon}</span>
                                                <span className="text-sm text-gray-700 dark:text-gray-200 group-hover:text-indigo-700 dark:group-hover:text-indigo-400">{v.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800">
                            <button onClick={onClose} className="w-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800">Batal</button>
                        </div>
                    </>
                ) : (
                    <div className="p-5 space-y-4">
                        <div className="flex items-center gap-2">
                            <button onClick={() => setStep('pick')} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
                            </button>
                            <span className={`flex-shrink-0 ${COL_TYPES[type]?.color}`}>{COL_TYPES[type]?.icon}</span>
                            <h3 className="font-bold text-gray-900 dark:text-white text-sm">{COL_TYPES[type]?.label}</h3>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Nama Kolom</label>
                            <input value={label} onChange={e => setLabel(e.target.value)} autoFocus
                                onKeyDown={e => e.key === 'Enter' && submit()}
                                className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                        </div>
                        {(type === 'select' || type === 'multiselect') && (
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Opsi (pisah dengan koma)</label>
                                <input value={opts} onChange={e => setOpts(e.target.value)}
                                    placeholder="Hot Lead, Booked, Done"
                                    className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                            </div>
                        )}
                        {type === 'rating' && (
                            <p className="text-xs text-gray-400 dark:text-gray-500">Nilai 1–5 bintang, bisa diedit langsung di cell.</p>
                        )}
                        {/* Show in form toggle */}
                        <button type="button" onClick={() => setShowInForm(v => !v)}
                            className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                            <div className="text-left">
                                <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">Tampilkan di Form</p>
                                <p className="text-[10px] text-gray-400 dark:text-gray-500">Kolom ini muncul di form view</p>
                            </div>
                            <div className={`w-9 h-5 rounded-full transition-colors flex-shrink-0 relative ${showInForm ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-600'}`}>
                                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${showInForm ? 'translate-x-4' : 'translate-x-0.5'}`} />
                            </div>
                        </button>
                        <div className="flex gap-2 pt-1">
                            <button onClick={onClose} className="flex-1 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800">Batal</button>
                            <button onClick={submit} disabled={!label.trim()}
                                className="flex-1 bg-indigo-600 text-white text-sm font-semibold py-2 rounded-xl hover:bg-indigo-700 disabled:opacity-40">Tambah</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Detail drawer ────────────────────────────────────────────────────────────
function RowDrawer({ row, cols, onClose, onSave }) {
    const [draft, setDraft] = useState({ ...row });
    // key = col.col_key (the JSON key in row data), NOT col.id
    const set = (key, val) => setDraft(d => ({ ...d, [key]: val }));

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/30" onClick={onClose} />
            <aside className="relative w-full max-w-sm bg-white dark:bg-gray-900 shadow-2xl flex flex-col h-full" style={{ animation: 'slideIn .2s ease' }}>
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                    <h3 className="font-bold text-gray-900 dark:text-white">Detail Baris</h3>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-500 text-lg">✕</button>
                </div>
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 dark:bg-gray-900">
                    {cols.map(col => {
                        const cfg = COL_TYPES[col.type];
                        const k   = col.col_key;
                        return (
                            <div key={col.id}>
                                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
                                    <span className={cfg?.color}>{cfg?.icon}</span>{col.label}
                                    {col.show_in_form && <span className="ml-auto text-[10px] text-pink-500 font-medium">Form ✓</span>}
                                </label>
                                {col.type === 'select' ? (
                                    <select value={draft[k] ?? ''} onChange={e => set(k, e.target.value)}
                                        className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                                        <option value="">— Pilih —</option>
                                        {col.options.map(o => <option key={o}>{o}</option>)}
                                    </select>
                                ) : col.type === 'multiselect' ? (
                                    <div className="flex flex-wrap gap-1.5">
                                        {col.options.map((o, i) => {
                                            const tags = draft[k] ? String(draft[k]).split(',').map(s => s.trim()) : [];
                                            const active = tags.includes(o);
                                            return (
                                                <button key={o} type="button"
                                                    onClick={() => {
                                                        const next = active ? tags.filter(t => t !== o) : [...tags, o];
                                                        set(k, next.filter(Boolean).join(', '));
                                                    }}
                                                    className={`text-xs px-2.5 py-1 rounded-full font-medium transition ${active ? SELECT_COLORS[i % SELECT_COLORS.length] : 'bg-gray-100 text-gray-500'}`}>
                                                    {o}
                                                </button>
                                            );
                                        })}
                                    </div>
                                ) : col.type === 'checkbox' ? (
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" checked={!!draft[k]}
                                            onChange={e => set(k, e.target.checked)}
                                            className="w-4 h-4 rounded text-indigo-600 cursor-pointer" />
                                        <span className="text-sm text-gray-600 dark:text-gray-300">{draft[k] ? 'Ya' : 'Tidak'}</span>
                                    </div>
                                ) : col.type === 'rating' ? (
                                    <div className="flex gap-1">
                                        {[1,2,3,4,5].map(n => (
                                            <button key={n} type="button" onClick={() => set(k, n)}
                                                className={`text-2xl transition ${n <= (Number(draft[k]) || 0) ? 'text-yellow-400' : 'text-gray-200 dark:text-gray-700'}`}>★</button>
                                        ))}
                                    </div>
                                ) : col.type === 'image' ? (
                                    <ImageUploader dbId={col._dbId} value={draft[k] ?? ''} onChange={v => set(k, v)} />
                                ) : col.type === 'longtext' ? (
                                    <textarea value={draft[k] ?? ''} onChange={e => set(k, e.target.value)}
                                        rows={3} className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" />
                                ) : (
                                    <input
                                        type={col.type === 'date' ? 'date' : col.type === 'datetime' ? 'datetime-local'
                                            : (col.type === 'number' || col.type === 'currency' || col.type === 'percent') ? 'number'
                                            : col.type === 'email' ? 'email' : col.type === 'url' ? 'url'
                                            : col.type === 'phone' ? 'tel' : 'text'}
                                        value={draft[k] ?? ''} onChange={e => set(k, e.target.value)}
                                        className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                                )}
                            </div>
                        );
                    })}
                </div>
                <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-800 flex gap-2">
                    <button onClick={onClose} className="flex-1 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800">Batal</button>
                    <button onClick={() => onSave(draft)} className="flex-1 bg-indigo-600 text-white text-sm font-semibold py-2 rounded-xl hover:bg-indigo-700">Simpan</button>
                </div>
            </aside>
        </div>
    );
}

// ─── View spreadsheet ─────────────────────────────────────────────────────────
function renderCell(col, val) {
    if (col.type === 'image') {
        const imgs = parseImages(val);
        if (!imgs.length) return <span className="text-gray-300 text-xs">—</span>;
        return (
            <div className="flex items-center gap-1">
                {imgs.slice(0, 4).map((url, i) => (
                    <img key={i} src={url} alt="" className="h-7 w-7 object-cover rounded border border-gray-100 flex-shrink-0" />
                ))}
                {imgs.length > 4 && <span className="text-[10px] text-gray-400 flex-shrink-0">+{imgs.length - 4}</span>}
            </div>
        );
    }
    if (col.type === 'checkbox') return <span className={`text-lg ${val ? 'text-indigo-600' : 'text-gray-200'}`}>{val ? '✓' : '○'}</span>;
    if (col.type === 'rating')   { const n = Number(val)||0; return <span className="text-yellow-400">{'★'.repeat(n)}{'☆'.repeat(5-n)}</span>; }
    if (col.type === 'select')   return <SelectBadge value={val} options={col.options} />;
    if (col.type === 'multiselect') {
        const tags = val ? String(val).split(',').map(s => s.trim()).filter(Boolean) : [];
        return <div className="flex flex-wrap gap-1">{tags.map((t,i) => <span key={t} className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${SELECT_COLORS[col.options.indexOf(t) >= 0 ? col.options.indexOf(t) % SELECT_COLORS.length : i % SELECT_COLORS.length]}`}>{t}</span>)}</div>;
    }
    if (!val && val !== 0) return '';
    if (col.type === 'number')   return Number(val).toLocaleString('id-ID');
    if (col.type === 'currency') return 'Rp ' + Number(val).toLocaleString('id-ID');
    if (col.type === 'percent')  return val + '%';
    if (col.type === 'date')     return new Date(val + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    if (col.type === 'datetime') return new Date(val).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    if (col.type === 'url')      return <a href={val} target="_blank" rel="noreferrer" className="text-indigo-500 underline truncate" onClick={e => e.stopPropagation()}>{val}</a>;
    if (col.type === 'email')    return <a href={`mailto:${val}`} className="text-indigo-500 underline" onClick={e => e.stopPropagation()}>{val}</a>;
    return val;
}

// ─── Gradient & icon presets ─────────────────────────────────────────────────
const FORM_GRADIENTS = [
    { key: 'from-indigo-500 to-violet-600',  label: 'Indigo',   preview: 'bg-gradient-to-r from-indigo-500 to-violet-600' },
    { key: 'from-pink-500 to-rose-500',      label: 'Pink',     preview: 'bg-gradient-to-r from-pink-500 to-rose-500' },
    { key: 'from-blue-500 to-cyan-500',      label: 'Blue',     preview: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
    { key: 'from-emerald-500 to-teal-500',   label: 'Green',    preview: 'bg-gradient-to-r from-emerald-500 to-teal-500' },
    { key: 'from-orange-500 to-amber-400',   label: 'Orange',   preview: 'bg-gradient-to-r from-orange-500 to-amber-400' },
    { key: 'from-red-500 to-pink-500',       label: 'Red',      preview: 'bg-gradient-to-r from-red-500 to-pink-500' },
    { key: 'from-slate-600 to-slate-800',    label: 'Dark',     preview: 'bg-gradient-to-r from-slate-600 to-slate-800' },
    { key: 'from-fuchsia-500 to-purple-600', label: 'Purple',   preview: 'bg-gradient-to-r from-fuchsia-500 to-purple-600' },
    { key: 'from-yellow-400 to-orange-500',  label: 'Yellow',   preview: 'bg-gradient-to-r from-yellow-400 to-orange-500' },
    { key: 'from-cyan-500 to-blue-600',      label: 'Cyan',     preview: 'bg-gradient-to-r from-cyan-500 to-blue-600' },
];
const FORM_ICONS = ['📋','📊','📈','📝','📌','🗂️','💼','🎯','⭐','🔥','💡','✅','📞','📧','🌟','🚀','🎨','💎','🏆','❤️','🎁','📷','🌈','⚡','🧩'];

// ─── Form Customize Panel ─────────────────────────────────────────────────────
function FormCustomizePanel({ dbId, formColor, setFormColor, formIcon, setFormIcon, formLogo, setFormLogo, onClose }) {
    const [saving,       setSaving]       = useState(false);
    const [logoUploading,setLogoUploading]= useState(false);
    const logoInputRef = useRef(null);

    const save = async (color, icon) => {
        setSaving(true);
        try {
            await api.patch(`/user-databases/${dbId}/form-style`, { form_color: color, form_icon: icon });
        } finally { setSaving(false); }
    };

    const pickColor = (key) => { setFormColor(key); save(key, formIcon); };
    const pickIcon  = (icon) => { setFormIcon(icon); save(formColor, icon); };

    const uploadLogo = async (file) => {
        if (!file) return;
        setLogoUploading(true);
        try {
            const fd = new FormData();
            fd.append('file', file);
            const { data } = await api.post(`/user-databases/${dbId}/form-logo`, fd, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setFormLogo(data.form_logo);
        } catch { alert('Gagal upload logo'); } finally { setLogoUploading(false); }
    };

    const removeLogo = async () => {
        await api.delete(`/user-databases/${dbId}/form-logo`);
        setFormLogo(null);
    };

    return (
        <div className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 px-6 py-5 space-y-5">
            <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-gray-700 dark:text-gray-200">Kustomisasi Tampilan Form</p>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition text-xs">✕ Tutup</button>
            </div>

            {/* Logo upload */}
            <div>
                <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Logo / Gambar</p>
                <div className="flex items-center gap-3">
                    {/* Preview */}
                    <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center bg-white dark:bg-gray-800">
                        {logoUploading
                            ? <span className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                            : formLogo
                                ? <img src={formLogo} alt="logo" className="w-full h-full object-cover" />
                                : <svg className="w-7 h-7 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21h18M6.75 6.75h.008v.008H6.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/></svg>
                        }
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                        <button onClick={() => logoInputRef.current?.click()} disabled={logoUploading}
                            className="text-xs font-semibold px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition disabled:opacity-50">
                            {formLogo ? 'Ganti Logo' : 'Upload Logo'}
                        </button>
                        {formLogo && (
                            <button onClick={removeLogo} className="text-xs text-red-400 hover:text-red-600 transition text-left">
                                Hapus logo
                            </button>
                        )}
                        <p className="text-[10px] text-gray-400 dark:text-gray-500">PNG/JPG, maks 2MB. Logo menggantikan icon emoji.</p>
                    </div>
                </div>
                <input ref={logoInputRef} type="file" accept="image/*" className="hidden"
                    onChange={e => uploadLogo(e.target.files?.[0])} />
            </div>

            {/* Gradient picker */}
            <div>
                <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Warna Header</p>
                <div className="grid grid-cols-5 gap-2">
                    {FORM_GRADIENTS.map(g => (
                        <button key={g.key} onClick={() => pickColor(g.key)}
                            title={g.label}
                            className={`h-9 rounded-xl ${g.preview} transition-all ${formColor === g.key ? 'ring-2 ring-offset-2 ring-indigo-500 scale-105' : 'hover:scale-105 opacity-80 hover:opacity-100'}`} />
                    ))}
                </div>
            </div>

            {/* Icon picker — only shown if no logo */}
            {!formLogo && (
                <div>
                    <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Icon (jika tanpa logo)</p>
                    <div className="flex flex-wrap gap-1.5">
                        {FORM_ICONS.map(icon => (
                            <button key={icon} onClick={() => pickIcon(icon)}
                                className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all hover:scale-110 ${formIcon === icon ? 'bg-indigo-100 dark:bg-indigo-900/50 ring-2 ring-indigo-400 scale-105' : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'}`}>
                                {icon}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {saving && <p className="text-[10px] text-indigo-500 flex items-center gap-1.5"><span className="w-3 h-3 border border-indigo-500 border-t-transparent rounded-full animate-spin" />Menyimpan...</p>}
        </div>
    );
}

// ─── Spreadsheet view (dengan API) ───────────────────────────────────────────
function SpreadsheetView({ db, onBack }) {
    const [cols,       setCols]       = useState([]);
    const [rows,       setRows]       = useState([]);
    const [loading,    setLoading]    = useState(true);
    const [editing,    setEditing]    = useState(null);
    const [drawer,     setDrawer]     = useState(null);
    const [showAddCol, setShowAddCol] = useState(false);
    const [filterText, setFilterText] = useState('');
    const [sortCfg,    setSortCfg]    = useState({ colKey: null, dir: 'asc' });
    const [viewMode,     setViewMode]     = useState('grid'); // 'grid' | 'form'
    const [formData,     setFormData]     = useState({});
    const [formSaving,   setFormSaving]   = useState(false);
    const [formSuccess,  setFormSuccess]  = useState(false);
    const [renamingCol,  setRenamingCol]  = useState(null);
    const [renameVal,    setRenameVal]    = useState('');
    const [showExport,   setShowExport]   = useState(false);
    const [shareToken,   setShareToken]   = useState(db.share_token ?? null);
    const [shareAlias,   setShareAlias]   = useState(db.share_alias ?? '');
    const [showShare,    setShowShare]    = useState(false);
    const [shareLoading, setShareLoading] = useState(false);
    const [aliasLoading, setAliasLoading] = useState(false);
    const [aliasError,   setAliasError]   = useState('');
    const [copied,       setCopied]       = useState(false);
    const [formColor,    setFormColor]    = useState(db.form_color ?? 'from-indigo-500 to-violet-600');
    const [formIcon,     setFormIcon]     = useState(db.form_icon  ?? '📋');
    const [formLogo,     setFormLogo]     = useState(db.form_logo  ?? null);
    const [showCustomize,setShowCustomize]= useState(false);
    const saveTimers = useRef({});

    const typeInfo = DB_TYPES.find(t => t.key === db.type) ?? DB_TYPES[0];

    // Load data dari API
    useEffect(() => {
        setLoading(true);
        api.get(`/user-databases/${db.id}/data`)
            .then(r => {
                // Attach _dbId to each col so ImageUploader knows where to upload
                setCols(r.data.cols.map(c => ({ ...c, _dbId: db.id })));
                setRows(r.data.rows);
            })
            .finally(() => setLoading(false));
    }, [db.id]);

    // Add row
    const addRow = async () => {
        const { data } = await api.post(`/user-databases/${db.id}/rows`);
        setRows(rs => [...rs, data]);
    };

    // Delete row — with confirmation
    const deleteRow = async (rowId) => {
        if (!window.confirm('Hapus baris ini?')) return;
        setRows(rs => rs.filter(r => r.id !== rowId));
        await api.delete(`/user-databases/${db.id}/rows/${rowId}`);
    };

    // Cell edit — optimistic update + debounced save
    const handleCellChange = (rowId, colKey, val) => {
        setRows(rs => rs.map(r => r.id === rowId ? { ...r, [colKey]: val } : r));
        clearTimeout(saveTimers.current[`${rowId}_${colKey}`]);
        saveTimers.current[`${rowId}_${colKey}`] = setTimeout(async () => {
            const { data: saved } = await api.patch(`/user-databases/${db.id}/rows/${rowId}`, { data: { [colKey]: val } });
            // Update updated_at + last_edited_by from server response
            setRows(rs => rs.map(r => r.id === rowId
                ? { ...r, updated_at: saved.updated_at, last_edited_by: saved.last_edited_by }
                : r
            ));
        }, 600);
    };

    // Save drawer update
    const saveDrawer = async (updated) => {
        const { id, updated_at, last_edited_by, ...data } = updated;
        const { data: saved } = await api.patch(`/user-databases/${db.id}/rows/${id}`, { data });
        setRows(rs => rs.map(r => r.id === id
            ? { ...updated, updated_at: saved.updated_at, last_edited_by: saved.last_edited_by }
            : r
        ));
        setDrawer(null);
    };

    // Add column
    const addCol = async (colForm) => {
        const { data } = await api.post(`/user-databases/${db.id}/columns`, {
            label:        colForm.label,
            type:         colForm.type,
            options:      colForm.options,
            show_in_form: colForm.show_in_form ?? true,
        });
        setCols(cs => [...cs, { ...data, _dbId: db.id }]);
        setRows(rs => rs.map(r => ({ ...r, [data.col_key]: '' })));
    };

    // Toggle show_in_form
    const toggleShowInForm = async (col) => {
        const updated = { ...col, show_in_form: !col.show_in_form };
        setCols(cs => cs.map(c => c.id === col.id ? updated : c));
        await api.patch(`/user-databases/${db.id}/columns/${col.id}`, { show_in_form: !col.show_in_form });
    };

    // Share token
    const generateShare = async () => {
        setShareLoading(true);
        try {
            const { data } = await api.post(`/user-databases/${db.id}/share-token`);
            setShareToken(data.share_token);
        } catch (e) {
            alert('Gagal membuat link: ' + (e.response?.data?.message ?? e.message));
        } finally { setShareLoading(false); }
    };
    const revokeShare = async () => {
        if (!window.confirm('Nonaktifkan link? Siapapun yang punya link tidak bisa mengakses form lagi.')) return;
        await api.delete(`/user-databases/${db.id}/share-token`);
        setShareToken(null);
    };
    const activeSlug = shareAlias || shareToken;
    const shareUrl   = activeSlug ? `${window.location.origin}/form/${activeSlug}` : '';
    const copyLink   = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    const saveAlias = async () => {
        setAliasError('');
        setAliasLoading(true);
        try {
            const { data } = await api.patch(`/user-databases/${db.id}/share-alias`, { alias: shareAlias.trim() || null });
            setShareAlias(data.share_alias ?? '');
        } catch (e) {
            setAliasError(e.response?.data?.errors?.alias?.[0] ?? 'Alias tidak valid atau sudah dipakai');
        } finally { setAliasLoading(false); }
    };

    // Rename column
    const startRename = (col) => { setRenamingCol(col.id); setRenameVal(col.label); };
    const commitRename = async (col) => {
        if (!renameVal.trim() || renameVal === col.label) { setRenamingCol(null); return; }
        setCols(cs => cs.map(c => c.id === col.id ? { ...c, label: renameVal.trim() } : c));
        setRenamingCol(null);
        await api.patch(`/user-databases/${db.id}/columns/${col.id}`, { label: renameVal.trim() });
    };

    // Export functions
    const exportAsCSV = () => {
        const headers = cols.map(c => `"${c.label.replace(/"/g, '""')}"`).join(',');
        const csvRows = visibleRows.map(row =>
            cols.map(col => {
                let val = row[col.col_key] ?? '';
                if (Array.isArray(val)) val = JSON.stringify(val);
                if (typeof val === 'object') val = JSON.stringify(val);
                return `"${String(val).replace(/"/g, '""')}"`;
            }).join(',')
        );
        const csv = [headers, ...csvRows].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${db.name}-${new Date().toISOString().slice(0,10)}.csv`;
        link.click();
        setShowExport(false);
    };

    const exportAsJSON = () => {
        const data = visibleRows.map(row => {
            const obj = { id: row.id };
            cols.forEach(col => { obj[col.label] = row[col.col_key] ?? null; });
            return obj;
        });
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${db.name}-${new Date().toISOString().slice(0,10)}.json`;
        link.click();
        setShowExport(false);
    };

    // Delete column — with confirmation (all row data for this column is lost)
    const deleteCol = async (col) => {
        if (!window.confirm(`Hapus kolom "${col.label}"? Semua data di kolom ini akan hilang.`)) return;
        await api.delete(`/user-databases/${db.id}/columns/${col.id}`);
        setCols(cs => cs.filter(c => c.id !== col.id));
        setRows(rs => rs.map(r => { const n = { ...r }; delete n[col.col_key]; return n; }));
    };

    const toggleSort = colKey => setSortCfg(s =>
        s.colKey === colKey ? { colKey, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { colKey, dir: 'asc' }
    );

    const visibleRows = (() => {
        let r = rows;
        if (filterText.trim()) {
            const q = filterText.toLowerCase();
            r = r.filter(row => cols
                .filter(c => c.type !== 'image')   // skip binary/array columns
                .some(c => String(row[c.col_key] ?? '').toLowerCase().includes(q)));
        }
        if (sortCfg.colKey) {
            const col = cols.find(c => c.col_key === sortCfg.colKey);
            r = [...r].sort((a, b) => {
                const av = (col?.type === 'number' || col?.type === 'currency') ? Number(a[sortCfg.colKey]) : String(a[sortCfg.colKey] ?? '');
                const bv = (col?.type === 'number' || col?.type === 'currency') ? Number(b[sortCfg.colKey]) : String(b[sortCfg.colKey] ?? '');
                return sortCfg.dir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
            });
        }
        return r;
    })();

    if (loading) return (
        <div className="flex-1 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="flex flex-col h-full">
            {/* Toolbar */}
            <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-white dark:bg-gray-900 dark:border-gray-800 flex-shrink-0 flex-wrap gap-y-2">
                <button onClick={onBack}
                    className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <span className="flex-shrink-0">{typeInfo.icon}</span>
                <span className="font-bold text-gray-900 dark:text-white text-sm">{db.name}</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${typeInfo.color}`}>{typeInfo.label}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">{rows.length} baris</span>

                <div className="relative flex-1 min-w-[140px] max-w-xs ml-2">
                    <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input value={filterText} onChange={e => setFilterText(e.target.value)} placeholder="Filter..."
                        className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>

                <select value={sortCfg.colKey ?? ''} onChange={e => setSortCfg({ colKey: e.target.value || null, dir: 'asc' })}
                    className="text-xs border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-600">
                    <option value="">↕ Urutkan...</option>
                    {cols.filter(c => !['image', 'autonumber'].includes(c.type)).map(c => (
                        <option key={c.id} value={c.col_key}>{c.label}</option>
                    ))}
                </select>
                {sortCfg.colKey && (
                    <button onClick={() => setSortCfg(s => ({ ...s, dir: s.dir === 'asc' ? 'desc' : 'asc' }))}
                        className="text-xs border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                        {sortCfg.dir === 'asc' ? '↑ A→Z' : '↓ Z→A'}
                    </button>
                )}

                <div className="flex items-center gap-2 ml-auto">
                    {/* View toggle */}
                    <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5 gap-0.5">
                        <button onClick={() => setViewMode('grid')}
                            className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md transition font-medium ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-800 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 6h18M3 14h18M3 18h18"/></svg>
                            Grid
                        </button>
                        <button onClick={() => { setViewMode('form'); setFormData({}); }}
                            className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md transition font-medium ${viewMode === 'form' ? 'bg-white dark:bg-gray-700 shadow-sm text-pink-600' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                            Form
                        </button>
                    </div>

                    {/* Share form link button */}
                    <div className="relative">
                        <button onClick={() => setShowShare(!showShare)}
                            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition font-medium
                                ${shareToken
                                    ? 'border-pink-300 dark:border-pink-700 text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-950/30'
                                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                            </svg>
                            Share Form
                            {shareToken && <span className="w-1.5 h-1.5 bg-pink-500 rounded-full" />}
                        </button>

                        {/* Share dropdown */}
                        {showShare && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowShare(false)} />
                                <div className="absolute right-0 mt-1.5 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl z-50 p-4 space-y-3">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-7 h-7 bg-pink-100 dark:bg-pink-900/40 rounded-lg flex items-center justify-center">
                                            <svg className="w-3.5 h-3.5 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-800 dark:text-white">Share Form Link</p>
                                            <p className="text-[10px] text-gray-400 dark:text-gray-500">Siapapun bisa isi tanpa login</p>
                                        </div>
                                    </div>

                                    {shareToken ? (
                                        <>
                                            {/* URL box */}
                                            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 rounded-xl px-3 py-2.5 border border-gray-200 dark:border-gray-600">
                                                <span className="text-[11px] text-gray-600 dark:text-gray-300 truncate flex-1 font-mono select-all">{shareUrl}</span>
                                            </div>

                                            {/* Custom alias editor */}
                                            <div className="space-y-1.5">
                                                <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Custom Link</p>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-[10px] text-gray-400 dark:text-gray-500 whitespace-nowrap">/form/</span>
                                                    <input
                                                        value={shareAlias}
                                                        onChange={e => { setShareAlias(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '')); setAliasError(''); }}
                                                        onKeyDown={e => e.key === 'Enter' && saveAlias()}
                                                        placeholder={shareToken.slice(0, 10) + '...'}
                                                        className="flex-1 text-xs border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-pink-400 font-mono min-w-0"
                                                    />
                                                    <button onClick={saveAlias} disabled={aliasLoading}
                                                        className="text-[11px] font-semibold px-2.5 py-1.5 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 transition whitespace-nowrap">
                                                        {aliasLoading ? '...' : 'Simpan'}
                                                    </button>
                                                </div>
                                                {aliasError && <p className="text-[10px] text-red-500">{aliasError}</p>}
                                                {shareAlias && <p className="text-[10px] text-green-500">Link aktif: /form/{shareAlias}</p>}
                                            </div>

                                            <div className="flex gap-2">
                                                <button onClick={copyLink}
                                                    className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-xl transition ${copied ? 'bg-green-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
                                                    {copied ? (
                                                        <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg> Tersalin!</>
                                                    ) : (
                                                        <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg> Copy Link</>
                                                    )}
                                                </button>
                                                <a href={shareUrl} target="_blank" rel="noreferrer"
                                                    className="flex items-center justify-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                                                    Buka
                                                </a>
                                            </div>
                                            <button onClick={revokeShare}
                                                className="w-full text-xs text-red-400 hover:text-red-600 py-1 transition text-center">
                                                Nonaktifkan link
                                            </button>
                                        </>
                                    ) : (
                                        <button onClick={generateShare} disabled={shareLoading}
                                            className="w-full bg-pink-600 text-white text-xs font-semibold py-2.5 rounded-xl hover:bg-pink-700 transition disabled:opacity-60 flex items-center justify-center gap-2">
                                            {shareLoading
                                                ? <><span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Membuat link...</>
                                                : <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101"/><path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 015.656 0l4-4a4 4 0 01-5.656-5.656l-1.1 1.1"/></svg> Buat Link Shareable</>
                                            }
                                        </button>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                    {viewMode === 'grid' && <>
                        <button onClick={() => setShowAddCol(true)}
                            className="flex items-center gap-1.5 text-xs border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                            Kolom
                        </button>
                        <button onClick={addRow}
                            className="flex items-center gap-1.5 text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                            Baris
                        </button>
                        <div className="relative">
                            <button onClick={() => setShowExport(!showExport)}
                                className="flex items-center gap-1.5 text-xs border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0l-4 4m4-4v12"/></svg>
                                Export
                            </button>
                            {showExport && (
                                <>
                                    <div className="absolute inset-0 z-40" onClick={() => setShowExport(false)} />
                                    <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden">
                                        <button onClick={exportAsCSV}
                                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center gap-2">
                                            <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                                            Export CSV
                                        </button>
                                        <button onClick={exportAsJSON}
                                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center gap-2 border-t border-gray-100 dark:border-gray-700">
                                            <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                                            Export JSON
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </>}
                </div>
            </div>

            {/* ── Form View ──────────────────────────────────────────── */}
            {viewMode === 'form' ? (
                <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950">
                    <div className="max-w-xl mx-auto py-10 px-4">
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                            {/* Form header — editable */}
                            <div className={`bg-gradient-to-r ${formColor} px-6 py-8 relative group/header`}>
                                <div className="flex items-start gap-4">
                                    <button onClick={() => setShowCustomize(!showCustomize)}
                                        className="flex-shrink-0 hover:scale-105 transition-transform"
                                        title="Ganti icon/logo">
                                        {formLogo
                                            ? <img src={formLogo} alt="logo" className="w-14 h-14 rounded-2xl object-cover bg-white/20 shadow-md" />
                                            : <span className="text-3xl">{formIcon}</span>
                                        }
                                    </button>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">{db.name}</h2>
                                        <p className="text-white/70 text-sm mt-1">Isi form di bawah untuk menambah data baru</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowCustomize(!showCustomize)}
                                    className="absolute top-3 right-3 bg-white/20 hover:bg-white/30 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full transition flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                                    Kustomisasi
                                </button>
                            </div>

                            {/* Customize panel */}
                            {showCustomize && <FormCustomizePanel
                                dbId={db.id}
                                formColor={formColor} setFormColor={setFormColor}
                                formIcon={formIcon}   setFormIcon={setFormIcon}
                                formLogo={formLogo}   setFormLogo={setFormLogo}
                                onClose={() => setShowCustomize(false)}
                            />}
                            <div className="p-6 space-y-5">
                                {cols.filter(c => c.show_in_form).length === 0 ? (
                                    <div className="text-center py-8 text-gray-400 dark:text-gray-500 text-sm">
                                        <p>Belum ada kolom yang ditampilkan di form.</p>
                                        <p className="mt-1">Hover kolom di Grid View lalu klik ⊞ untuk mengaktifkan.</p>
                                    </div>
                                ) : cols.filter(c => c.show_in_form).map(col => {
                                    const cfg = COL_TYPES[col.type];
                                    return (
                                        <div key={col.id}>
                                            <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                                                <span className={cfg?.color}>{cfg?.icon}</span>
                                                {col.label}
                                            </label>
                                            {col.type === 'select' ? (
                                                <select value={formData[col.col_key] ?? ''} onChange={e => setFormData(d => ({ ...d, [col.col_key]: e.target.value }))}
                                                    className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                                                    <option value="">— Pilih —</option>
                                                    {col.options.map(o => <option key={o}>{o}</option>)}
                                                </select>
                                            ) : col.type === 'multiselect' ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {col.options.map((o, i) => {
                                                        const tags = formData[col.col_key] ? String(formData[col.col_key]).split(',').map(s => s.trim()) : [];
                                                        const active = tags.includes(o);
                                                        return (
                                                            <button key={o} type="button" onClick={() => {
                                                                const next = active ? tags.filter(t => t !== o) : [...tags, o];
                                                                setFormData(d => ({ ...d, [col.col_key]: next.filter(Boolean).join(', ') }));
                                                            }} className={`text-sm px-3 py-1.5 rounded-full font-medium border transition ${active ? SELECT_COLORS[i % SELECT_COLORS.length] + ' border-transparent' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300'}`}>
                                                                {o}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            ) : col.type === 'checkbox' ? (
                                                <div className="flex items-center gap-2">
                                                    <input type="checkbox" checked={!!formData[col.col_key]}
                                                        onChange={e => setFormData(d => ({ ...d, [col.col_key]: e.target.checked }))}
                                                        className="w-5 h-5 rounded text-indigo-600 cursor-pointer" />
                                                    <span className="text-sm text-gray-600 dark:text-gray-300">{formData[col.col_key] ? 'Ya' : 'Tidak'}</span>
                                                </div>
                                            ) : col.type === 'rating' ? (
                                                <div className="flex gap-2">
                                                    {[1,2,3,4,5].map(n => (
                                                        <button key={n} type="button" onClick={() => setFormData(d => ({ ...d, [col.col_key]: n }))}
                                                            className={`text-3xl transition ${n <= (Number(formData[col.col_key]) || 0) ? 'text-yellow-400' : 'text-gray-200 dark:text-gray-700'}`}>★</button>
                                                    ))}
                                                </div>
                                            ) : col.type === 'image' ? (
                                                <ImageUploader dbId={db.id} value={formData[col.col_key] ?? ''}
                                                    onChange={v => setFormData(d => ({ ...d, [col.col_key]: v }))} />
                                            ) : col.type === 'longtext' ? (
                                                <textarea value={formData[col.col_key] ?? ''} onChange={e => setFormData(d => ({ ...d, [col.col_key]: e.target.value }))}
                                                    rows={4} placeholder={`Masukkan ${col.label}...`}
                                                    className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" />
                                            ) : (
                                                <input
                                                    type={col.type === 'date' ? 'date' : col.type === 'datetime' ? 'datetime-local'
                                                        : (col.type === 'number' || col.type === 'currency' || col.type === 'percent') ? 'number'
                                                        : col.type === 'email' ? 'email' : col.type === 'url' ? 'url'
                                                        : col.type === 'phone' ? 'tel' : 'text'}
                                                    value={formData[col.col_key] ?? ''}
                                                    onChange={e => setFormData(d => ({ ...d, [col.col_key]: e.target.value }))}
                                                    placeholder={`Masukkan ${col.label}...`}
                                                    className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                                            )}
                                        </div>
                                    );
                                })}
                                {cols.filter(c => c.show_in_form).length > 0 && (
                                    <button disabled={formSaving || formSuccess} onClick={async () => {
                                        setFormSaving(true);
                                        try {
                                            const { data: newRow } = await api.post(`/user-databases/${db.id}/rows`);
                                            await api.patch(`/user-databases/${db.id}/rows/${newRow.id}`, { data: formData });
                                            setRows(rs => [...rs, { ...newRow, ...formData }]);
                                            setFormData({});
                                            setFormSuccess(true);
                                            setTimeout(() => setFormSuccess(false), 2000);
                                        } finally { setFormSaving(false); }
                                    }} className={`w-full font-semibold py-3 rounded-xl transition disabled:opacity-50 mt-2 flex items-center justify-center gap-2
                                        ${formSuccess
                                            ? 'bg-green-500 text-white'
                                            : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
                                        {formSaving && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                                        {formSuccess ? '✓ Data tersimpan!' : formSaving ? 'Menyimpan...' : 'Kirim'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : cols.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 dark:bg-gray-950">
                    <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm flex items-center justify-center mb-4 [&>svg]:w-8 [&>svg]:h-8">{typeInfo.icon}</div>
                    <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Database masih kosong</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mb-5">Mulai dengan menambahkan kolom untuk mendefinisikan struktur data</p>
                    <button onClick={() => setShowAddCol(true)}
                        className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                        Tambah Kolom Pertama
                    </button>
                </div>
            ) : (
                <div className="flex-1 overflow-auto">
                    <table className="w-max min-w-full border-collapse text-sm dark:bg-gray-900">
                        <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th className="w-10 border-b border-r border-gray-200 dark:border-gray-700 px-2 py-2 text-center text-xs text-gray-400 dark:text-gray-500 font-normal sticky left-0 z-20 bg-gray-50 dark:bg-gray-800">#</th>
                                {cols.map(col => (
                                    <th key={col.id} className="border-b border-r border-gray-200 dark:border-gray-700 text-left min-w-[160px] group/col relative">
                                        {renamingCol === col.id ? (
                                            <input autoFocus value={renameVal} onChange={e => setRenameVal(e.target.value)}
                                                onKeyDown={e => e.key === 'Enter' ? commitRename(col) : e.key === 'Escape' && setRenamingCol(null)}
                                                onBlur={() => commitRename(col)}
                                                className="w-full px-3 py-2.5 text-xs font-semibold bg-indigo-50 dark:bg-indigo-950 dark:text-white border border-indigo-300 dark:border-indigo-600 rounded outline-none focus:ring-2 focus:ring-indigo-400" />
                                        ) : (
                                            <button onClick={() => toggleSort(col.col_key)} onDoubleClick={() => startRename(col)}
                                                className="flex items-center gap-2 w-full px-3 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition group/label">
                                                <span className={`flex-shrink-0 ${COL_TYPES[col.type]?.color}`}>{COL_TYPES[col.type]?.icon}</span>
                                                <span className="truncate">{col.label}</span>
                                                {sortCfg.colKey === col.col_key && (
                                                    <span className="text-indigo-500 flex-shrink-0 ml-auto">{sortCfg.dir === 'asc' ? '↑' : '↓'}</span>
                                                )}
                                                <span className="text-[10px] text-gray-300 opacity-0 group-hover/label:opacity-100 flex-shrink-0 ml-auto">Dobel klik</span>
                                            </button>
                                        )}
                                        {/* Action buttons — only show when not renaming */}
                                        {renamingCol !== col.id && (
                                            <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5
                                                            opacity-0 group-hover/col:opacity-100 transition-opacity pointer-events-none group-hover/col:pointer-events-auto">
                                                <button onClick={() => toggleShowInForm(col)}
                                                    title={col.show_in_form ? 'Tampil di form' : 'Tersembunyi di form'}
                                                    className={`w-6 h-6 flex items-center justify-center rounded-md hover:bg-pink-50 transition text-sm ${col.show_in_form ? 'text-pink-500' : 'text-gray-300'}`}>
                                                    ⊞
                                                </button>
                                                <button onClick={() => deleteCol(col)}
                                                    className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-red-50 text-gray-300 hover:text-red-400 transition text-sm">
                                                    ✕
                                                </button>
                                            </div>
                                        )}
                                    </th>
                                ))}
                                {/* System column: Latest Edit */}
                                <th className="border-b border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2.5 text-left min-w-[180px]">
                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400">
                                        <svg className="w-3.5 h-3.5 text-violet-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                        </svg>
                                        Latest Edit
                                    </div>
                                </th>
                                <th className="w-14 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800" />
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900">
                            {visibleRows.length === 0 && (
                                <tr><td colSpan={cols.length + 2} className="py-16 text-center text-gray-400 dark:text-gray-500 text-sm">Tidak ada data. Klik "+ Baris" untuk menambahkan.</td></tr>
                            )}
                            {visibleRows.map((row, idx) => (
                                <tr key={row.id} className="group group/row hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 transition-colors">
                                    <td className="border-b border-r border-gray-100 dark:border-gray-800 px-2 py-1.5 text-center text-xs text-gray-300 dark:text-gray-600 select-none sticky left-0 z-10 bg-white dark:bg-gray-900 group-hover/row:bg-indigo-50/40 dark:group-hover/row:bg-indigo-950/20">{idx + 1}</td>
                                    {cols.map(col => {
                                        // Image — standalone upload (no editing state), taller row
                                        if (col.type === 'image') {
                                            return (
                                                <td key={col.id} className="border-b border-r border-gray-100 dark:border-gray-800 px-0 py-0" style={{ height: '44px' }}>
                                                    <ImageCell dbId={db.id} colKey={col.col_key}
                                                        rowId={row.id} value={row[col.col_key] ?? ''}
                                                        onSave={handleCellChange} />
                                                </td>
                                            );
                                        }
                                        // Autonumber — read-only
                                        if (col.type === 'autonumber') {
                                            return (
                                                <td key={col.id} className="border-b border-r border-gray-100 dark:border-gray-800 px-3 py-1.5 h-9 text-sm text-gray-400 dark:text-gray-500 select-none">
                                                    {idx + 1}
                                                </td>
                                            );
                                        }

                                        const isEditing = editing?.rowId === row.id && editing?.colId === col.id;
                                        return (
                                            <td key={col.id} className="border-b border-r border-gray-100 dark:border-gray-800 px-0 py-0 h-9 relative"
                                                onClick={() => !isEditing && setEditing({ rowId: row.id, colId: col.id })}>
                                                {isEditing ? (
                                                    <CellEditor col={col} value={row[col.col_key] ?? ''}
                                                        onChange={val => handleCellChange(row.id, col.col_key, val)}
                                                        onBlur={() => setEditing(null)} />
                                                ) : (
                                                    <div className="px-3 py-1.5 cursor-pointer truncate text-sm text-gray-700 dark:text-gray-200 h-full flex items-center">
                                                        {renderCell(col, row[col.col_key])}
                                                    </div>
                                                )}
                                            </td>
                                        );
                                    })}
                                    {/* Latest Edit cell */}
                                    <td className="border-b border-r border-gray-100 dark:border-gray-800 px-3 py-1.5 h-9 min-w-[200px]">
                                        {row.updated_at ? (
                                            <div className="flex items-center gap-2">
                                                {/* Avatar initials */}
                                                <div className="w-5 h-5 rounded-full bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-[8px] font-bold text-violet-600 dark:text-violet-400 leading-none">
                                                        {(row.last_edited_by ?? '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-200 leading-tight truncate">
                                                        {row.last_edited_by ?? '—'}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400 dark:text-gray-500 leading-tight">
                                                        {new Date(row.updated_at).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-[10px] text-gray-300 dark:text-gray-600">—</span>
                                        )}
                                    </td>
                                    <td className="border-b border-gray-100 dark:border-gray-800 px-1 py-1 w-14">
                                        <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => setDrawer(row)} title="Detail"
                                                className="w-6 h-6 flex items-center justify-center rounded hover:bg-indigo-100 dark:hover:bg-indigo-950 text-indigo-500 text-xs">↗</button>
                                            <button onClick={() => deleteRow(row.id)} title="Hapus"
                                                className="w-6 h-6 flex items-center justify-center rounded hover:bg-red-50 dark:hover:bg-red-950/40 text-red-400 text-xs">✕</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button onClick={addRow}
                        className="sticky left-0 w-full text-left px-5 py-2.5 text-xs text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 transition border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
                        <span className="text-base leading-none">+</span> Tambah baris baru
                    </button>
                </div>
            )}

            {drawer && (
                <RowDrawer row={drawer} cols={cols} onClose={() => setDrawer(null)} onSave={saveDrawer} />
            )}
            {showAddCol && <AddColModal onClose={() => setShowAddCol(false)} onAdd={addCol} />}
        </div>
    );
}

// ─── Halaman utama (dengan API) ───────────────────────────────────────────────
export default function Database() {
    const [databases,  setDatabases]  = useState([]);
    const [activeDb,   setActiveDb]   = useState(null);
    const [showCreate, setShowCreate] = useState(false);
    const [loading,    setLoading]    = useState(true);

    useEffect(() => {
        api.get('/user-databases')
            .then(r => setDatabases(r.data))
            .finally(() => setLoading(false));
    }, []);

    const handleCreate = async (form) => {
        const { data } = await api.post('/user-databases', { name: form.name, type: form.type });
        setDatabases(ds => [data, ...ds]);
    };

    const handleDelete = async (id) => {
        setDatabases(ds => ds.filter(d => d.id !== id));
        await api.delete(`/user-databases/${id}`);
    };

    return (
        <BackendLayout>
            <div className="flex flex-col dark:bg-gray-950 dark:text-white transition-colors" style={{ height: 'calc(100vh - 56px)' }}>
                {activeDb ? (
                    <SpreadsheetView db={activeDb} onBack={() => setActiveDb(null)} />
                ) : (
                    <div className="flex-1 overflow-y-auto px-6 py-6 dark:bg-gray-950">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Database</h1>
                                <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">Kelola data dalam format spreadsheet terstruktur</p>
                            </div>
                            <button onClick={() => setShowCreate(true)}
                                className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition shadow-sm shadow-indigo-200">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                                Buat Database
                            </button>
                        </div>

                        {/* Cards */}
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {[1,2,3].map(i => <div key={i} className="h-36 bg-gray-100 rounded-2xl animate-pulse" />)}
                            </div>
                        ) : databases.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 text-center">
                                <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-4xl mb-5">🗄</div>
                                <p className="font-semibold text-gray-700 dark:text-gray-300 text-base mb-1">Belum ada database</p>
                                <p className="text-sm text-gray-400 dark:text-gray-500 mb-6 max-w-xs">Buat database pertama untuk mulai menyimpan dan mengelola data secara terstruktur</p>
                                <button onClick={() => setShowCreate(true)}
                                    className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                    </svg>
                                    Buat Database Pertama
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {databases.map(db => (
                                    <DbCard key={db.id} db={db}
                                        onOpen={setActiveDb}
                                        onDelete={handleDelete} />
                                ))}
                                {/* Card tambah baru */}
                                <button onClick={() => setShowCreate(true)}
                                    className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-8 text-gray-400 dark:text-gray-500 hover:border-indigo-400 dark:hover:border-indigo-600 hover:text-indigo-500 transition min-h-[140px]">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                    </svg>
                                    <span className="text-xs font-semibold">Buat Database Baru</span>
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {showCreate && <CreateDbModal onClose={() => setShowCreate(false)} onCreate={handleCreate} />}
            <style>{`@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
        </BackendLayout>
    );
}
