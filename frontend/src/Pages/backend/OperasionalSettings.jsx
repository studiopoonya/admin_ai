import { useEffect, useState } from 'react';
import BackendLayout from '@/Layouts/BackendLayout';
import { Link } from 'react-router-dom';
import api from '@/api/axios';
import { useAuth } from '@/context/AuthContext';

const SECTIONS = [
    { key: 'booths',     label: 'Type Booth',         icon: '🎪', placeholder: 'cth: Booth 1, Open Booth...', color: 'violet' },
    { key: 'printers',   label: 'Printer',             icon: '🖨️', placeholder: 'cth: DNP, Fuji, Canon...',   color: 'sky'    },
    { key: 'transports', label: 'Transport / Driver',  icon: '🚗', placeholder: 'cth: Pasha, Budi...',        color: 'amber'  },
];

const COLOR = {
    violet: { chip: 'bg-violet-100 text-violet-700',   input: 'focus:border-violet-400', btn: 'bg-violet-600 hover:bg-violet-700' },
    sky:    { chip: 'bg-sky-100 text-sky-700',         input: 'focus:border-sky-400',    btn: 'bg-sky-600 hover:bg-sky-700'       },
    amber:  { chip: 'bg-amber-100 text-amber-700',     input: 'focus:border-amber-400',  btn: 'bg-amber-500 hover:bg-amber-600'   },
};

const EMPTY_STAFF = { name: '', email: '', password: '' };

function AddStaffModal({ onClose, onCreated }) {
    const [form, setForm]     = useState(EMPTY_STAFF);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [showPw, setShowPw] = useState(false);

    const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: undefined })); };

    const submit = async (e) => {
        e.preventDefault();
        setSaving(true); setErrors({});
        try {
            const r = await api.post('/users', { ...form, role: 'staff_operasional' });
            onCreated(r.data);
        } catch (err) {
            if (err.response?.status === 422) setErrors(err.response.data.errors ?? {});
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm animate-scaleIn">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold text-gray-900 text-sm">Tambah Staff Operasional</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Role otomatis: <span className="font-medium text-emerald-600">Staff Operasional</span></p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <form onSubmit={submit} className="px-6 py-5 space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Nama *</label>
                        <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nama staff"
                            className={`w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} />
                        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name[0]}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Email *</label>
                        <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@studio.com"
                            className={`w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} />
                        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email[0]}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Password *</label>
                        <div className="relative">
                            <input type={showPw ? 'text' : 'password'} value={form.password}
                                onChange={e => set('password', e.target.value)}
                                placeholder="Min. 6 karakter" autoComplete="new-password"
                                className={`w-full rounded-xl border px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} />
                            <button type="button" onClick={() => setShowPw(v => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    {showPw
                                        ? <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        : <><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
                                    }
                                </svg>
                            </button>
                        </div>
                        {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password[0]}</p>}
                    </div>
                    <div className="flex gap-3 pt-1">
                        <button type="button" onClick={onClose}
                            className="flex-1 rounded-xl border border-gray-200 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
                            Batal
                        </button>
                        <button type="submit" disabled={saving}
                            className="flex-1 rounded-xl bg-emerald-600 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60 transition">
                            {saving ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function OperasionalSettings() {
    const { user }  = useAuth();
    const isAdmin   = user?.role === 'admin';

    const [assets, setAssets]       = useState({ booths: [], printers: [], transports: [], staff: [] });
    const [loading, setLoading]     = useState(true);
    const [saved,   setSaved]       = useState(null);
    const [inputs,  setInputs]      = useState({ booths: '', printers: '', transports: '' });
    const [showStaffModal, setShowStaffModal] = useState(false);

    useEffect(() => {
        api.get('/op-assets').then(r => setAssets(r.data)).finally(() => setLoading(false));
    }, []);

    const save = async (key, nextList) => {
        try {
            const { data } = await api.post('/op-assets', { [key]: nextList });
            setAssets(a => ({ ...a, [key]: data[key] }));
            setSaved(key);
            setTimeout(() => setSaved(null), 1800);
        } catch {}
    };

    const addItem = (key) => {
        const val = inputs[key].trim();
        if (!val || assets[key].includes(val)) { setInputs(i => ({ ...i, [key]: '' })); return; }
        setInputs(i => ({ ...i, [key]: '' }));
        save(key, [...assets[key], val]);
    };

    const removeItem = (key, item) => save(key, assets[key].filter(x => x !== item));

    const handleStaffCreated = (newUser) => {
        setAssets(a => ({ ...a, staff: [...a.staff, newUser] }));
        setShowStaffModal(false);
    };

    if (loading) return (
        <BackendLayout>
            <div className="flex items-center justify-center h-64">
                <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        </BackendLayout>
    );

    return (
        <BackendLayout>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

                {/* Header */}
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Pengaturan Operasional</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Kelola daftar booth, printer, dan driver yang muncul sebagai pilihan di halaman Form Booking.
                    </p>
                </div>

                {/* 3 editable asset sections */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {SECTIONS.map(({ key, label, icon, placeholder, color }) => {
                        const c = COLOR[color];
                        return (
                            <div key={key} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">{icon}</span>
                                        <h2 className="font-bold text-gray-800 text-sm">{label}</h2>
                                    </div>
                                    {saved === key && (
                                        <span className="text-[11px] font-semibold text-green-600 flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                                            </svg>
                                            Tersimpan
                                        </span>
                                    )}
                                </div>

                                <div className="flex-1 min-h-[80px]">
                                    {assets[key].length === 0 ? (
                                        <p className="text-xs text-gray-400 italic">Belum ada item. Tambahkan di bawah.</p>
                                    ) : (
                                        <div className="flex flex-wrap gap-2">
                                            {assets[key].map(item => (
                                                <span key={item}
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${c.chip}`}>
                                                    {item}
                                                    <button onClick={() => removeItem(key, item)}
                                                        className="opacity-60 hover:opacity-100 transition font-bold text-sm hover:text-red-500">×</button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <input type="text" value={inputs[key]}
                                        onChange={e => setInputs(i => ({ ...i, [key]: e.target.value }))}
                                        onKeyDown={e => e.key === 'Enter' && addItem(key)}
                                        placeholder={placeholder}
                                        className={`flex-1 text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none ${c.input} transition`}
                                    />
                                    <button onClick={() => addItem(key)} disabled={!inputs[key].trim()}
                                        className={`text-xs text-white px-3 py-2 rounded-xl font-bold transition disabled:opacity-40 ${c.btn}`}>
                                        + Tambah
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Staff Operasional section */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <span className="text-lg">👥</span>
                            <div>
                                <h2 className="font-bold text-gray-800 text-sm">Staff Operasional</h2>
                                <p className="text-xs text-gray-400 mt-0.5">Akun dengan role <span className="font-semibold text-emerald-600">Staff Operasional</span></p>
                            </div>
                        </div>
                        <button onClick={() => setShowStaffModal(true)}
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition flex items-center gap-1 px-3 py-1.5 rounded-xl hover:bg-indigo-50">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
                            </svg>
                            Tambah Staff
                        </button>
                    </div>

                    {assets.staff.length === 0 ? (
                        <div className="py-8 text-center">
                            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">👤</div>
                            <p className="text-sm font-medium text-gray-600">Belum ada staff operasional</p>
                            <p className="text-xs text-gray-400 mt-1">Tambah akun baru dengan role <strong>Staff Operasional</strong></p>
                            <button onClick={() => setShowStaffModal(true)}
                                className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition">
                                + Tambah Staff Operasional
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {assets.staff.map(s => (
                                <div key={s.id} className="flex items-center gap-3 bg-emerald-50 rounded-xl px-4 py-3">
                                    <div className="w-9 h-9 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-800 text-sm font-bold flex-shrink-0">
                                        {(s.name ?? '?').charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-gray-800 truncate">{s.name}</p>
                                        <p className="text-[11px] text-gray-500 truncate">{s.email}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info box */}
                <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4 text-sm text-blue-800 flex gap-3">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <div>
                        <p className="font-semibold">Cara pakai</p>
                        <ul className="mt-1 space-y-0.5 text-blue-700 text-xs list-disc list-inside">
                            <li>Daftar di atas otomatis muncul sebagai pilihan di kolom operasional Form Booking.</li>
                            <li>Tekan <strong>Enter</strong> atau klik <strong>Tambah</strong> untuk menambah item.</li>
                            <li>Klik <strong>×</strong> pada chip untuk menghapus item. Perubahan langsung tersimpan.</li>
                            {isAdmin && (
                                <li>Staff Operasional juga dapat dikelola dari halaman <Link to="/users" className="underline font-semibold">Users</Link>.</li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>

            {showStaffModal && (
                <AddStaffModal
                    onClose={() => setShowStaffModal(false)}
                    onCreated={handleStaffCreated}
                />
            )}
        </BackendLayout>
    );
}
