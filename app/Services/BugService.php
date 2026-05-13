<?php

namespace App\Services;

use App\Models\Bug;
use App\Models\BugEmbedding;
use Exception;
use Illuminate\Support\Facades\Log;

class BugService
{
    public function __construct(protected EmbeddingService $embeddingService) {}

    public function createBug(array $data): Bug
    {
        $bug = Bug::create($data);
        $this->generateAndStoreEmbedding($bug);
        return $bug;
    }

    public function updateBug(Bug $bug, array $data): Bug
    {
        $oldDescription = $bug->description;
        $bug->update($data);

        if ($oldDescription !== $bug->description) {
            $this->generateAndStoreEmbedding($bug);
        }

        return $bug;
    }

    protected function generateAndStoreEmbedding(Bug $bug): void
    {
        try {
            $text = "Bug: {$bug->description}\nImpact: {$bug->impact}";
            $vector = $this->embeddingService->generateEmbedding($text);

            BugEmbedding::updateOrCreate(
                ['bug_id' => $bug->id],
                ['embedding' => $vector]
            );
        } catch (Exception $e) {
            Log::error("Failed to generate embedding for bug #{$bug->id}: " . $e->getMessage());
        }
    }
}
