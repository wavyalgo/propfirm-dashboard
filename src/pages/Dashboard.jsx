import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Auth from '../Auth';
import UserProfileModal from '../UserProfileModal';
import { useTheme } from '../context/ThemeContext';
import {
    DollarSign,
    ArrowDownCircle,
    ArrowUpCircle,
    Filter,
    PieChart as PieChartIcon,
    Activity,
    Plus,
    Wallet,
    ChevronDown,
    Settings,
    PieChart,
    User,
    Home,
    Sun,
    Moon,
} from 'lucide-react';
import { toast } from 'sonner';
import SettingsModal from '../components/SettingsModal';
import StatCard from '../components/StatCard';
import { DonutChart, ChartRow } from '../components/Charts';
import SankeyChart from '../components/SankeyChart';
import TransactionTable from '../components/TransactionTable';
import TransactionFormModal from '../components/TransactionFormModal';
import { normalizeStatus } from '../utils/helpers';

const Dashboard = () => {
    const { theme, toggleTheme } = useTheme();
    const [session, setSession] = useState(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    const [rawData, setRawData] = useState([]); // Start empty, fetch later
    const [isLoading, setIsLoading] = useState(true); // H5: 添加載入狀態

    // -- Master State --
    const [firms, setFirms] = useState([
        { name: 'Tradeify', type: '期貨' },
        { name: 'Apex', type: '期貨' },
        { name: 'Topstep', type: '期貨' },
        { name: 'FNF', type: 'CFD' },
        { name: 'Funding Pips', type: 'CFD' }
    ]);

    const [accountSizes, setAccountSizes] = useState(['25K', '50K', '100K', '150K', '200K', '300K', '400K']);
    const [accountStages, setAccountStages] = useState(['1階挑戰', '2階挑戰', '即時資金']);
    const [accountTypes, setAccountTypes] = useState(['考試帳號', 'Live', 'PA', 'Express', 'Funded']);
    const [accountStatuses, setAccountStatuses] = useState(['Active', 'Suspended', 'Failed', 'Passed', 'Withdrawn']);

    const [selectedCategory, setSelectedCategory] = useState('All'); // Global Filter
    const [selectedFirms, setSelectedFirms] = useState([]); // Multi-select Firm Filter
    const [selectedStages, setSelectedStages] = useState([]); // Multi-select Stage Filter
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isUserProfileOpen, setIsUserProfileOpen] = useState(false); // User Profile Modal State

    // -- Edit State --
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        firm: '', category: '期貨', accountStage: '', phase: '', size: '50K',
        baseCost: 0, cost: 0, revenue: 0, status: 'Active',
        accountStatus: 'Active',
        payouts: [], accountRecords: []
    });

    // Filtered Data based on Category, Firms, and Stages
    const filteredData = useMemo(() => {
        let data = rawData;
        // 1. Filter by Category
        if (selectedCategory !== "All") {
            data = data.filter(item => item.category === selectedCategory);
        }
        // 2. Filter by Selected Firms (if any selected)
        if (selectedFirms.length > 0) {
            data = data.filter(item => selectedFirms.includes(item.firm));
        }
        // 3. Filter by Selected Stages (if any selected)
        if (selectedStages.length > 0) {
            data = data.filter(item => selectedStages.includes(item.accountStage));
        }

        if (dateRange.start) {
            data = data.filter(item => item.date >= dateRange.start);
        }
        if (dateRange.end) {
            data = data.filter(item => item.date <= dateRange.end);
        }

        return data;
    }, [rawData, selectedCategory, selectedFirms, selectedStages, dateRange]);

    // Reset selected firms when category changes to avoid "stuck" hidden filters
    useEffect(() => {
        setSelectedFirms([]);
    }, [selectedCategory]);

    const filterOptions = useMemo(() => {
        if (selectedCategory === 'All') {
            // 使用 Set 去除重複的經紀商名稱
            const uniqueNames = [...new Set(firms.map(f => f.name))];
            return uniqueNames;
        }
        return firms.filter(f => f.type === selectedCategory).map(f => f.name);
    }, [firms, selectedCategory]);

    const financeStats = useMemo(() => {
        const totalExpenses = filteredData.reduce((acc, curr) => acc + Math.abs(Number(curr.cost)), 0);
        const totalRevenue = filteredData.reduce((acc, curr) => acc + Number(curr.revenue), 0);
        const netProfit = totalRevenue - totalExpenses;
        const roi = totalExpenses > 0 ? ((totalRevenue / totalExpenses) * 100).toFixed(1) : 0;

        return { totalExpenses, totalRevenue, netProfit, roi };
    }, [filteredData]);

    // --- Stats Calculation for Charts (Matches User Request: By Propfirm & Profit Margin) ---
    const chartStats = useMemo(() => {
        // Calculate Total Cost as Sum of ABSOLUTE values (handling mixed signs in user input)
        const totalCost = filteredData.reduce((acc, item) => acc + Math.abs(item.cost), 0);
        const totalRev = filteredData.reduce((acc, item) => acc + item.revenue, 0);
        const netProfit = totalRev - totalCost;

        // 1. Group by Firm
        const byFirm = filteredData.reduce((acc, item) => {
            if (!acc[item.firm]) acc[item.firm] = { cost: 0, revenue: 0 };
            acc[item.firm].cost += Math.abs(item.cost); // Accumulate absolute cost
            acc[item.firm].revenue += item.revenue;
            return acc;
        }, {});

        // Color Palette for Firms
        const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f43f5e', '#6366f1'];
        const getFirmColor = (index) => COLORS[index % COLORS.length];

        const firmsList = Object.keys(byFirm);

        // 2. Prepare Data for Charts
        // Payout Distribution (Revenue by Firm)
        const payoutStats = firmsList
            .map((firm, index) => ({
                label: firm,
                value: byFirm[firm].revenue,
                color: getFirmColor(index)
            }))
            .filter(item => item.value > 0)
            .sort((a, b) => b.value - a.value); // Sort by value desc

        // Cost Distribution (Cost by Firm)
        const costStats = firmsList
            .map((firm, index) => ({
                label: firm,
                value: byFirm[firm].cost, // Already absolute
                color: getFirmColor(index + 2) // Offset colors slightly for variety
            }))
            .filter(item => item.value > 0)
            .sort((a, b) => b.value - a.value);

        // Calculate Total specifically for the Chart (Sum of Absolutes) to ensure 100%
        // Since we already summed absolutes in byFirm and totalCost, we can just use totalCost.
        const totalCostForChart = totalCost;

        // 3. Profit Margin Distribution (Positive Net Profit by Firm)
        const marginStats = firmsList
            .map((firm, index) => {
                const firmStats = byFirm[firm];
                const firmNetProfit = firmStats.revenue - firmStats.cost; // Revenue - AbsCost
                return {
                    label: firm,
                    value: firmNetProfit,
                    color: getFirmColor(index + 4) // Offset colors
                };
            })
            .filter(item => item.value > 0) // Only positive net profit
            .sort((a, b) => b.value - a.value);

        const totalPositiveNetProfit = marginStats.reduce((acc, item) => acc + item.value, 0);

        return {
            totalExpenses: totalCost,
            totalRevenue: totalRev,
            netProfit: netProfit,
            roi: totalCost > 0 ? (totalRev / totalCost) * 100 : 0,
            payoutStats,
            costStats,
            totalCostForChart,
            marginStats,
            totalPositiveNetProfit
        };
    }, [filteredData]);

    // Derived list of firms based on selected category in form
    const availableFirms = useMemo(() => {
        return firms.filter(f => f.type === formData.category);
    }, [firms, formData.category]);

    // Normalize accountTypes for form select (convert grouped format to string[])
    // NOTE: accountTypes can be in 4 formats for backward compatibility:
    // 1. String array: ['Live', 'PA']
    // 2. Object array with name: [{name: 'Live', phase: 'phase1'}]
    // 3. Grouped format: [{id: 'group-1', phase1: [{name: 'Live'}], phase2: [...]}]
    // 4. Mixed format with single objects
    // This normalizer extracts all names into a flat string array for form selects
    const accountTypeNames = useMemo(() => {
        const names = [];

        // 輔助函數：從 phase 數據中提取名稱
        const extractNamesFromPhase = (phaseData) => {
            if (!phaseData) return;
            if (Array.isArray(phaseData)) {
                // 新數組格式：[{ id: 'item-xxx', name: 'xxx' }, ...]
                phaseData.forEach(item => {
                    if (item.name) names.push(item.name);
                });
            } else if (phaseData.name) {
                // 舊單對象格式：{ name: 'xxx', config: {...} }
                names.push(phaseData.name);
            }
        };

        accountTypes.forEach(type => {
            if (typeof type === 'string') {
                // 舊格式：直接是字符串
                names.push(type);
            } else if (type.name && !type.id) {
                // 舊對象格式：{ name: 'xxx', phase: 'phase1' }
                names.push(type.name);
            } else if (type.id) {
                // 新分組格式：{ id: 'group-xxx', phase1: [...], phase2: [...], funded: [...] }
                extractNamesFromPhase(type.phase1);
                extractNamesFromPhase(type.phase2);
                extractNamesFromPhase(type.funded);
            }
        });
        return names;
    }, [accountTypes]);

    // -- Data Fetching --
    const fetchTransactions = async () => {
        if (!session?.user) return;
        try {
            const { data, error } = await supabase
                .from('transactions')
                .select('*')
                .eq('user_id', session.user.id) // H2: 添加用戶 ID 過濾
                .order('date', { ascending: false });

            if (error) throw error;

            // Map DB snake_case to App camelCase
            const mappedData = data.map(item => ({
                ...item,
                baseCost: item.base_cost,
                accountStage: item.account_stage,
                accountRecords: item.account_records,
                accountStatus: item.account_status,
                // revenue/cost are stored as numbers in DB, ensure they are numbers (with NaN protection)
                cost: (Number(item.base_cost) || 0) + (item.account_records || []).reduce((sum, r) => {
                    const extraCost = Number(r?.extraCost);
                    return sum + (isNaN(extraCost) ? 0 : extraCost);
                }, 0),
                revenue: (item.payouts || []).reduce((sum, p) => {
                    if (p?.arrived !== '是') return sum;
                    const amount = Number(p?.amount);
                    return sum + (isNaN(amount) ? 0 : amount);
                }, 0)
            }));
            setRawData(mappedData);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            toast.error('載入交易數據時出錯');
        }
    };

    const fetchSettings = async () => {
        if (!session?.user) return;
        try {
            const { data, error } = await supabase
                .from('user_settings')
                .select('*')
                .eq('user_id', session.user.id)
                .single();

            if (error && error.code !== 'PGRST116') throw error; // Ignore not found error

            if (data) {
                let loadedFirms = data.firms && data.firms.length > 0 ? data.firms : firms;

                // 過濾掉 IBKR（如果存在）
                loadedFirms = loadedFirms.filter(f => f.name !== 'IBKR');

                setFirms(loadedFirms);
                if (data.account_sizes && data.account_sizes.length > 0) setAccountSizes(data.account_sizes);
                if (data.account_stages && data.account_stages.length > 0) setAccountStages(data.account_stages);
                if (data.account_types && data.account_types.length > 0) {
                    setAccountTypes(data.account_types);
                }
                if (data.account_statuses && data.account_statuses.length > 0) setAccountStatuses(data.account_statuses);
            } else {
                await saveSettingsToDB(firms, accountSizes, accountStages, accountTypes, accountStatuses);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
            toast.error('載入設置時出錯');
        }
    };

    useEffect(() => {
        let isMounted = true; // 防止組件卸載後更新狀態

        const loadData = async () => {
            if (session) {
                setIsLoading(true);
                try {
                    // Load settings first, then transactions (settings are needed for display)
                    await fetchSettings();
                    await fetchTransactions();
                } finally {
                    if (isMounted) {
                        setIsLoading(false);
                    }
                }
            } else {
                setIsLoading(false);
            }
        };
        loadData();

        return () => {
            isMounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session]);

    // Set default phase when accountTypes is loaded
    useEffect(() => {
        if (accountTypeNames.length > 0 && !formData.phase) {
            setFormData(prev => ({
                ...prev,
                phase: accountTypeNames[0]
            }));
        }
    }, [accountTypeNames, formData.phase]);

    // -- CRUD Operations --
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Form validation
        if (!formData.firm?.trim()) {
            toast.error('請選擇經紀商');
            return;
        }
        if (!formData.date) {
            toast.error('請選擇日期');
            return;
        }
        if (!formData.category) {
            toast.error('請選擇賬戶類型');
            return;
        }

        // Calculate final revenue and cost (with NaN protection)
        const finalRevenue = (formData.payouts || []).reduce((sum, p) => {
            if (p?.arrived !== '是') return sum;
            const amount = Number(p?.amount);
            return sum + (isNaN(amount) ? 0 : amount);
        }, 0);
        const finalCost = (Number(formData.baseCost) || 0) + (formData.accountRecords || []).reduce((sum, r) => {
            const extraCost = Number(r?.extraCost);
            return sum + (isNaN(extraCost) ? 0 : extraCost);
        }, 0);

        // 決定有效的賬戶狀態：如果有帳戶紀錄，使用最新記錄的狀態
        let effectiveAccountStatus = normalizeStatus(formData.accountStatus, 'Active');
        if (formData.accountRecords && formData.accountRecords.length > 0) {
            // 按日期降序排序，獲取最新的記錄
            const sortedRecords = [...formData.accountRecords].sort((a, b) =>
                new Date(b.date) - new Date(a.date)
            );
            const latestRecord = sortedRecords[0];
            // 如果最新記錄有狀態，使用它
            if (latestRecord.status) {
                effectiveAccountStatus = normalizeStatus(latestRecord.status);
            }
        }

        const dbRecord = {
            date: formData.date,
            firm: formData.firm,
            category: formData.category,
            account_stage: formData.accountStage,
            phase: formData.phase,
            size: formData.size,
            base_cost: formData.baseCost,
            payouts: formData.payouts || [],
            account_records: formData.accountRecords || [],
            account_status: effectiveAccountStatus,
            status: finalRevenue > 0 ? 'Payout' : 'Active', // Auto status based on revenue. Could be smarter.
            user_id: session.user.id
        };

        try {
            if (editingId) {
                const { data, error } = await supabase
                    .from('transactions')
                    .update(dbRecord)
                    .eq('id', editingId)
                    .select();
                if (error) throw error;
                toast.success('更新成功');
            } else {
                const { data, error } = await supabase
                    .from('transactions')
                    .insert([dbRecord])
                    .select();
                if (error) throw error;
                toast.success('新增成功');
            }
            fetchTransactions(); // Refresh data
            closeModal();
        } catch (error) {
            console.error('Error saving transaction:', error);
            toast.error('儲存失敗: ' + error.message);
        }
    };

    const handleDelete = useCallback(async (id) => {
        if (confirm('確定要刪除這筆交易紀錄嗎？')) {
            try {
                const { error } = await supabase
                    .from('transactions')
                    .delete()
                    .eq('id', id);
                if (error) throw error;
                // 直接從狀態中移除，避免 stale closure
                setRawData(prev => prev.filter(item => item.id !== id));
                toast.success('刪除成功');
            } catch (error) {
                console.error('Error deleting transaction:', error);
                toast.error('刪除失敗: ' + error.message);
            }
        }
    }, []);

    // Save Settings to DB
    const saveSettingsToDB = async (newFirms, newSizes, newStages, newTypes, newStatuses) => {
        if (!session?.user) return;
        try {
            const updates = {
                user_id: session.user.id,
                firms: newFirms || firms,
                account_sizes: newSizes || accountSizes,
                account_stages: newStages || accountStages,
                account_types: newTypes || accountTypes,
                account_statuses: newStatuses || accountStatuses,
            };

            const { data, error } = await supabase
                .from('user_settings')
                .upsert(updates, { onConflict: 'user_id' })
                .select();

            if (error) {
                console.error('Error saving settings:', error);
                toast.error('設置保存失敗: ' + (error.message || error.code || 'Unknown error'));
                throw error;
            }

            toast.success('設置已保存');
        } catch (error) {
            console.error('Error saving settings:', error);
            toast.error('保存時發生錯誤');
        }
    };

    // Update state wrappers to save to DB
    const updateFirms = (newFirms) => {
        setFirms(newFirms);
        saveSettingsToDB(newFirms, null, null, null, null);
    };
    const updateAccountSizes = (newSizes) => {
        setAccountSizes(newSizes);
        saveSettingsToDB(null, newSizes, null, null, null);
    };
    const updateAccountStages = (newStages) => {
        setAccountStages(newStages);
        saveSettingsToDB(null, null, newStages, null, null);
    };
    const updateAccountTypes = (newTypes) => {
        setAccountTypes(newTypes);
        saveSettingsToDB(null, null, null, newTypes, null).catch(err => {
            console.error('Failed to save account types:', err);
        });
    };
    const updateAccountStatuses = (newStatuses) => {
        setAccountStatuses(newStatuses);
        saveSettingsToDB(null, null, null, null, newStatuses);
    };


    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setEditingId(null);
        // Reset form with first account type from settings
        setFormData({
            date: new Date().toISOString().split('T')[0],
            firm: '', category: '期貨', accountStage: accountStages[0] || '', phase: accountTypeNames[0] || '', size: '50K',
            baseCost: 0, cost: 0, revenue: 0, status: 'Active',
            accountStatus: 'Active',
            payouts: [], accountRecords: []
        });
    }, [accountStages, accountTypeNames]);

    const startEdit = useCallback((item) => {
        setEditingId(item.id);

        // Map DB/App fields if coming specifically from rawData (which is already mapped, but good to be safe)
        setFormData({
            ...item,
            baseCost: item.baseCost !== undefined ? item.baseCost : item.cost,
            payouts: item.payouts || [],
            accountRecords: item.accountRecords || []
        });
        setIsModalOpen(true);
    }, []);

    if (!session) {
        return <Auth />;
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#050911] text-slate-800 dark:text-slate-200 font-sans selection:bg-emerald-500/30 overflow-x-hidden relative transition-colors duration-300">
            {/* 全局背景網格 */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.15]"></div>
            </div>

            <div className="max-w-7xl mx-auto p-6 lg:p-10 space-y-12 relative z-10">

                {/* Navbar */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <Link to="/" className="group cursor-pointer">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] group-hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all duration-300">
                                <Wallet className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                Propfirm <span className="text-slate-500 dark:text-slate-500 group-hover:text-slate-400 transition-colors">現金流組合</span>
                            </h1>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-sm font-medium ml-1 group-hover:text-slate-500 dark:group-hover:text-slate-300 transition-colors">追蹤您的交易資金與績效表現</p>
                    </Link>

                    <div className="flex items-center gap-4">
                        <Link
                            to="/"
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-emerald-500/30 transition-all text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-white font-medium text-sm"
                            title="返回首頁"
                        >
                            <Home className="w-5 h-5" />
                            <span className="hidden sm:inline">返回首頁</span>
                        </Link>

                        <button
                            onClick={toggleTheme}
                            className="p-3 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-emerald-500/30 transition-all text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-white"
                            title={theme === 'dark' ? "切換至日間模式" : "切換至夜間模式"}
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        <button
                            onClick={() => setIsSettingsOpen(true)}
                            className="p-3 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-emerald-500/30 transition-all text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-white"
                            title="基礎設置"
                        >
                            <Settings className="w-5 h-5" />
                        </button>

                        <button
                            onClick={() => setIsUserProfileOpen(true)}
                            className="p-3 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-emerald-500/30 transition-all text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-white"
                            title="個人資料"
                        >
                            <User className="w-5 h-5" />
                        </button>
                    </div>

                </header>

                {/* Unified Filter Toolbar */}
                <div className="bg-white dark:bg-[#111827] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg animate-in fade-in slide-in-from-top-4 duration-500 space-y-4">

                    {/* Top Row: Category, Date, Action Button */}
                    <div className="flex flex-col md:flex-row items-center gap-3">
                        {/* Category Selector */}
                        <div className="relative group min-w-[180px] w-full md:w-auto">
                            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-black/20 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all appearance-none cursor-pointer"
                            >
                                <option value="All">全部資產</option>
                                <option value="期貨">期貨</option>
                                <option value="CFD">CFD / 外匯</option>
                            </select>
                            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                                <ChevronDown className="w-3 h-3 text-slate-400" />
                            </div>
                        </div>

                        {/* Date Filter */}
                        <div className="flex items-center gap-2 bg-slate-50 dark:bg-black/20 p-2 rounded-xl border border-slate-300 dark:border-slate-700">
                            <input
                                type="date"
                                value={dateRange.start}
                                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                className="bg-transparent text-xs font-mono font-medium text-slate-400 focus:outline-none w-[100px] px-1"
                                title="開始日期"
                            />
                            <span className="text-slate-500">-</span>
                            <input
                                type="date"
                                value={dateRange.end}
                                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                className="bg-transparent text-xs font-mono font-medium text-slate-400 focus:outline-none w-[100px] px-1"
                                title="結束日期"
                            />
                            {(dateRange.start || dateRange.end) && (
                                <button
                                    onClick={() => setDateRange({ start: '', end: '' })}
                                    className="p-1 hover:bg-rose-500/10 rounded-md text-slate-400 hover:text-rose-500 transition-colors"
                                >
                                    <span className="text-[10px] font-bold">✕</span>
                                </button>
                            )}
                        </div>

                        <div className="flex-1"></div>

                        <button
                        onClick={() => {
                            setEditingId(null);
                            setFormData({
                                date: new Date().toISOString().split('T')[0],
                                firm: '',
                                category: '期貨',
                                accountStage: accountStages[0] || '',
                                phase: accountTypeNames[0] || '',
                                size: '50K',
                                baseCost: 0,
                                cost: 0,
                                revenue: 0,
                                status: 'Active',
                                accountStatus: 'Active',
                                payouts: [],
                                accountRecords: []
                            });
                            setIsModalOpen(true);
                        }}
                        className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-lg shadow-emerald-600/20 hover:scale-105 active:scale-95 ml-2 min-w-fit"
                    >
                        <Plus className="w-3.5 h-3.5" /> 新增紀錄
                    </button>
                </div>

                {/* Filter Chips Rows */}
                <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-700">
                    {/* Firm Filter Section */}
                    <div>
                        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">FILTER</div>
                        <div className="flex flex-wrap gap-2">
                            {filterOptions.map(firm => (
                                <button
                                    key={firm}
                                    onClick={() => {
                                        if (selectedFirms.includes(firm)) {
                                            setSelectedFirms(selectedFirms.filter(f => f !== firm));
                                        } else {
                                            setSelectedFirms([...selectedFirms, firm]);
                                        }
                                    }}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                        selectedFirms.includes(firm)
                                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                                            : 'bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700/50'
                                    }`}
                                >
                                    {firm}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Stage Filter Section */}
                    <div>
                        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">賬戶階段</div>
                        <div className="flex flex-wrap gap-2">
                            {accountStages.map(stage => (
                                <button
                                    key={stage}
                                    onClick={() => {
                                        if (selectedStages.includes(stage)) {
                                            setSelectedStages(selectedStages.filter(s => s !== stage));
                                        } else {
                                            setSelectedStages([...selectedStages, stage]);
                                        }
                                    }}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                        selectedStages.includes(stage)
                                            ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                                            : 'bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700/50'
                                    }`}
                                >
                                    {stage}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

                {/* 賬戶管理 Table */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3 px-2">
                        <Activity className="w-6 h-6 text-emerald-500" />
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white italic">賬戶管理</h2>
                    </div>
                    <TransactionTable
                        data={filteredData}
                        onEdit={startEdit}
                        onDelete={handleDelete}
                        accountTypes={accountTypes}
                        accountStages={accountStages}
                        accountStatuses={accountStatuses}
                    />
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="總投資成本" value={financeStats.totalExpenses} prefix="$" icon={<ArrowDownCircle />} color="text-rose-400" />
                    <StatCard title="總出金收益" value={financeStats.totalRevenue} prefix="$" icon={<ArrowUpCircle />} color="text-emerald-400" />
                    <StatCard title="淨利潤" value={financeStats.netProfit} prefix="$" icon={<DollarSign />} color={financeStats.netProfit >= 0 ? "text-cyan-400" : "text-rose-400"} />
                    <StatCard title="投資回報率 (ROI)" value={financeStats.roi} suffix="%" icon={<Activity />} color="text-purple-400" />
                </div>

                {/* Analytics Section */}
                <div className="flex flex-col gap-8">
                    {/* Charts */}
                    <div className="w-full bg-white dark:bg-[#111827]/60 backdrop-blur-sm rounded-3xl border border-slate-200 dark:border-slate-800 p-8 flex flex-col relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-50 group-hover:opacity-100 transition-opacity">
                            <div className="w-24 h-24 bg-emerald-500/20 blur-[60px] rounded-full pointer-events-none"></div>
                        </div>

                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                                    <PieChartIcon className="w-5 h-5 text-emerald-400" />
                                </div>
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white">資金分佈</h3>
                            </div>

                        </div>

                        <div className="flex-1 flex flex-col justify-center gap-10">
                            <ChartRow label="出金收益" value={chartStats.totalRevenue} total={chartStats.totalRevenue + chartStats.totalExpenses} color="bg-emerald-500" showPercent={false} />
                            <ChartRow label="成本支出" value={chartStats.totalExpenses} total={chartStats.totalRevenue + chartStats.totalExpenses} color="bg-rose-500" showPercent={false} />

                            <div className="mt-4 pt-6 border-t border-slate-200 dark:border-slate-700">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-600 dark:text-slate-400">利潤率 (收益/成本)</span>
                                    <span className="text-slate-900 dark:text-white font-mono font-bold">{chartStats.roi.toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-800/50 h-2 rounded-full mt-3 overflow-hidden">
                                    {/* Cap width at 100% for the bar, but text shows true percentage */}
                                    <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500" style={{ width: `${Math.min(100, Math.max(0, chartStats.roi))}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Multi-dimensional Comparison Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 px-2">
                        <PieChart className="w-6 h-6 text-emerald-500" />
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white italic">數據維度多重對比</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-[#111827]/60 backdrop-blur-sm p-8 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col items-center justify-center relative min-h-[320px]">
                            <h3 className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                                <ArrowUpCircle className="w-4 h-4 text-emerald-500" /> 出金收益分佈
                            </h3>
                            <DonutChart
                                data={chartStats.payoutStats}
                                total={chartStats.totalRevenue}
                                label="TOTAL REV"
                            />
                        </div>

                        <div className="bg-white dark:bg-[#111827]/60 backdrop-blur-sm p-8 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col items-center justify-center relative min-h-[320px]">
                            <h3 className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                                <ArrowDownCircle className="w-4 h-4 text-rose-500" /> 帳戶支出分佈 (By Firm)
                            </h3>
                            <DonutChart
                                data={chartStats.costStats}
                                total={chartStats.totalCostForChart}
                                label="TOTAL COST"
                            />
                        </div>

                        <div className="bg-white dark:bg-[#111827]/60 backdrop-blur-sm p-8 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col items-center justify-center relative min-h-[320px]">
                            <h3 className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-cyan-400" /> 利潤分佈 (Margin)
                            </h3>
                            <DonutChart
                                data={chartStats.marginStats}
                                total={chartStats.totalPositiveNetProfit}
                                label="NET PROFIT"
                            />
                        </div>
                    </div>
                </div>

                {/* Sankey Diagram Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 px-2">
                        <Activity className="w-6 h-6 text-emerald-500" />
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white italic">賬戶階段流向圖</h2>
                    </div>

                    <div className="bg-white dark:bg-[#111827]/60 backdrop-blur-sm p-8 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition-all">
                        <div className="mb-6">
                            <h3 className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-2">
                                帳戶紀錄階段流向分析
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-500">
                                桑基圖顯示當前篩選條件下，各帳戶紀錄從第一階段到後續階段的狀態變化流向
                            </p>
                        </div>
                        <SankeyChart data={filteredData} />
                    </div>
                </div>
            </div>

            {/* Add/Edit Transaction Modal */}
            <TransactionFormModal
                isOpen={isModalOpen}
                onClose={closeModal}
                isEditing={!!editingId}
                formData={formData}
                setFormData={setFormData}
                handleSubmit={handleSubmit}
                accountStages={accountStages}
                accountTypes={accountTypeNames}
                accountSizes={accountSizes}
                accountStatuses={accountStatuses}
                availableFirms={availableFirms}
            />

            {/* Settings Modal */}
            {isSettingsOpen && (
                <SettingsModal
                    isOpen={isSettingsOpen}
                    onClose={() => setIsSettingsOpen(false)}
                    firms={firms}
                    setFirms={updateFirms}
                    accountSizes={accountSizes}
                    setAccountSizes={updateAccountSizes}
                    accountStages={accountStages}
                    setAccountStages={updateAccountStages}
                    accountTypes={accountTypes}
                    setAccountTypes={updateAccountTypes}
                    accountStatuses={accountStatuses}
                    setAccountStatuses={updateAccountStatuses}
                />
            )}

            {/* User Profile Modal */}
            {isUserProfileOpen && (
                <UserProfileModal
                    isOpen={isUserProfileOpen}
                    onClose={() => setIsUserProfileOpen(false)}
                    session={session}
                />
            )}
        </div>
    );
};




export default Dashboard;
