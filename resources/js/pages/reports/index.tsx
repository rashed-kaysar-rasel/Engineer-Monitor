import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, TrendingDown, Bug, MessageSquare, Rocket, Calendar, ArrowRight, Minus, Users } from 'lucide-react';

interface DateRange {
    start: string;
    end: string;
}

interface PeriodDates {
    period_a: DateRange;
    period_b: DateRange;
}

interface ProjectBreakdown {
    project_title: string;
    count: number;
}

interface ApproverBreakdown {
    approver_name: string;
    count: number;
}

interface DeveloperBreakdown {
    developer_name: string;
    count: number;
}

interface BugsBreakdown {
    by_project: ProjectBreakdown[];
    by_severity: Record<string, number>;
    by_status: Record<string, number>;
}

interface FeaturesBreakdown {
    by_approver: ApproverBreakdown[];
    by_developer: DeveloperBreakdown[];
}

interface MetricCompare<TBreakdown> {
    period_a?: number;
    period_b: number;
    percentage_change?: number;
    improved?: boolean;
    breakdown: {
        period_a?: TBreakdown;
        period_b: TBreakdown;
    };
}

interface DeveloperVelocity {
    developer_name: string;
    period_a_points?: number;
    period_b_points: number;
    percentage_change?: number;
    improved?: boolean;
}

interface VelocityCompare {
    team: {
        period_a?: number;
        period_b: number;
        percentage_change?: number;
        improved?: boolean;
    };
    developers: DeveloperVelocity[];
}

interface ReportProps {
    mode: 'single' | 'compare';
    period: 'weekly' | 'monthly' | 'quarterly' | 'custom';
    year: number;
    quarter: number;
    dates: PeriodDates;
    metrics: {
        bugs: MetricCompare<BugsBreakdown>;
        features: MetricCompare<FeaturesBreakdown>;
        complaints: MetricCompare<Record<string, number>>;
        velocity: VelocityCompare;
    };
}

export default function ReportsIndex({ mode: initialMode, period: initialPeriod, year, quarter, dates, metrics }: ReportProps) {
    const [mode, setMode] = useState<'single' | 'compare'>(initialMode);
    const [period, setPeriod] = useState<'weekly' | 'monthly' | 'quarterly' | 'custom'>(initialPeriod);
    const [selectedYear, setSelectedYear] = useState<number>(year);
    const [selectedQuarter, setSelectedQuarter] = useState<number>(quarter);

    // Date range inputs
    const [startDate, setStartDate] = useState(dates.period_b.start);
    const [endDate, setEndDate] = useState(dates.period_b.end);
    const [compareStartDate, setCompareStartDate] = useState(dates.period_a.start);
    const [compareEndDate, setCompareEndDate] = useState(dates.period_a.end);

    const handleGenerate = () => {
        router.get(
            '/reports',
            {
                mode,
                period,
                year: period === 'quarterly' ? selectedYear : undefined,
                quarter: period === 'quarterly' ? selectedQuarter : undefined,
                start_date: period === 'custom' ? startDate : undefined,
                end_date: period === 'custom' ? endDate : undefined,
                compare_start_date: mode === 'compare' && period === 'custom' ? compareStartDate : undefined,
                compare_end_date: mode === 'compare' && period === 'custom' ? compareEndDate : undefined,
            },
            {
                preserveState: true,
            }
        );
    };

    const handleReset = () => {
        setMode('single');
        setPeriod('monthly');
        setSelectedYear(new Date().getFullYear());
        setSelectedQuarter(Math.floor(new Date().getMonth() / 3) + 1);
        router.get('/reports', { mode: 'single', period: 'monthly' });
    };

    const renderDeltaBadge = (percentage: number | undefined, improved: boolean | undefined, inverse = false) => {
        if (percentage === undefined || isNaN(percentage)) return null;

        const isImproved = inverse ? percentage < 0 : percentage > 0;
        const arrow = percentage > 0 ? <TrendingUp className="w-3.5 h-3.5 mr-1" /> : percentage < 0 ? <TrendingDown className="w-3.5 h-3.5 mr-1" /> : <Minus className="w-3.5 h-3.5 mr-1" />;
        const label = `${percentage > 0 ? '+' : ''}${percentage.toFixed(1)}%`;

        if (percentage === 0) {
            return (
                <Badge variant="secondary" className="font-semibold text-xs py-0.5">
                    {arrow} {label}
                </Badge>
            );
        }

        return (
            <Badge
                variant={isImproved ? 'default' : 'destructive'}
                className={`font-semibold text-xs py-0.5 border-none shadow-sm ${
                    isImproved ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-rose-500 hover:bg-rose-600 text-white'
                }`}
            >
                {arrow} {label}
            </Badge>
        );
    };

    return (
        <>
            <Head title="Metric Improvement Reports" />

            <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-muted pb-5">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
                            <BarChart3 className="w-8 h-8 text-primary" />
                            Metric Improvement Reports
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1.5">
                            Generate detailed engineering velocity and system stability performance reviews.
                        </p>
                    </div>
                </div>

                {/* Filters Card */}
                <Card className="shadow-sm border border-muted/80 backdrop-blur-sm bg-card/60">
                    <CardHeader className="py-4">
                        <CardTitle className="text-lg">Report Configurations</CardTitle>
                        <CardDescription>Select reporting mode, presets, and customized date ranges.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            {/* Mode Selection */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-muted-foreground">Report Mode</label>
                                <Select value={mode} onValueChange={(val: 'single' | 'compare') => setMode(val)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select mode" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="single">Single Period Summary</SelectItem>
                                        <SelectItem value="compare">Compare Periods (Delta)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Preset Period */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-muted-foreground">Preset Period</label>
                                <Select value={period} onValueChange={(val: 'weekly' | 'monthly' | 'quarterly' | 'custom') => setPeriod(val)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select preset" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="weekly">Weekly Range</SelectItem>
                                        <SelectItem value="monthly">Monthly Range</SelectItem>
                                        <SelectItem value="quarterly">Quarterly Range</SelectItem>
                                        <SelectItem value="custom">Custom Date Range</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Quarterly Year and Quarter selectors */}
                            {period === 'quarterly' && (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-muted-foreground">Select Year</label>
                                        <Select value={String(selectedYear)} onValueChange={(val) => setSelectedYear(Number(val))}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Year" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {[2024, 2025, 2026, 2027, 2028].map((y) => (
                                                    <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-muted-foreground">Select Quarter</label>
                                        <Select value={String(selectedQuarter)} onValueChange={(val) => setSelectedQuarter(Number(val))}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Quarter" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1">Q1 (Jan - Mar)</SelectItem>
                                                <SelectItem value="2">Q2 (Apr - Jun)</SelectItem>
                                                <SelectItem value="3">Q3 (Jul - Sep)</SelectItem>
                                                <SelectItem value="4">Q4 (Oct - Dec)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </>
                            )}

                            {/* Period B Custom Range */}
                            {period === 'custom' && (
                                <div className="space-y-2 sm:col-span-2">
                                    <label className="text-xs font-semibold text-muted-foreground">
                                        {mode === 'compare' ? 'Period B (Newer Period)' : 'Report Date Range'}
                                    </label>
                                    <div className="flex gap-2 items-center">
                                        <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full" />
                                        <span className="text-muted-foreground text-xs"><ArrowRight className="w-4 h-4" /></span>
                                        <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full" />
                                    </div>
                                </div>
                            )}

                            {/* Period A Custom Range (Compare only) */}
                            {mode === 'compare' && period === 'custom' && (
                                <div className="space-y-2 sm:col-span-2 md:col-start-3">
                                    <label className="text-xs font-semibold text-muted-foreground">Period A (Older Period)</label>
                                    <div className="flex gap-2 items-center">
                                        <Input type="date" value={compareStartDate} onChange={(e) => setCompareStartDate(e.target.value)} className="w-full" />
                                        <span className="text-muted-foreground text-xs"><ArrowRight className="w-4 h-4" /></span>
                                        <Input type="date" value={compareEndDate} onChange={(e) => setCompareEndDate(e.target.value)} className="w-full" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2 pt-2 justify-end">
                            <Button variant="ghost" onClick={handleReset} className="text-muted-foreground hover:text-foreground">
                                Reset Settings
                            </Button>
                            <Button onClick={handleGenerate} className="gap-2">
                                <Calendar className="w-4 h-4" />
                                Generate Report
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Display resolved dates */}
                <div className="text-sm bg-muted/30 border border-muted/50 rounded-lg p-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">Reporting Range (Period B):</span>
                        <code className="bg-muted px-2 py-0.5 rounded text-xs text-muted-foreground font-mono">
                            {dates.period_b.start}
                        </code>
                        <span className="text-muted-foreground text-xs">to</span>
                        <code className="bg-muted px-2 py-0.5 rounded text-xs text-muted-foreground font-mono">
                            {dates.period_b.end}
                        </code>
                    </div>
                    {mode === 'compare' && (
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground">Compare Range (Period A):</span>
                            <code className="bg-muted px-2 py-0.5 rounded text-xs text-muted-foreground font-mono">
                                {dates.period_a.start}
                            </code>
                            <span className="text-muted-foreground text-xs">to</span>
                            <code className="bg-muted px-2 py-0.5 rounded text-xs text-muted-foreground font-mono">
                                {dates.period_a.end}
                            </code>
                        </div>
                    )}
                </div>

                {/* Metrics Summary Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Bugs Card */}
                    <Card className="transition-all hover:shadow-md border border-muted/80">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Bugs Overview</CardTitle>
                            <Bug className="h-4.5 w-4.5 text-rose-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-baseline justify-between">
                                <div className="text-2xl font-extrabold">{metrics.bugs.period_b}</div>
                                {mode === 'compare' && renderDeltaBadge(metrics.bugs.percentage_change, metrics.bugs.improved, true)}
                            </div>
                            {mode === 'compare' && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    Compare: {metrics.bugs.period_a} bug{metrics.bugs.period_a !== 1 ? 's' : ''} in Period A
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Features Card */}
                    <Card className="transition-all hover:shadow-md border border-muted/80">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Features Shipped</CardTitle>
                            <Rocket className="h-4.5 w-4.5 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-baseline justify-between">
                                <div className="text-2xl font-extrabold">{metrics.features.period_b}</div>
                                {mode === 'compare' && renderDeltaBadge(metrics.features.percentage_change, metrics.features.improved)}
                            </div>
                            {mode === 'compare' && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    Compare: {metrics.features.period_a} feature{metrics.features.period_a !== 1 ? 's' : ''} in Period A
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Client Complaints Card */}
                    <Card className="transition-all hover:shadow-md border border-muted/80">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Client Complaints</CardTitle>
                            <MessageSquare className="h-4.5 w-4.5 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-baseline justify-between">
                                <div className="text-2xl font-extrabold">{metrics.complaints.period_b}</div>
                                {mode === 'compare' && renderDeltaBadge(metrics.complaints.percentage_change, metrics.complaints.improved, true)}
                            </div>
                            {mode === 'compare' && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    Compare: {metrics.complaints.period_a} complaint{metrics.complaints.period_a !== 1 ? 's' : ''} in Period A
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Team Velocity Card */}
                    <Card className="transition-all hover:shadow-md border border-muted/80">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Team Velocity</CardTitle>
                            <TrendingUp className="h-4.5 w-4.5 text-indigo-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-baseline justify-between">
                                <div className="text-2xl font-extrabold">{metrics.velocity.team.period_b} pts</div>
                                {mode === 'compare' && renderDeltaBadge(metrics.velocity.team.percentage_change, metrics.velocity.team.improved)}
                            </div>
                            {mode === 'compare' && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    Compare: {metrics.velocity.team.period_a} points in Period A
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Developer Velocity Side-by-Side Table (Required) */}
                <Card className="border border-muted/80 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Users className="w-5 h-5 text-indigo-500" />
                            Developer Velocity Breakdown
                        </CardTitle>
                        <CardDescription>
                            Sum points of shipped feature tasks completed by each developer.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Developer Name</th>
                                        {mode === 'compare' && <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Period A Points</th>}
                                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Period B Points</th>
                                        {mode === 'compare' && <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground w-[180px]">Change Delta</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {metrics.velocity.developers.length === 0 ? (
                                        <tr>
                                            <td colSpan={mode === 'compare' ? 4 : 2} className="text-center text-muted-foreground py-8 text-sm">
                                                No shipments recorded in these periods.
                                            </td>
                                        </tr>
                                    ) : (
                                        metrics.velocity.developers.map((dev, idx) => (
                                            <tr key={idx} className="border-b transition-colors hover:bg-muted/50">
                                                <td className="p-4 align-middle font-medium text-foreground">{dev.developer_name}</td>
                                                {mode === 'compare' && (
                                                    <td className="p-4 align-middle text-right font-mono text-muted-foreground">
                                                        {dev.period_a_points ?? 0} pts
                                                    </td>
                                                )}
                                                <td className="p-4 align-middle text-right font-semibold font-mono text-foreground">
                                                    {dev.period_b_points} pts
                                                </td>
                                                {mode === 'compare' && (
                                                    <td className="p-4 align-middle text-center">
                                                        {renderDeltaBadge(dev.percentage_change, dev.improved)}
                                                    </td>
                                                )}
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Bug and Leadership Breakdowns */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Bugs Detail Breakdowns */}
                    <Card className="border border-muted/80 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Bug className="w-5 h-5 text-rose-500" />
                                Bugs Breakdown
                            </CardTitle>
                            <CardDescription>Bugs grouped by project, severity status, and resolutions.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* By Project */}
                            <div>
                                <h3 className="text-sm font-bold text-foreground mb-3">Bugs by Project (Period B)</h3>
                                <div className="space-y-2">
                                    {(metrics.bugs.breakdown.period_b.by_project || []).length === 0 ? (
                                        <p className="text-xs text-muted-foreground italic">No bugs reported in this period.</p>
                                    ) : (
                                        metrics.bugs.breakdown.period_b.by_project.map((p, idx) => (
                                            <div key={idx} className="flex justify-between items-center text-sm border-b border-muted pb-1">
                                                <span className="text-muted-foreground">{p.project_title}</span>
                                                <Badge variant="outline" className="font-semibold">{p.count} bug{p.count !== 1 ? 's' : ''}</Badge>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Severity and Status Grids */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Severity Impact (Period B)</h4>
                                    <div className="space-y-1.5">
                                        {Object.entries(metrics.bugs.breakdown.period_b.by_severity || {}).map(([sev, count]) => (
                                            <div key={sev} className="flex justify-between items-center text-xs">
                                                <span className="capitalize">{sev}</span>
                                                <span className="font-semibold text-foreground">{count}</span>
                                            </div>
                                        ))}
                                        {Object.keys(metrics.bugs.breakdown.period_b.by_severity || {}).length === 0 && (
                                            <p className="text-xs text-muted-foreground italic">No items.</p>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Resolution Status (Period B)</h4>
                                    <div className="space-y-1.5">
                                        {Object.entries(metrics.bugs.breakdown.period_b.by_status || {}).map(([status, count]) => (
                                            <div key={status} className="flex justify-between items-center text-xs">
                                                <span className="capitalize">{status}</span>
                                                <span className="font-semibold text-foreground">{count}</span>
                                            </div>
                                        ))}
                                        {Object.keys(metrics.bugs.breakdown.period_b.by_status || {}).length === 0 && (
                                            <p className="text-xs text-muted-foreground italic">No items.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Features & Leadership Breakdowns */}
                    <Card className="border border-muted/80 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Rocket className="w-5 h-5 text-emerald-500" />
                                Features & Approver Detail
                            </CardTitle>
                            <CardDescription>Features shipped by individual developers and by leadership (approver).</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Leadership / Approver */}
                            <div>
                                <h3 className="text-sm font-bold text-foreground mb-3">Approved By (Leadership breakdown)</h3>
                                <div className="space-y-2">
                                    {(metrics.features.breakdown.period_b.by_approver || []).length === 0 ? (
                                        <p className="text-xs text-muted-foreground italic">No shipments approved in this period.</p>
                                    ) : (
                                        metrics.features.breakdown.period_b.by_approver.map((app, idx) => (
                                            <div key={idx} className="flex justify-between items-center text-sm border-b border-muted pb-1">
                                                <span className="text-muted-foreground">{app.approver_name}</span>
                                                <Badge className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold border-none">
                                                    {app.count} approved
                                                </Badge>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Features By Developer */}
                            <div>
                                <h3 className="text-sm font-bold text-foreground mb-3">Features Shipped By Developer</h3>
                                <div className="space-y-2">
                                    {(metrics.features.breakdown.period_b.by_developer || []).length === 0 ? (
                                        <p className="text-xs text-muted-foreground italic">No shipments logged in this period.</p>
                                    ) : (
                                        metrics.features.breakdown.period_b.by_developer.map((dev, idx) => (
                                            <div key={idx} className="flex justify-between items-center text-sm border-b border-muted pb-1">
                                                <span className="text-muted-foreground">{dev.developer_name}</span>
                                                <Badge className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold border-none">
                                                    {dev.count} shipped
                                                </Badge>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
