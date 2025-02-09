<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
{
    public function toArray(Request $request): array
{
    return [
        'id' => $this->id,
        'name' => $this->name,
        'description' => $this->description,
        'sport' => new SportResource($this->sport),
        'location' => $this->location,
        'max_participants' => $this->max_participants,
        'start_time' => $this->start_time->format('Y-m-d H:i:s'),
        'image' => $this->image ? asset('storage/' . $this->image) : null, 
        'organizer' => $this->user ? new UserResource($this->user) : null,
    ];
}


}
