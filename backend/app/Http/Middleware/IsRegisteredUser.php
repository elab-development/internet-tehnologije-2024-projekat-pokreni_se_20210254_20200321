<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class IsRegisteredUser
{
    public function handle($request, Closure $next)
    {
        if (!Auth::check() || Auth::user()->role !== 'registered_user') {
            return response()->json(['error' => 'Unauthorized. Only registered users can perform this action.'], 403);
        }
        return $next($request);
    }
}
