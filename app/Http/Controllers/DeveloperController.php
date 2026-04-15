<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDeveloperRequest;
use App\Http\Requests\UpdateDeveloperRequest;
use App\Models\Developer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DeveloperController extends Controller
{
    /**
     * Display the developer management page.
     */
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Developer::class);
        $canManageDevelopers = $request->user()?->can('create', Developer::class) ?? false;

        $developers = Developer::query()
            ->orderByDesc('updated_at')
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('developers/index', [
            'developers' => [
                'data' => $developers->getCollection()
                    ->map(fn (Developer $developer): array => $this->developerData($developer))
                    ->values()
                    ->all(),
                'meta' => [
                    'current_page' => $developers->currentPage(),
                    'last_page' => $developers->lastPage(),
                    'per_page' => $developers->perPage(),
                    'total' => $developers->total(),
                    'from' => $developers->firstItem(),
                    'to' => $developers->lastItem(),
                    'prev_page_url' => $developers->previousPageUrl(),
                    'next_page_url' => $developers->nextPageUrl(),
                ],
            ],
            'can' => [
                'create' => $canManageDevelopers,
                'update' => $canManageDevelopers,
                'delete' => $canManageDevelopers,
            ],
        ]);
    }

    /**
     * Store a newly created developer.
     */
    public function store(StoreDeveloperRequest $request): RedirectResponse
    {
        $this->authorize('create', Developer::class);

        Developer::query()->create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Developer added.')]);

        return to_route('developers.index');
    }

    /**
     * Update the specified developer.
     */
    public function update(UpdateDeveloperRequest $request, Developer $developer): RedirectResponse
    {
        $this->authorize('update', $developer);

        $developer->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Developer updated.')]);

        return back();
    }

    /**
     * Remove the specified developer.
     */
    public function destroy(Developer $developer): RedirectResponse
    {
        $this->authorize('delete', $developer);

        $developer->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Developer deleted.')]);

        return back();
    }

    /**
     * Transform a developer model into page data.
     *
     * @return array<string, mixed>
     */
    protected function developerData(Developer $developer): array
    {
        return [
            'id' => $developer->id,
            'name' => $developer->name,
            'email' => $developer->email,
            'specialization' => $developer->specialization,
            'created_at' => $developer->created_at?->toISOString(),
            'updated_at' => $developer->updated_at?->toISOString(),
        ];
    }
}
