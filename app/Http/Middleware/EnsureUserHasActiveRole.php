<?php

namespace App\Http\Middleware;

use App\Services\Auth\RoleAccessService;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasActiveRole
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next, string ...$allowedRoles): Response
    {
        $user = $request->user();

        if (! $user) {
            return redirect()->guest(route('login'));
        }

        $roleAccess = app(RoleAccessService::class);

        if (! $roleAccess->hasActiveApprovedRole($user)) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()
                ->guest(route('login'))
                ->withErrors([
                    'email' => __('Your access has been revoked. Please contact an administrator.'),
                ]);
        }

        if ($allowedRoles !== [] && ! in_array($user->activeRole()?->slug, $allowedRoles, true)) {
            abort(403);
        }

        return $next($request);
    }
}
