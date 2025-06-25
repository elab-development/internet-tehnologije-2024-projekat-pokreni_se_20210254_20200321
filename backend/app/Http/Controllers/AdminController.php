<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Event;
use App\Models\Sport;

class AdminController extends Controller
{
    
    public function getUsers()
    {
        $users = User::all();
        return response()->json($users);
    }

    public function dashboard()
    {
        return response()->json([
            'total_users' => User::count(),
            'total_registered_users' => User::where('role', 'registered_user')->count(),
            'total_admins' => User::where('role', 'admin')->count(),
            'total_events' => Event::count(),
            'total_sports' => Sport::count(),
        ]);
    }

    
    public function deleteUser($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }

   
    public function createEvent(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'sport_id' => 'required|exists:sports,id',
            'location' => 'required|string|max:255',
            'max_participants' => 'required|integer|min:1',
            'start_time' => 'required|date',
        ]);

        $event = Event::create($validated);

        return response()->json(['message' => 'Event created successfully', 'event' => $event], 201);
    }

    
    public function deleteEvent($id)
    {
        $event = Event::find($id);

        if (!$event) {
            return response()->json(['message' => 'Event not found'], 404);
        }

        $event->delete();
        return response()->json(['message' => 'Event deleted successfully']);
    }

    
    public function getSports()
    {
        $sports = Sport::all();
        return response()->json($sports);
    }

    
    public function createSport(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $sport = Sport::create($validated);

        return response()->json(['message' => 'Sport created successfully', 'sport' => $sport], 201);
    }
}
