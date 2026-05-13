<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBugRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('bug'));
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'project_id' => 'required|exists:projects,id',
            'impact' => 'required|in:high,medium,low',
            'description' => 'required|string|min:10',
            'reported_at' => 'required|date|before_or_equal:today',
            'status' => 'required|in:pending,resolved',
        ];

        if ($this->status === 'resolved') {
            $rules['developer_id'] = 'required|exists:developers,id';
            $rules['resolved_at'] = 'required|date|after_or_equal:reported_at';
        } else {
            $rules['developer_id'] = 'nullable|exists:developers,id';
            $rules['resolved_at'] = 'nullable|date';
        }

        return $rules;
    }
}
