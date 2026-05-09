<?php

namespace App\Services;

use App\Models\Project;

class ProjectService
{
    /**
     * Create a new project.
     *
     * @param array $data
     * @param int $creatorId
     * @return Project
     */
    public function createProject(array $data, int $creatorId): Project
    {
        $data['creator_id'] = $creatorId;

        return Project::create($data);
    }

    /**
     * Update an existing project.
     *
     * @param Project $project
     * @param array $data
     * @return bool
     */
    public function updateProject(Project $project, array $data): bool
    {
        return $project->update($data);
    }

    /**
     * Delete a project.
     *
     * @param Project $project
     * @return bool|null
     */
    public function deleteProject(Project $project): ?bool
    {
        return $project->delete();
    }
}
