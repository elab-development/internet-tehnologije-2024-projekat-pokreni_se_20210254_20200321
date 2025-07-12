<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class IsAdmin
{
    public function handle($request, Closure $next)
    {
        if (!Auth::check() || Auth::user()->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized. Admins only.'], 403);
        }
        return $next($request);
    }
}
