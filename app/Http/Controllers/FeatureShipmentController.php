<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFeatureShipmentRequest;
use App\Jobs\GenerateFeatureEmbeddingJob;
use App\Models\FeatureShipment;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class FeatureShipmentController extends Controller
{
    use AuthorizesRequests;

    public function index(): Response
    {
        $this->authorize('viewAny', FeatureShipment::class);

        $shipments = FeatureShipment::with(['developer', 'approver', 'project'])
            ->latest()
            ->paginate(10);

        $developers = \App\Models\Developer::select('id', 'name')->orderBy('name')->get();
        $approvers = User::whereHas('roleAssignments.role', function ($query) {
            $query->whereIn('slug', ['admin', 'tech-lead']);
        })->select('id', 'name')->orderBy('name')->get();

        return Inertia::render('FeatureShipments/Index', [
            'shipments' => $shipments,
            'developers' => $developers,
            'approvers' => $approvers,
            'projects' => Project::select('id', 'title')->get(),
        ]);
    }

    public function store(StoreFeatureShipmentRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $sizes = ['S' => 1, 'M' => 2, 'L' => 3, 'XL' => 5, 'XXL' => 7, 'XXXL' => 8];
        $validated['points'] = $sizes[$validated['t_shirt_size']];

        $shipment = FeatureShipment::create($validated);

        GenerateFeatureEmbeddingJob::dispatch($shipment);

        return redirect()->route('feature-shipments.index')
            ->with('success', 'Feature shipment logged successfully.');
    }

    public function update(\App\Http\Requests\UpdateFeatureShipmentRequest $request, FeatureShipment $featureShipment): RedirectResponse
    {
        $validated = $request->validated();

        $sizes = ['S' => 1, 'M' => 2, 'L' => 3, 'XL' => 5, 'XXL' => 7, 'XXXL' => 8];
        $validated['points'] = $sizes[$validated['t_shirt_size']];

        $featureShipment->update($validated);

        GenerateFeatureEmbeddingJob::dispatch($featureShipment);

        return redirect()->route('feature-shipments.index')
            ->with('success', 'Feature shipment updated successfully.');
    }

    public function destroy(FeatureShipment $featureShipment): RedirectResponse
    {
        $this->authorize('delete', $featureShipment);
        $featureShipment->delete();

        return redirect()->route('feature-shipments.index')
            ->with('success', 'Feature shipment deleted successfully.');
    }
}
