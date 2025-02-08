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
        $event = Event::with('participants.user')->find($eventId);

        if (!$event) {
            return response()->json(['error' => 'Event not found.'], 404);
        }

        return response()->json([
            'event' => $event->name,
            'participants' => $event->participants
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
}
