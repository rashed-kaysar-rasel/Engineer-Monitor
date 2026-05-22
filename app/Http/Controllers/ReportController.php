<?php

namespace App\Http\Controllers;

use App\Http\Requests\GenerateReportRequest;
use App\Services\ReportService;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    protected ReportService $reportService;

    public function __construct(ReportService $reportService)
    {
        $this->reportService = $reportService;
    }

    /**
     * Handle the incoming request.
     */
    public function __invoke(GenerateReportRequest $request): Response
    {
        Gate::authorize('view-reports');

        $mode = $request->input('mode', 'single');
        $period = $request->input('period', 'monthly');
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $compareStartDate = $request->input('compare_start_date');
        $compareEndDate = $request->input('compare_end_date');
        $year = $request->input('year');
        $quarter = $request->input('quarter');

        $resolvedDates = $this->reportService->resolvePeriodDates(
            $period,
            $startDate,
            $endDate,
            $compareStartDate,
            $compareEndDate,
            $year ? (int) $year : null,
            $quarter ? (int) $quarter : null
        );

        $periodA = $resolvedDates['period_a'];
        $periodB = $resolvedDates['period_b'];

        $metricsB = $this->reportService->getMetricsForPeriod($periodB['start'], $periodB['end']);

        if ($mode === 'compare') {
            $metricsA = $this->reportService->getMetricsForPeriod($periodA['start'], $periodA['end']);
            $metrics = $this->reportService->comparePeriods($metricsA, $metricsB);
        } else {
            $metrics = [
                'bugs' => [
                    'period_b' => $metricsB['bugs']['total'],
                    'breakdown' => [
                        'period_b' => [
                            'by_project' => collect($metricsB['bugs']['by_project'])->map(fn($c, $p) => ['project_title' => $p, 'count' => $c])->values()->toArray(),
                            'by_severity' => $metricsB['bugs']['by_severity'],
                            'by_status' => $metricsB['bugs']['by_status'],
                        ]
                    ]
                ],
                'features' => [
                    'period_b' => $metricsB['features']['total'],
                    'breakdown' => [
                        'period_b' => [
                            'by_approver' => collect($metricsB['features']['by_approver'])->map(fn($c, $a) => ['approver_name' => $a, 'count' => $c])->values()->toArray(),
                            'by_developer' => collect($metricsB['features']['by_developer'])->map(fn($c, $d) => ['developer_name' => $d, 'count' => $c])->values()->toArray(),
                        ]
                    ]
                ],
                'complaints' => [
                    'period_b' => $metricsB['complaints']['total'],
                    'breakdown' => [
                        'period_b' => $metricsB['complaints']['by_severity'],
                    ]
                ],
                'velocity' => [
                    'team' => [
                        'period_b' => $metricsB['velocity']['team_total'],
                    ],
                    'developers' => collect($metricsB['velocity']['developers'])->map(fn($d) => [
                        'developer_name' => $d['developer_name'],
                        'period_b_points' => $d['total_points'],
                    ])->values()->toArray(),
                ]
            ];
        }

        return Inertia::render('reports/index', [
            'mode' => $mode,
            'period' => $period,
            'year' => $year ? (int) $year : (int) now()->year,
            'quarter' => $quarter ? (int) $quarter : (int) now()->quarter,
            'dates' => $resolvedDates,
            'metrics' => $metrics,
        ]);
    }
}
