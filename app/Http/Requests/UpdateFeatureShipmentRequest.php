<?php

namespace App\Http\Requests;

use App\Models\FeatureShipment;
use Illuminate\Foundation\Http\FormRequest;

class UpdateFeatureShipmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('feature_shipment'));
    }

    public function rules(): array
    {
        return [
            'feature_id' => ['required', 'integer'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'shipped_date' => ['required', 'date'],
            't_shirt_size' => ['required', 'string', 'in:S,M,L,XL,XXL,XXXL'],
            'approver_id' => ['required', 'integer', 'exists:users,id'],
            'developer_id' => ['required', 'integer', 'exists:developers,id'],
            'project_id' => ['required', 'integer', 'exists:projects,id'],
        ];
    }
}
