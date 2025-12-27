import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import { X, User, KeyRound, LogOut, Loader2, Check, AlertCircle } from 'lucide-react';

const UserProfileModal = ({ isOpen, onClose, session }) => {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) throw error;
            setMessage('密碼已更新成功');
            setPassword('');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            onClose(); // Close modal, App.jsx will handle redirection to Auth
        } catch (error) {
            console.error('Logout error:', error);
            setError('登出失敗，請稍後再試');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-md bg-white dark:bg-[#0e0e11] border border-slate-200 dark:border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-white/[0.06] bg-slate-50/50 dark:bg-white/[0.02]">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <User className="w-5 h-5 text-indigo-500" />
                        個人資料
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {/* User Info */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">帳號資訊</label>
                        <div className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-white/[0.03] rounded-xl border border-slate-200 dark:border-white/[0.05]">
                            <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                {session?.user?.email?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <div className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                    {session?.user?.email}
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">
                                    已登入
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Change Password */}
                    <div className="space-y-4">
                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase flex items-center gap-2">
                            <KeyRound className="w-3.5 h-3.5" /> 修改密碼
                        </label>

                        <form onSubmit={handleUpdatePassword} className="space-y-3">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="輸入新密碼"
                                className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
                                minLength={6}
                                required
                            />

                            {(message || error) && (
                                <div className={`text-xs flex items-center gap-1.5 ${error ? 'text-rose-500' : 'text-emerald-500'}`}>
                                    {error ? <AlertCircle className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
                                    {message || error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading || !password}
                                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : '更新密碼'}
                            </button>
                        </form>
                    </div>

                    {/* Logout */}
                    <div className="pt-4 border-t border-slate-100 dark:border-white/[0.06]">
                        <button
                            onClick={handleLogout}
                            className="w-full py-3 rounded-xl border border-slate-200 dark:border-white/[0.1] hover:bg-rose-50 dark:hover:bg-rose-500/10 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-200 dark:hover:border-rose-500/20 transition-all text-sm font-medium flex items-center justify-center gap-2"
                        >
                            <LogOut className="w-4 h-4" />
                            登出帳戶
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfileModal;
