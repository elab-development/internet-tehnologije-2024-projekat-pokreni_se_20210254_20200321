<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\EventResource;
use App\Models\Event;
use Illuminate\Support\Facades\Auth;

class EventController
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Event::query();
    
        // Filter by sport
        if ($request->has('sport_id')) {
            $query->where('sport_id', $request->sport_id);
        }
    
        // Filter by location
        if ($request->has('location')) {
            $query->where('location', 'LIKE', "%{$request->location}%");
        }
    
        // Filter by start date
        if ($request->has('start_date')) {
            $query->whereDate('start_time', '>=', $request->start_date);
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
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'description' => 'required|string',
        'sport_id' => 'required|exists:sports,id',
        'location' => 'required|string|max:255',
        'max_participants' => 'required|integer|min:1',
        'start_time' => 'required|date|after:today',
    ]);

    if (Auth::user()->role !== 'admin') {
        return response()->json(['error' => 'Unauthorized. Only admins can create events.'], 403);
    }

    $event = Event::create(array_merge($validated, [
        'user_id' => Auth::id()
    ]));

    return response()->json([
        'message' => 'Event created successfully!',
        'event' => new EventResource($event),
    ], 201);
}




    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
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
        //
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

}
