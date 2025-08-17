<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;
use App\Models\EventParticipant;
use Illuminate\Support\Facades\Auth;

class EventParticipantController extends Controller
{
    /**
     * List participants for an event.
     */
    public function index($eventId)
    {
        $event = \App\Models\Event::with('participants.user')->find($eventId);

        if (!$event) {
            return response()->json(['error' => 'Event not found.'], 404);
        }

        // Get participant users
        $participants = $event->participants->map(function ($participant) {
            return $participant->user;
        })->filter();

        return response()->json([
            'event' => $event->name,
            'participants' => $participants->values(),
        ]);
    }

    /**
     * Join an event.
     */
    public function store(Request $request, $eventId)
    {
        $user = Auth::user();
        $event = Event::findOrFail($eventId);

        // Check if the user is already in the event
        if (EventParticipant::where('user_id', $user->id)->where('event_id', $eventId)->exists()) {
            return response()->json(['message' => 'You are already in this event.'], 400);
        }

        // Check if event has already passed
        if (new \DateTime($event->start_time) < new \DateTime()) {
            return response()->json(['message' => 'Cannot join an event that has already passed.'], 400);
        }

        // Check if event is full
        if ($event->participants()->count() >= $event->max_participants) {
            return response()->json(['message' => 'Event is full.'], 400);
        }

        // Add user to event
        EventParticipant::create([
            'user_id' => $user->id,
            'event_id' => $eventId
        ]);

        return response()->json(['message' => 'Successfully joined the event.']);
    }

    /**
     * Leave an event.
     */
    public function destroy($eventId, $participantId)
    {
        $event = Event::findOrFail($eventId);
        $participant = EventParticipant::where('user_id', $participantId)->where('event_id', $eventId)->first();

        if (!$participant) {
            return response()->json(['message' => 'User not found in event.'], 404);
        }

        $participant->delete();

        return response()->json(['message' => 'Successfully left the event.']);
    }

    /**
     * Get all events the authenticated user has joined.
     */
    public function myJoinedEvents(Request $request)
    {
        $user = $request->user();
        $eventIds = \App\Models\EventParticipant::where('user_id', $user->id)->pluck('event_id');
        $events = \App\Models\Event::whereIn('id', $eventIds)->with(['sport', 'user'])->get();
        return \App\Http\Resources\EventResource::collection($events);
    }
}
