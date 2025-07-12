<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Sport;
use App\Http\Resources\SportResource;

class SportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sports = Sport::all();
        return SportResource::collection($sports);
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
            'name' => 'required|string|max:255|unique:sports,name',
        ]);

        $sport = Sport::create($validated);

        return response()->json([
            'message' => 'Sport created successfully',
            'sport' => new SportResource($sport)
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $sport = Sport::findOrFail($id);
        return new SportResource($sport);
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
    public function destroy(string $id)
    {
        $sport = Sport::findOrFail($id);
        
        // Check if there are events using this sport
        if ($sport->events()->count() > 0) {
            return response()->json([
                'error' => 'Cannot delete sport. There are events associated with this sport.'
            ], 400);
        }

        $sport->delete();

        return response()->json([
            'message' => 'Sport deleted successfully'
        ]);
    }
}
