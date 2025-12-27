import React, { useState, useMemo, useRef, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Auth from './Auth';
import UserProfileModal from './UserProfileModal';
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
    Sun,
    Moon,
    PieChart,
    User, // Added User icon
} from 'lucide-react';
import { toast } from 'sonner';
import SettingsModal from './components/SettingsModal';
import StatCard from './components/StatCard';
import { DonutChart, ChartRow } from './components/Charts';
import TransactionTable from './components/TransactionTable';
import TransactionFormModal from './components/TransactionFormModal';

const App = () => {
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


    // -- Master State --
    const [firms, setFirms] = useState([
        { name: 'Tradeify', type: '期貨' },
        { name: 'Apex', type: '期貨' },
        { name: 'Topstep', type: '期貨' },
        { name: 'FNF', type: 'CFD' },
        { name: 'Funding Pips', type: 'CFD' }
    ]);

    const [accountSizes, setAccountSizes] = useState(['25K', '50K', '100K', '150K', '200K', '300K', '400K']);
    const [accountTypes, setAccountTypes] = useState(['考試帳號', 'Live', 'PA', 'Express', 'Funded']);

    const [selectedCategory, setSelectedCategory] = useState('All'); // Global Filter
    const [selectedFirms, setSelectedFirms] = useState([]); // Multi-select Firm Filter
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isUserProfileOpen, setIsUserProfileOpen] = useState(false); // User Profile Modal State

    // -- Theme State --
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    // -- Edit State --
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        firm: '', category: '期貨', phase: '考試帳號', size: '50K', nickname: '',
        baseCost: 0, cost: 0, revenue: 0, status: 'Active',
        payouts: [], accountRecords: []
    });

    // Filtered Data based on Category AND Selected Firms
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

        if (dateRange.start) {
            data = data.filter(item => item.date >= dateRange.start);
        }
        if (dateRange.end) {
            data = data.filter(item => item.date <= dateRange.end);
        }

        return data;
    }, [rawData, selectedCategory, selectedFirms, dateRange]);

    // Reset selected firms when category changes to avoid "stuck" hidden filters
    useEffect(() => {
        setSelectedFirms([]);
    }, [selectedCategory]);

    const filterOptions = useMemo(() => {
        if (selectedCategory === 'All') return firms.map(f => f.name);
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

    // -- Data Fetching --
    const fetchTransactions = async () => {
        if (!session?.user) return;
        try {
            const { data, error } = await supabase
                .from('transactions')
                .select('*')
                .order('date', { ascending: false });

            if (error) throw error;

            // Map DB snake_case to App camelCase
            const mappedData = data.map(item => ({
                ...item,
                baseCost: item.base_cost,
                accountRecords: item.account_records,
                // revenue/cost are stored as numbers in DB, ensure they are numbers
                cost: Number(item.base_cost || 0) + (item.account_records || []).reduce((sum, r) => sum + Number(r.extraCost || 0), 0),
                revenue: (item.payouts || []).reduce((sum, p) => sum + Number(p.amount || 0), 0)
            }));
            setRawData(mappedData);
        } catch (error) {
            console.error('Error fetching transactions:', error);
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
                if (data.firms && data.firms.length > 0) setFirms(data.firms);
                if (data.account_sizes && data.account_sizes.length > 0) setAccountSizes(data.account_sizes);
                if (data.account_types && data.account_types.length > 0) setAccountTypes(data.account_types);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        }
    };

    useEffect(() => {
        if (session) {
            fetchTransactions();
            fetchSettings();
        }
    }, [session]);

    // -- CRUD Operations --
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Calculate final revenue and cost
        const finalRevenue = formData.payouts.reduce((sum, p) => sum + Number(p.amount), 0);
        const finalCost = Number(formData.baseCost) + formData.accountRecords.reduce((sum, r) => sum + Number(r.extraCost), 0);

        const dbRecord = {
            date: formData.date,
            firm: formData.firm,
            category: formData.category,
            phase: formData.phase,
            size: formData.size,
            nickname: formData.nickname,
            base_cost: formData.baseCost,
            payouts: formData.payouts,
            account_records: formData.accountRecords,
            status: finalRevenue > 0 ? 'Payout' : 'Active', // Auto status based on revenue. Could be smarter.
            user_id: session.user.id
        };

        try {
            if (editingId) {
                const { error } = await supabase
                    .from('transactions')
                    .update(dbRecord)
                    .eq('id', editingId);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('transactions')
                    .insert([dbRecord]);
                if (error) throw error;
            }
            fetchTransactions(); // Refresh data
            closeModal();
        } catch (error) {
            console.error('Error saving transaction:', error);
            toast.error('儲存失敗: ' + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (confirm('確定要刪除這筆交易紀錄嗎？')) {
            try {
                const { error } = await supabase
                    .from('transactions')
                    .delete()
                    .eq('id', id);
                if (error) throw error;
                fetchTransactions();
            } catch (error) {
                console.error('Error deleting transaction:', error);
                toast.error('刪除失敗: ' + error.message);
            }
        }
    };

    // Save Settings to DB
    const saveSettingsToDB = async (newFirms, newSizes, newTypes) => {
        if (!session?.user) return;
        try {
            const updates = {
                user_id: session.user.id,
                firms: newFirms || firms,
                account_sizes: newSizes || accountSizes,
                account_types: newTypes || accountTypes,
            };

            const { error } = await supabase
                .from('user_settings')
                .upsert(updates);

            if (error) throw error;
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    };

    // Update state wrappers to save to DB
    const updateFirms = (newFirms) => {
        setFirms(newFirms);
        saveSettingsToDB(newFirms, null, null);
    };
    const updateAccountSizes = (newSizes) => {
        setAccountSizes(newSizes);
        saveSettingsToDB(null, newSizes, null);
    };
    const updateAccountTypes = (newTypes) => {
        setAccountTypes(newTypes);
        saveSettingsToDB(null, null, newTypes);
    };


    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        // Reset form
        setFormData({
            date: new Date().toISOString().split('T')[0],
            firm: '', category: '期貨', phase: '考試帳號', size: '50K', nickname: '',
            baseCost: 0, cost: 0, revenue: 0, status: 'Active',
            payouts: [], accountRecords: []
        });
    };

    const startEdit = (item) => {
        setEditingId(item.id);

        // Map DB/App fields if coming specifically from rawData (which is already mapped, but good to be safe)
        setFormData({
            ...item,
            baseCost: item.baseCost !== undefined ? item.baseCost : item.cost,
            payouts: item.payouts || [],
            accountRecords: item.accountRecords || []
        });
        setIsModalOpen(true);
    };

    if (!session) {
        return <Auth />;
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] selection:bg-indigo-500/30 transition-colors duration-300">
            <div className="max-w-7xl mx-auto p-6 lg:p-10 space-y-12">

                {/* Navbar */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                                <Wallet className="w-6 h-6 text-indigo-400" />
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                Propfirm <span className="text-slate-500">資金分析</span>
                            </h1>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium ml-1">追蹤您的交易資金流向</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-3 rounded-xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-all text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-white"
                            title={theme === 'dark' ? "切換至日間模式" : "切換至夜間模式"}
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        <button
                            onClick={() => setIsSettingsOpen(true)}
                            className="p-3 rounded-xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-all text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-white"
                            title="基礎設置"
                        >
                            <Settings className="w-5 h-5" />
                        </button>

                        <button
                            onClick={() => setIsUserProfileOpen(true)}
                            className="p-3 rounded-xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-all text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-white"
                            title="個人資料"
                        >
                            <User className="w-5 h-5" />
                        </button>
                    </div>

                </header>

                {/* Unified Filter Toolbar */}
                <div className="bg-white dark:bg-white/[0.03] p-1.5 rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-sm flex flex-col md:flex-row items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-500">

                    {/* Category Selector (Left Side of Toolbar) */}
                    <div className="relative group min-w-[180px] w-full md:w-auto">
                        <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/[0.05] rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-all appearance-none cursor-pointer"
                        >
                            <option value="All">全部資產</option>
                            <option value="期貨">期貨</option>
                            <option value="CFD">CFD / 外匯</option>
                        </select>
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                            <ChevronDown className="w-3 h-3 text-slate-400" />
                        </div>
                    </div>

                    <div className="hidden md:block w-px h-8 bg-slate-200 dark:bg-white/[0.08] mx-2"></div>

                    {/* Date Filter */}
                    <div className="flex items-center gap-2 bg-slate-50 dark:bg-black/20 p-1 rounded-xl border border-slate-200 dark:border-white/[0.05]">
                        <input
                            type="date"
                            value={dateRange.start}
                            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                            className="bg-transparent text-xs font-mono font-medium text-slate-600 dark:text-slate-400 focus:outline-none w-[100px] px-1"
                            title="開始日期"
                        />
                        <span className="text-slate-300">-</span>
                        <input
                            type="date"
                            value={dateRange.end}
                            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                            className="bg-transparent text-xs font-mono font-medium text-slate-600 dark:text-slate-400 focus:outline-none w-[100px] px-1"
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

                    <div className="hidden md:block w-px h-8 bg-slate-200 dark:bg-white/[0.08] mx-2"></div>

                    {/* Firm Filter Chips (Right Side of Toolbar) */}
                    <div className="flex-1 w-full flex flex-wrap items-center gap-2 px-1">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 hidden md:flex items-center gap-1">
                            <span className="text-[10px] bg-slate-100 dark:bg-white/[0.1] px-1.5 py-0.5 rounded text-slate-500">FILTER</span>
                        </div>
                        {filterOptions.map(firmName => (
                            <button
                                key={firmName}
                                onClick={() => {
                                    if (selectedFirms.includes(firmName)) {
                                        setSelectedFirms(selectedFirms.filter(f => f !== firmName));
                                    } else {
                                        setSelectedFirms([...selectedFirms, firmName]);
                                    }
                                }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${selectedFirms.includes(firmName)
                                    ? 'bg-indigo-500 text-white border-indigo-500 shadow-md shadow-indigo-500/20' // Active
                                    : 'bg-transparent text-slate-500 dark:text-slate-400 border-transparent hover:bg-slate-100 dark:hover:bg-white/[0.1] hover:text-indigo-500 dark:hover:text-indigo-400' // Inactive
                                    }`}
                            >
                                {firmName}
                                {selectedFirms.includes(firmName) && <span className="ml-1.5 opacity-60">×</span>}
                            </button>
                        ))}
                        {selectedFirms.length > 0 && (
                            <button
                                onClick={() => setSelectedFirms([])}
                                className="ml-auto text-xs font-bold text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                清除 ({selectedFirms.length})
                            </button>
                        )}
                    </div>

                    <button
                        onClick={() => { setEditingId(null); setIsModalOpen(true); }}
                        className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-lg shadow-indigo-600/20 hover:scale-105 active:scale-95 ml-2 min-w-fit"
                    >
                        <Plus className="w-3.5 h-3.5" /> 新增紀錄
                    </button>
                </div>



                {/* KPI Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="總投資成本" value={financeStats.totalExpenses} prefix="$" icon={<ArrowDownCircle />} color="text-rose-500 dark:text-rose-400" trend="-2.5%" trendUp={false} />
                    <StatCard title="總出金收益" value={financeStats.totalRevenue} prefix="$" icon={<ArrowUpCircle />} color="text-emerald-500 dark:text-emerald-400" trend="+12.4%" trendUp={true} />
                    <StatCard title="淨利潤" value={financeStats.netProfit} prefix="$" icon={<DollarSign />} color={financeStats.netProfit >= 0 ? "text-indigo-500 dark:text-indigo-400" : "text-rose-500 dark:text-rose-400"} trend="Active" trendUp={true} />
                    <StatCard title="投資回報率 (ROI)" value={financeStats.roi} suffix="%" icon={<Activity />} color="text-violet-500 dark:text-violet-400" trend="All time" trendUp={true} />
                </div>

                {/* Multi-dimensional Comparison Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 px-2">
                        <PieChart className="w-6 h-6 text-indigo-500" />
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white italic">數據維度多重對比</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="glass-card p-8 rounded-3xl flex flex-col items-center justify-center relative min-h-[320px]">
                            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                                <ArrowUpCircle className="w-4 h-4 text-emerald-500" /> 出金收益分佈
                            </h3>
                            <DonutChart
                                data={chartStats.payoutStats}
                                total={chartStats.totalRevenue}
                                label="TOTAL REV"
                            />
                        </div>

                        <div className="glass-card p-8 rounded-3xl flex flex-col items-center justify-center relative min-h-[320px]">
                            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                                <ArrowDownCircle className="w-4 h-4 text-rose-500" /> 帳戶支出分佈 (By Firm)
                            </h3>
                            <DonutChart
                                data={chartStats.costStats}
                                total={chartStats.totalCostForChart}
                                label="TOTAL COST"
                            />
                        </div>

                        <div className="glass-card p-8 rounded-3xl flex flex-col items-center justify-center relative min-h-[320px]">
                            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-indigo-500" /> 利潤分佈 (Margin)
                            </h3>
                            <DonutChart
                                data={chartStats.marginStats}
                                total={chartStats.totalPositiveNetProfit}
                                label="NET PROFIT"
                            />
                        </div>
                    </div>
                </div>

                {/* Analytics Section */}
                <div className="flex flex-col gap-8">
                    {/* Charts */}
                    <div className="w-full glass-card rounded-3xl p-8 flex flex-col relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-50 group-hover:opacity-100 transition-opacity">
                            <div className="w-24 h-24 bg-indigo-500/20 blur-[60px] rounded-full pointer-events-none"></div>
                        </div>

                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-500/10 rounded-lg">
                                    <PieChartIcon className="w-5 h-5 text-indigo-400" />
                                </div>
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white">資金分佈</h3>
                            </div>

                        </div>

                        <div className="flex-1 flex flex-col justify-center gap-10">
                            <ChartRow label="出金收益" value={chartStats.totalRevenue} total={chartStats.totalRevenue + chartStats.totalExpenses} color="bg-emerald-500" showPercent={false} />
                            <ChartRow label="成本支出" value={chartStats.totalExpenses} total={chartStats.totalRevenue + chartStats.totalExpenses} color="bg-rose-500" showPercent={false} />

                            <div className="mt-4 pt-6 border-t border-slate-100 dark:border-white/[0.06]">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500 dark:text-slate-400">利潤率 (收益/成本)</span>
                                    <span className="text-slate-900 dark:text-white font-mono font-bold">{chartStats.roi.toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-800/50 h-2 rounded-full mt-3 overflow-hidden">
                                    {/* Cap width at 100% for the bar, but text shows true percentage */}
                                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: `${Math.min(100, Math.max(0, chartStats.roi))}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <TransactionTable
                        data={filteredData}
                        onEdit={startEdit}
                        onDelete={handleDelete}
                    />
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
                accountTypes={accountTypes}
                accountSizes={accountSizes}
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
                    accountTypes={accountTypes}
                    setAccountTypes={updateAccountTypes}
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




export default App;
