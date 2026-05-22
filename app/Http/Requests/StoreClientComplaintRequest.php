<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreClientComplaintRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Models\ClientComplaint::class);
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'project_id' => 'required|exists:projects,id',
            'client_name' => 'required|string|max:255',
            'description' => 'required|string|min:10',
            'impact_level' => 'required|in:high,medium,low',
            'status' => 'required|in:pending,resolved',
            'reported_date' => 'required|date|before_or_equal:today',
        ];
    }
}
