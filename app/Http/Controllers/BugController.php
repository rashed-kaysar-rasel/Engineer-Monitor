<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBugRequest;
use App\Http\Requests\UpdateBugRequest;
use App\Models\Bug;
use App\Models\Project;
use App\Models\User;
use App\Services\BugService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BugController extends Controller
{
    public function __construct(protected BugService $bugService) {}

    public function index(Request $request)
    {
        $this->authorize('viewAny', Bug::class);

        $bugs = Bug::with(['project', 'developer'])
            ->when($request->project_id, fn($q) => $q->where('project_id', $request->project_id))
            ->when($request->impact, fn($q) => $q->where('impact', $request->impact))
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('bugs/index', [
            'bugs' => $bugs,
            'projects' => Project::all(['id', 'title']),
            'developers' => \App\Models\Developer::all(['id', 'name']),
            'filters' => $request->only(['project_id', 'impact', 'status']),
        ]);
    }

    public function store(StoreBugRequest $request)
    {
        $this->bugService->createBug($request->validated());

        return redirect()->route('bugs.index')->with('success', 'Bug recorded successfully.');
    }

    public function update(UpdateBugRequest $request, Bug $bug)
    {
        $this->bugService->updateBug($bug, $request->validated());

        return redirect()->route('bugs.index')->with('success', 'Bug updated successfully.');
    }

    public function destroy(Bug $bug)
    {
        $this->authorize('delete', $bug);
        $bug->delete();

        return redirect()->route('bugs.index')->with('success', 'Bug deleted successfully.');
    }
}
