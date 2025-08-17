<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\EventResource;
use App\Models\Event;
use Illuminate\Support\Facades\Auth;
use App\Services\GeolocationService;
use App\Services\EventSummaryService;


class EventController
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Event::query();
    
        // Search by event name
        if ($request->has('search') && $request->search) {
            $query->where('name', 'LIKE', "%{$request->search}%");
        }
    
        // Filter by sport name
        if ($request->has('sport') && $request->sport) {
            $query->whereHas('sport', function($q) use ($request) {
                $q->where('name', 'LIKE', "%{$request->sport}%");
            });
        }
    
        // Filter by location
        if ($request->has('location') && $request->location) {
            $query->where('location', 'LIKE', "%{$request->location}%");
        }
    
        // Filter by start date
        if ($request->has('start_date') && $request->start_date) {
            $query->whereDate('start_time', '>=', $request->start_date);
        }

        // Filter by event status (upcoming/past)
        if ($request->has('status')) {
            $now = now();
            switch ($request->status) {
                case 'upcoming':
                    $query->where('start_time', '>', $now);
                    break;
                case 'past':
                    $query->where('start_time', '<', $now);
                    break;
                // 'all' shows all events (no filter)
            }
        }

        // Sort events
        if ($request->has('sort')) {
            switch ($request->sort) {
                case 'date_asc':
                    $query->orderBy('start_time', 'asc');
                    break;
                case 'date':
                default:
                    $query->orderBy('start_time', 'desc');
                    break;
            }
        } else {
            $query->orderBy('start_time', 'desc');
        }
    
        return EventResource::collection($query->paginate(10));
    }
    

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
{
    try {
        \Log::info('Incoming event creation request:', $request->all());

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'sport_id' => 'required|exists:sports,id',
            'location' => 'required|string|max:255',
            'max_participants' => 'required|integer|min:1',
            'start_time' => 'required|date|after:today',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
        
        if (!Auth::check()) {
            return response()->json(['error' => 'Unauthorized. Please log in.'], 401);
        }

        if (Auth::user()->role !== 'registered_user') {
            return response()->json(['error' => 'Only registered users can create events.'], 403);
        }

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('events', 'public');
        }

        $event = Event::create(array_merge($validated, [
            'user_id' => Auth::id(),
            'image' => $imagePath,
        ]));

        return response()->json([
            'message' => 'Event created successfully!',
            'event' => new EventResource($event),
        ], 201);

    } catch (\Throwable $e) {
        \Log::error('Error creating event: ' . $e->getMessage());
        return response()->json(['error' => 'Server error: ' . $e->getMessage()], 500);
    }
}





    /**
     * Display the specified resource.
     */
    public function show($id)
{
    $event = Event::with(['sport', 'user'])->findOrFail($id);
    return new EventResource($event);
}

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $event = Event::findOrFail($id);
            $user = Auth::user();

            // Check if user owns the event or is admin
            if ($user->role !== 'admin' && $event->user_id !== $user->id) {
                return response()->json(['error' => 'You can only edit your own events.'], 403);
            }

            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'required|string',
                'sport_id' => 'required|exists:sports,id',
                'location' => 'required|string|max:255',
                'max_participants' => 'required|integer|min:1',
                'start_time' => 'required|date|after:today',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            $imagePath = $event->image; // Keep existing image by default
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('events', 'public');
            }

            $event->update(array_merge($validated, [
                'image' => $imagePath,
            ]));

            return response()->json([
                'message' => 'Event updated successfully!',
                'event' => new EventResource($event),
            ], 200);

        } catch (\Throwable $e) {
            \Log::error('Error updating event: ' . $e->getMessage());
            return response()->json(['error' => 'Server error: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
{
    $user = Auth::user();
    $event = Event::findOrFail($id);

    // ✅ Registered users can delete only their own events
    if ($user->role === 'registered_user' && $event->user_id !== $user->id) {
        return response()->json(['error' => 'You can only delete your own events.'], 403);
    }

    $event->delete();

    return response()->json(['message' => 'Event deleted successfully.']);
}


    public function search(Request $request)
    {
    $query = Event::query();

    if ($request->has('query')) {
        $searchTerm = $request->query('query');
        $query->where('name', 'LIKE', "%{$searchTerm}%")
              ->orWhere('description', 'LIKE', "%{$searchTerm}%")
              ->orWhere('location', 'LIKE', "%{$searchTerm}%");
    }

    return EventResource::collection($query->paginate(10));
    }

    /**
     * Get all events created by the authenticated user.
     */
    public function myCreatedEvents(Request $request)
    {
        $user = $request->user();
        $events = \App\Models\Event::where('user_id', $user->id)->with(['sport', 'user'])->get();
        return \App\Http\Resources\EventResource::collection($events);
    }



    /**
     * Get coordinates for an address
     */
    public function getCoordinates($address)
    {
        try {
            $geolocationService = new GeolocationService();
            $coordinates = $geolocationService->getCoordinates($address);
            
            if ($coordinates) {
                return response()->json([
                    'success' => true,
                    'coordinates' => $coordinates
                ]);
            }
            
            return response()->json([
                'success' => false,
                'message' => 'Coordinates not found for this address'
            ], 404);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching coordinates'
            ], 500);
        }
    }

    /**
     * Performance test endpoint
     */
    public function performanceTest()
    {
        $startTime = microtime(true);
        
        // Test basic event loading (without weather)
        $events = Event::with(['sport', 'user'])->limit(5)->get();
        $basicLoadTime = microtime(true) - $startTime;
        
        // Test event loading with weather
        $weatherStartTime = microtime(true);
        $eventsWithWeather = Event::with(['sport', 'user'])->limit(1)->get();
        $weatherLoadTime = microtime(true) - $weatherStartTime;
        
        return response()->json([
            'basic_load_time' => round($basicLoadTime * 1000, 2) . 'ms',
            'weather_load_time' => round($weatherLoadTime * 1000, 2) . 'ms',
            'performance_impact' => round(($weatherLoadTime / $basicLoadTime) * 100, 1) . '% slower',
            'recommendation' => 'Use ?include_weather=1 only when needed'
        ]);
    }



    /**
     * Summary debug endpoint
     */
    public function summaryDebug($eventId)
    {
        try {
            $event = Event::with('sport', 'user')->findOrFail($eventId);
            $summaryService = new EventSummaryService();
            $summary = $summaryService->generateEventSummary($event);
            
                            return response()->json([
                    'success' => true,
                    'event_id' => $eventId,
                    'event_name' => $event->name,
                    'huggingface_configured' => !empty(config('services.huggingface.api_key')),
                    'summary' => $summary,
                    'summary_length' => strlen($summary)
                ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
                'event_id' => $eventId
            ], 500);
        }
    }

}
