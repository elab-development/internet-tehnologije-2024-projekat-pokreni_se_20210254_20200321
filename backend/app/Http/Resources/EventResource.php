<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Services\GeolocationService;
use App\Services\EventSummaryService;
use Illuminate\Support\Facades\Cache;

class EventResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $baseData = [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'sport' => new SportResource($this->sport),
            'location' => $this->location,
            'max_participants' => $this->max_participants,
            'participants_count' => $this->participants()->count(),
            'start_time' => $this->start_time->format('Y-m-d H:i:s'),
            'image' => $this->image ? asset('storage/' . $this->image) : null, 
            'organizer' => $this->user ? new UserResource($this->user) : null,
        ];

        // Only add geolocation and summary if specifically requested
        if ($request->has('include_coordinates') || $request->has('include_summary')) {
            $coordinates = null;
            $summary = null;
            
            try {
                // Get coordinates with caching (30 minutes)
                if ($request->has('include_coordinates')) {
                    $coordinatesCacheKey = "coordinates_{$this->location}";
                    $coordinates = Cache::remember($coordinatesCacheKey, 1800, function () {
                        $geolocationService = new GeolocationService();
                        return $geolocationService->getCoordinates($this->location);
                    });
                }
                


                // Get AI-generated summary (cached for 1 hour)
                if ($request->has('include_summary')) {
                    $summaryCacheKey = "event_summary_{$this->id}";
                    $summary = Cache::remember($summaryCacheKey, 3600, function () {
                        $summaryService = new EventSummaryService();
                        return $summaryService->getEventSummary($this);
                    });
                }
                
            } catch (\Exception $e) {
                // Log error but don't fail the request
                \Log::warning('Error fetching geolocation/summary data', [
                    'event_id' => $this->id,
                    'error' => $e->getMessage()
                ]);
            }

            // Add coordinates and summary to response
            if ($coordinates) {
                $baseData['coordinates'] = [
                    'latitude' => $coordinates['latitude'],
                    'longitude' => $coordinates['longitude'],
                    'display_name' => $coordinates['display_name']
                ];
            }

            if ($summary) {
                $baseData['ai_summary'] = $summary;
            }
        }

        return $baseData;
    }
}
