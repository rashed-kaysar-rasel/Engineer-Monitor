<?php

namespace App\Services;

use App\Models\ClientComplaint;
use App\Models\ClientComplaintEmbedding;
use Exception;
use Illuminate\Support\Facades\Log;

class ClientComplaintService
{
    public function __construct(protected EmbeddingService $embeddingService) {}

    public function createComplaint(array $data): ClientComplaint
    {
        $complaint = ClientComplaint::create($data);
        $this->generateAndStoreEmbedding($complaint);
        return $complaint;
    }

    public function updateComplaint(ClientComplaint $complaint, array $data): ClientComplaint
    {
        $oldDescription = $complaint->description;
        $complaint->update($data);

        if ($oldDescription !== $complaint->description) {
            $this->generateAndStoreEmbedding($complaint);
        }

        return $complaint;
    }

    protected function generateAndStoreEmbedding(ClientComplaint $complaint): void
    {
        try {
            $text = "Client: {$complaint->client_name}\nDescription: {$complaint->description}\nImpact: {$complaint->impact_level}";
            $vector = $this->embeddingService->generateEmbedding($text);

            ClientComplaintEmbedding::updateOrCreate(
                ['client_complaint_id' => $complaint->id],
                ['embedding' => $vector]
            );
        } catch (Exception $e) {
            Log::error("Failed to generate embedding for client complaint #{$complaint->id}: " . $e->getMessage());
        }
    }
}
