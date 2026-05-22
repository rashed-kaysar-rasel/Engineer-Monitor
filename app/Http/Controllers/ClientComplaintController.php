<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreClientComplaintRequest;
use App\Http\Requests\UpdateClientComplaintRequest;
use App\Models\ClientComplaint;
use App\Models\Project;
use App\Services\ClientComplaintService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClientComplaintController extends Controller
{
    public function __construct(protected ClientComplaintService $service) {}

    /**
     * Display a listing of the client complaints.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', ClientComplaint::class);

        $complaints = ClientComplaint::with('project')
            ->when($request->project_id, fn($q) => $q->where('project_id', $request->project_id))
            ->when($request->impact_level, fn($q) => $q->where('impact_level', $request->impact_level))
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('client-complaints/index', [
            'complaints' => $complaints,
            'projects' => Project::all(['id', 'title']),
            'filters' => $request->only(['project_id', 'impact_level', 'status']),
        ]);
    }

    /**
     * Store a newly created client complaint in storage.
     */
    public function store(StoreClientComplaintRequest $request)
    {
        $this->service->createComplaint($request->validated());

        return redirect()->route('client-complaints.index')
            ->with('success', 'Client complaint recorded successfully.');
    }

    /**
     * Update the specified client complaint in storage.
     */
    public function update(UpdateClientComplaintRequest $request, ClientComplaint $clientComplaint)
    {
        $this->service->updateComplaint($clientComplaint, $request->validated());

        return redirect()->route('client-complaints.index')
            ->with('success', 'Client complaint updated successfully.');
    }

    /**
     * Remove the specified client complaint from storage.
     */
    public function destroy(ClientComplaint $clientComplaint)
    {
        $this->authorize('delete', $clientComplaint);
        $clientComplaint->delete();

        return redirect()->route('client-complaints.index')
            ->with('success', 'Client complaint deleted successfully.');
    }
}
