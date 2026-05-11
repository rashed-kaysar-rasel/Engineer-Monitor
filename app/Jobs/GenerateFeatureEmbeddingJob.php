<?php

namespace App\Jobs;

use App\Models\FeatureEmbedding;
use App\Models\FeatureShipment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class GenerateFeatureEmbeddingJob
{
    use Dispatchable, SerializesModels;

    public function __construct(public FeatureShipment $featureShipment) {}

    public function handle(): void
    {
        $text = "Feature: {$this->featureShipment->name}\nDescription: {$this->featureShipment->description}";

        $embeddingService = app(\App\Services\EmbeddingService::class);
        $vector = $embeddingService->generateEmbedding($text);

        FeatureEmbedding::updateOrCreate(
            ['feature_shipment_id' => $this->featureShipment->id],
            [
                'feature_description' => $text,
                'embedding' => $vector,
            ]
        );
    }
}
