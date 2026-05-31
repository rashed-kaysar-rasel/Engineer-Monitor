<?php

namespace App\Services;

use App\Models\Bug;
use App\Models\ClientComplaint;
use App\Models\FeatureShipment;
use Carbon\Carbon;

class ReportService
{
    /**
     * Resolve start and end dates for Period A and Period B based on preset or custom parameters.
     */
    public function resolvePeriodDates(string $period, ?string $start = null, ?string $end = null, ?string $compareStart = null, ?string $compareEnd = null, ?int $year = null, ?int $quarter = null): array
    {
        if ($period === 'weekly') {
            $periodB_start = now()->startOfWeek()->toDateString();
            $periodB_end = now()->endOfWeek()->toDateString();
            
            $periodA_start = now()->subWeek()->startOfWeek()->toDateString();
            $periodA_end = now()->subWeek()->endOfWeek()->toDateString();
        } elseif ($period === 'monthly') {
            $periodB_start = now()->startOfMonth()->toDateString();
            $periodB_end = now()->endOfMonth()->toDateString();
            
            $periodA_start = now()->subMonth()->startOfMonth()->toDateString();
            $periodA_end = now()->subMonth()->endOfMonth()->toDateString();
        } elseif ($period === 'quarterly') {
            $y = $year ?? now()->year;
            $q = $quarter ?? now()->quarter;

            $dateB = Carbon::create($y, ($q - 1) * 3 + 1, 1);
            
            $periodB_start = $dateB->copy()->startOfQuarter()->toDateString();
            $periodB_end = $dateB->copy()->endOfQuarter()->toDateString();
            
            $dateA = $dateB->copy()->subQuarter();
            $periodA_start = $dateA->copy()->startOfQuarter()->toDateString();
            $periodA_end = $dateA->copy()->endOfQuarter()->toDateString();
        } else {
            // custom range
            $periodB_start = $start ?? now()->startOfMonth()->toDateString();
            $periodB_end = $end ?? now()->endOfMonth()->toDateString();
            
            if ($compareStart && $compareEnd) {
                $periodA_start = $compareStart;
                $periodA_end = $compareEnd;
            } else {
                $diffInDays = Carbon::parse($periodB_start)->diffInDays(Carbon::parse($periodB_end)) + 1;
                $periodA_start = Carbon::parse($periodB_start)->subDays($diffInDays)->toDateString();
                $periodA_end = Carbon::parse($periodB_start)->subDay()->toDateString();
            }
        }
        
        return [
            'period_a' => [
                'start' => $periodA_start,
                'end' => $periodA_end,
            ],
            'period_b' => [
                'start' => $periodB_start,
                'end' => $periodB_end,
            ],
        ];
    }

    /**
     * Retrieve aggregated metrics for a specific date range.
     */
    public function getMetricsForPeriod(string $startDate, string $endDate): array
    {
        // 1. Bugs Summary
        $bugsQuery = Bug::query()->whereBetween('reported_at', [$startDate, $endDate]);
        
        $totalBugs = (clone $bugsQuery)->count();
        
        $bugsByProject = Bug::query()
            ->join('projects', 'bugs.project_id', '=', 'projects.id')
            ->selectRaw('projects.title as project_title, count(*) as count')
            ->whereBetween('bugs.reported_at', [$startDate, $endDate])
            ->groupBy('projects.title')
            ->pluck('count', 'project_title')
            ->toArray();
            
        $bugsBySeverity = (clone $bugsQuery)
            ->selectRaw('impact, count(*) as count')
            ->groupBy('impact')
            ->pluck('count', 'impact')
            ->toArray();
            
        $bugsByStatus = (clone $bugsQuery)
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        // 2. Features Summary
        $featuresQuery = FeatureShipment::query()->whereBetween('shipped_date', [$startDate, $endDate]);
        
        $totalFeatures = (clone $featuresQuery)->count();
        
        $featuresByApprover = FeatureShipment::query()
            ->join('users', 'feature_shipments.approver_id', '=', 'users.id')
            ->selectRaw('users.name as approver_name, count(*) as count')
            ->whereBetween('feature_shipments.shipped_date', [$startDate, $endDate])
            ->groupBy('users.name')
            ->pluck('count', 'approver_name')
            ->toArray();

        $featuresByDeveloper = FeatureShipment::query()
            ->join('developers', 'feature_shipments.developer_id', '=', 'developers.id')
            ->selectRaw('developers.name as developer_name, count(*) as count')
            ->whereBetween('feature_shipments.shipped_date', [$startDate, $endDate])
            ->groupBy('developers.name')
            ->pluck('count', 'developer_name')
            ->toArray();

        // 3. Client Complaints Summary
        $complaintsQuery = ClientComplaint::query()->whereBetween('reported_date', [$startDate, $endDate]);
        
        $totalComplaints = (clone $complaintsQuery)->count();
        
        $complaintsBySeverity = (clone $complaintsQuery)
            ->selectRaw('impact_level, count(*) as count')
            ->groupBy('impact_level')
            ->pluck('count', 'impact_level')
            ->toArray();

        // 4. Developer Velocity (Sum of points of completed feature shipments for each developer)
        $developerVelocity = FeatureShipment::query()
            ->join('developers', 'feature_shipments.developer_id', '=', 'developers.id')
            ->selectRaw('developers.id as developer_id, developers.name as developer_name, sum(feature_shipments.points) as total_points')
            ->whereBetween('feature_shipments.shipped_date', [$startDate, $endDate])
            ->groupBy('developers.id', 'developers.name')
            ->get()
            ->map(fn($row) => [
                'developer_id' => $row->developer_id,
                'developer_name' => $row->developer_name,
                'total_points' => (int) $row->total_points,
            ])
            ->toArray();

        return [
            'bugs' => [
                'total' => $totalBugs,
                'by_project' => $bugsByProject,
                'by_severity' => $bugsBySeverity,
                'by_status' => $bugsByStatus,
            ],
            'features' => [
                'total' => $totalFeatures,
                'by_approver' => $featuresByApprover,
                'by_developer' => $featuresByDeveloper,
            ],
            'complaints' => [
                'total' => $totalComplaints,
                'by_severity' => $complaintsBySeverity,
            ],
            'velocity' => [
                'developers' => $developerVelocity,
                'team_total' => (int) collect($developerVelocity)->sum('total_points'),
            ],
        ];
    }

    /**
     * Compare Period A metrics against Period B metrics.
     */
    public function comparePeriods(array $metricsA, array $metricsB): array
    {
        $bugsA = $metricsA['bugs']['total'];
        $bugsB = $metricsB['bugs']['total'];
        $bugsPct = $this->calculatePercentageChange($bugsA, $bugsB);

        $featuresA = $metricsA['features']['total'];
        $featuresB = $metricsB['features']['total'];
        $featuresPct = $this->calculatePercentageChange($featuresA, $featuresB);

        $complaintsA = $metricsA['complaints']['total'];
        $complaintsB = $metricsB['complaints']['total'];
        $complaintsPct = $this->calculatePercentageChange($complaintsA, $complaintsB);

        $teamVelA = $metricsA['velocity']['team_total'];
        $teamVelB = $metricsB['velocity']['team_total'];
        $teamVelPct = $this->calculatePercentageChange($teamVelA, $teamVelB);

        // Combine developers from both periods to compare velocity
        $devsA = collect($metricsA['velocity']['developers'])->keyBy('developer_name');
        $devsB = collect($metricsB['velocity']['developers'])->keyBy('developer_name');
        
        $allDevNames = $devsA->keys()->concat($devsB->keys())->unique()->sort();
        
        $devsComparison = [];
        foreach ($allDevNames as $name) {
            $pointsA = $devsA->get($name)['total_points'] ?? 0;
            $pointsB = $devsB->get($name)['total_points'] ?? 0;
            $pct = $this->calculatePercentageChange($pointsA, $pointsB);
            
            $devsComparison[] = [
                'developer_name' => $name,
                'period_a_points' => $pointsA,
                'period_b_points' => $pointsB,
                'percentage_change' => $pct,
                'improved' => $pct > 0,
            ];
        }

        return [
            'bugs' => [
                'period_a' => $bugsA,
                'period_b' => $bugsB,
                'percentage_change' => $bugsPct,
                'improved' => $bugsPct < 0,
                'breakdown' => [
                    'period_a' => [
                        'by_project' => collect($metricsA['bugs']['by_project'])->map(fn($c, $p) => ['project_title' => $p, 'count' => $c])->values()->toArray(),
                        'by_severity' => $metricsA['bugs']['by_severity'],
                        'by_status' => $metricsA['bugs']['by_status'],
                    ],
                    'period_b' => [
                        'by_project' => collect($metricsB['bugs']['by_project'])->map(fn($c, $p) => ['project_title' => $p, 'count' => $c])->values()->toArray(),
                        'by_severity' => $metricsB['bugs']['by_severity'],
                        'by_status' => $metricsB['bugs']['by_status'],
                    ],
                ]
            ],
            'features' => [
                'period_a' => $featuresA,
                'period_b' => $featuresB,
                'percentage_change' => $featuresPct,
                'improved' => $featuresPct > 0,
                'breakdown' => [
                    'period_a' => [
                        'by_approver' => collect($metricsA['features']['by_approver'])->map(fn($c, $a) => ['approver_name' => $a, 'count' => $c])->values()->toArray(),
                        'by_developer' => collect($metricsA['features']['by_developer'])->map(fn($c, $d) => ['developer_name' => $d, 'count' => $c])->values()->toArray(),
                    ],
                    'period_b' => [
                        'by_approver' => collect($metricsB['features']['by_approver'])->map(fn($c, $a) => ['approver_name' => $a, 'count' => $c])->values()->toArray(),
                        'by_developer' => collect($metricsB['features']['by_developer'])->map(fn($c, $d) => ['developer_name' => $d, 'count' => $c])->values()->toArray(),
                    ],
                ]
            ],
            'complaints' => [
                'period_a' => $complaintsA,
                'period_b' => $complaintsB,
                'percentage_change' => $complaintsPct,
                'improved' => $complaintsPct < 0,
                'breakdown' => [
                    'period_a' => $metricsA['complaints']['by_severity'],
                    'period_b' => $metricsB['complaints']['by_severity'],
                ]
            ],
            'velocity' => [
                'team' => [
                    'period_a' => $teamVelA,
                    'period_b' => $teamVelB,
                    'percentage_change' => $teamVelPct,
                    'improved' => $teamVelPct > 0,
                ],
                'developers' => $devsComparison,
            ]
        ];
    }

    /**
     * Compute percentage delta change, handling boundary conditions.
     */
    protected function calculatePercentageChange(float|int $a, float|int $b): float
    {
        if ($a == 0) {
            return $b > 0 ? 100.0 : ($b < 0 ? -100.0 : 0.0);
        }
        return round((($b - $a) / $a) * 100, 2);
    }
}
