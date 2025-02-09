<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class IsRegisteredUser
{
    public function handle(Request $request, Closure $next)
    {
        if (!Auth::check()) {
            return response()->json(['error' => 'Unauthorized. Please log in.'], 401);
        }

        if (Auth::user()->role !== 'registered_user') {
            return response()->json(['error' => 'Unauthorized. Only registered users can perform this action.'], 403);
        }

        return $next($request);
    }
}
