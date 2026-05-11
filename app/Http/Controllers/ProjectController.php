<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Models\Project;
use App\Models\User;
use App\Services\ProjectService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function __construct(protected ProjectService $projectService) {}

    public function index(): Response
    {
        Gate::authorize('viewAny', Project::class);

        $projects = Project::with(['lead:id,name', 'creator:id,name'])
            ->latest()
            ->paginate(10);

        $users = User::select('id', 'name')->get();

        return Inertia::render('projects/index', [
            'projects' => $projects,
            'users' => $users,
        ]);
    }

    public function store(StoreProjectRequest $request): RedirectResponse
    {
        $this->projectService->createProject(
            $request->validated(),
            $request->user()->id
        );

        return redirect()->route('projects.index')
            ->with('success', 'Project created successfully.');
    }

    public function update(UpdateProjectRequest $request, Project $project): RedirectResponse
    {
        $this->projectService->updateProject(
            $project,
            $request->validated()
        );

        return redirect()->route('projects.index')
            ->with('success', 'Project updated successfully.');
    }

    public function destroy(Project $project): RedirectResponse
    {
        Gate::authorize('delete', $project);

        $this->projectService->deleteProject($project);

        return redirect()->route('projects.index')
            ->with('success', 'Project deleted successfully.');
    }
}
