<?php

namespace App\Services;

use App\Models\Project;

class ProjectService
{
    /**
     * Create a new project.
     */
    public function createProject(array $data, int $creatorId): Project
    {
        $data['creator_id'] = $creatorId;

        return Project::create($data);
    }

    /**
     * Update an existing project.
     */
    public function updateProject(Project $project, array $data): bool
    {
        return $project->update($data);
    }

    /**
     * Delete a project.
     */
    public function deleteProject(Project $project): ?bool
    {
        return $project->delete();
    }
}
