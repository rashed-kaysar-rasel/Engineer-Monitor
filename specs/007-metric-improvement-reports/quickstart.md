# Developer Quickstart: Metric Improvement Reports

This quickstart guides you through implementing the core reporting logic.

## 1. Helper Date Parsing (ReportService.php)

Helper to calculate start and end dates based on selected presets:

```php
public function getDatesForPreset(string $preset, int $offset = 0): array
{
    $now = now()->subWeeks($offset);

    if ($preset === 'weekly') {
        return [
            $now->copy()->startOfWeek()->toDateString(),
            $now->copy()->endOfWeek()->toDateString(),
        ];
    }

    if ($preset === 'monthly') {
        $month = now()->subMonths($offset);
        return [
            $month->copy()->startOfMonth()->toDateString(),
            $month->copy()->endOfMonth()->toDateString(),
        ];
    }

    throw new \InvalidArgumentException("Invalid preset type");
}
```

## 2. Database Aggregations Example

Aggregating bugs grouped by impact:

```php
$bugSeverityAgg = Bug::query()
    ->selectRaw('impact, count(*) as total')
    ->whereBetween('reported_at', [$startDate, $endDate])
    ->groupBy('impact')
    ->pluck('total', 'impact')
    ->toArray();
```

Aggregating developer velocity points:

```php
$velocityAgg = FeatureShipment::query()
    ->join('developers', 'feature_shipments.developer_id', '=', 'developers.id')
    ->selectRaw('developers.name, sum(feature_shipments.points) as total_points')
    ->whereBetween('feature_shipments.shipped_date', [$startDate, $endDate])
    ->groupBy('developers.name')
    ->get()
    ->pluck('total_points', 'name')
    ->toArray();
```

## 3. UI Comparison Indicators (React)

Helper logic for showing visual badges for metric improvements:

```tsx
const MetricIndicator = ({ percentage, inverse = false }: { percentage: number, inverse?: boolean }) => {
    // If inverse is true, a decrease (negative) is good (e.g. bugs)
    const isImproved = inverse ? percentage < 0 : percentage > 0;
    const formatted = `${percentage > 0 ? '+' : ''}${percentage.toFixed(1)}%`;

    if (percentage === 0) return <span className="text-muted-foreground text-xs">0% change</span>;

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
            isImproved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
            {formatted}
        </span>
    );
};
```
