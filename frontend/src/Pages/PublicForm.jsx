import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

// Public API — no auth token, direct to backend
const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
});

const SELECT_COLORS = [
    'bg-violet-100 text-violet-700','bg-blue-100 text-blue-700','bg-green-100 text-green-700',
    'bg-yellow-100 text-yellow-700','bg-pink-100 text-pink-700','bg-orange-100 text-orange-700',
];

export default function PublicForm() {
    const { token } = useParams();
    const [config,    setConfig]    = useState(null);   // { db_name, cols }
    const [formData,  setFormData]  = useState({});
    const [name,      setName]      = useState('');
    const [status,    setStatus]    = useState('idle'); // idle | loading | submitting | success | error | notfound
    const [errMsg,    setErrMsg]    = useState('');

    useEffect(() => {
        setStatus('loading');
        api.get(`/public-form/${token}`)
            .then(r => { setConfig(r.data); setStatus('idle'); })
            .catch(e => setStatus(e.response?.status === 404 ? 'notfound' : 'error'));
    }, [token]);

    const set = (key, val) => setFormData(d => ({ ...d, [key]: val }));

    const submit = async () => {
        if (!name.trim()) { setErrMsg('Nama wajib diisi'); return; }
        setErrMsg('');
        setStatus('submitting');
        try {
            await api.post(`/public-form/${token}`, {
                data:         formData,
                submitted_by: name.trim(),
            });
            setStatus('success');
            setFormData({});
            setName('');
        } catch {
            setStatus('error');
            setErrMsg('Gagal mengirim. Coba lagi.');
        }
    };

    /* ── Not found ── */
    if (status === 'notfound') return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="text-center">
                <div className="text-5xl mb-4">🔗</div>
                <h1 className="text-xl font-bold text-gray-800 mb-2">Link tidak ditemukan</h1>
                <p className="text-gray-400 text-sm">Form ini mungkin sudah dinonaktifkan.</p>
            </div>
        </div>
    );

    /* ── Error ── */
    if (status === 'error') return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="text-center">
                <div className="text-5xl mb-4">⚠️</div>
                <h1 className="text-xl font-bold text-gray-800 mb-2">Terjadi kesalahan</h1>
                <p className="text-gray-400 text-sm mb-4">Tidak bisa memuat form. Periksa koneksi dan coba lagi.</p>
                <button onClick={() => window.location.reload()} className="text-indigo-600 text-sm font-semibold underline">Muat ulang</button>
            </div>
        </div>
    );

    /* ── Loading ── */
    if (status === 'loading' || !config) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    /* ── Success ── */
    if (status === 'success') return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-xl px-10 py-12 max-w-sm w-full text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                    <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Terkirim!</h2>
                <p className="text-gray-500 mb-8">Terima kasih, data kamu sudah berhasil kami terima.</p>
                <button onClick={() => setStatus('idle')}
                    className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-2xl hover:bg-indigo-700 transition">
                    Isi lagi
                </button>
            </div>
        </div>
    );

    /* ── Form ── */
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 py-10 px-4">
            <div className="max-w-lg mx-auto">

                {/* Header card */}
                <div className={`bg-gradient-to-r ${config.form_color || 'from-indigo-500 to-violet-600'} rounded-3xl px-8 py-8 mb-4 shadow-lg shadow-black/10`}>
                    {/* Logo or icon */}
                    {config.form_logo ? (
                        <div className="w-16 h-16 rounded-2xl overflow-hidden mb-4 shadow-md bg-white/20">
                            <img src={config.form_logo} alt="logo" className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4 text-3xl">
                            {config.form_icon || '📋'}
                        </div>
                    )}
                    <h1 className="text-2xl font-bold text-white leading-tight">{config.db_name}</h1>
                    <p className="text-white/70 text-sm mt-1">Isi form di bawah dan klik Kirim</p>
                </div>

                {/* Form card */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 px-8 py-8 space-y-6">

                    {/* Nama pengisi — always required */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Nama kamu <span className="text-red-400">*</span>
                        </label>
                        <input value={name} onChange={e => setName(e.target.value)}
                            placeholder="Masukkan nama kamu..."
                            className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                    </div>

                    {/* Dynamic fields */}
                    {config.cols.map(col => (
                        <div key={col.id}>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">{col.label}</label>

                            {col.type === 'select' ? (
                                <select value={formData[col.col_key] ?? ''} onChange={e => set(col.col_key, e.target.value)}
                                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
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
                                                set(col.col_key, next.filter(Boolean).join(', '));
                                            }} className={`text-sm px-4 py-2 rounded-full font-medium border transition ${active ? SELECT_COLORS[i % SELECT_COLORS.length] + ' border-transparent' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                                                {o}
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : col.type === 'checkbox' ? (
                                <div className="flex items-center gap-3">
                                    <button type="button" onClick={() => set(col.col_key, !formData[col.col_key])}
                                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition ${formData[col.col_key] ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'}`}>
                                        {formData[col.col_key] && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
                                    </button>
                                    <span className="text-sm text-gray-600">{formData[col.col_key] ? 'Ya' : 'Tidak'}</span>
                                </div>
                            ) : col.type === 'rating' ? (
                                <div className="flex gap-2">
                                    {[1,2,3,4,5].map(n => (
                                        <button key={n} type="button" onClick={() => set(col.col_key, n)}
                                            className={`text-3xl transition hover:scale-110 ${n <= (Number(formData[col.col_key]) || 0) ? 'text-yellow-400' : 'text-gray-200'}`}>★</button>
                                    ))}
                                </div>
                            ) : col.type === 'longtext' ? (
                                <textarea value={formData[col.col_key] ?? ''} onChange={e => set(col.col_key, e.target.value)}
                                    rows={4} placeholder={`Masukkan ${col.label}...`}
                                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" />
                            ) : (
                                <input
                                    type={col.type === 'date' ? 'date' : col.type === 'datetime' ? 'datetime-local'
                                        : (col.type === 'number' || col.type === 'currency' || col.type === 'percent') ? 'number'
                                        : col.type === 'email' ? 'email' : col.type === 'url' ? 'url'
                                        : col.type === 'phone' ? 'tel' : 'text'}
                                    value={formData[col.col_key] ?? ''}
                                    onChange={e => set(col.col_key, e.target.value)}
                                    placeholder={`Masukkan ${col.label}...`}
                                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                            )}
                        </div>
                    ))}

                    {errMsg && (
                        <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-2">{errMsg}</p>
                    )}

                    <button onClick={submit} disabled={status === 'submitting'}
                        className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-indigo-700 transition disabled:opacity-60 flex items-center justify-center gap-2 text-base mt-2">
                        {status === 'submitting' && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                        {status === 'submitting' ? 'Mengirim...' : 'Kirim'}
                    </button>
                </div>

                <p className="text-center text-xs text-gray-400 mt-6">Powered by Poonya Bot</p>
            </div>
        </div>
    );
}
