<?php

namespace App\Services;


class EmbeddingService
{
    public function generateEmbedding(string $text): array
    {
        $response = \Laravel\Ai\Embeddings::for([$text])
            ->generate();

        return $response->embeddings[0];
    }
}
