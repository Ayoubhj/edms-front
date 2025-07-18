// src/app/guards/auth.guard.ts
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import {KeycloakUserService} from "../services/keycloak.user";

/**
 * Auth Guard for protecting routes based on authentication status and user roles.
 * This functional guard uses the KeycloakUserService to perform checks.
 */
export const authGuard: CanActivateFn = async (route, state): Promise<boolean | UrlTree> => {
    const keycloakUserService = inject(KeycloakUserService);
    const router = inject(Router);

    // 1. Check if the user is authenticated
    const isLoggedIn = await keycloakUserService.isLoggedIn();
    if (!isLoggedIn) {
        console.log('User not logged in. Redirecting to Keycloak login.');
        // If not logged in, redirect to Keycloak login page
        await keycloakUserService.login({
            redirectUri: window.location.origin + state.url,
        });
        return false;
    }


    const requiredRoles = route.data['requiredRoles'] as string[];


    if (!requiredRoles || requiredRoles.length === 0) {
        console.log('No specific roles required for this route. Access granted.');
        return true;
    }


    const hasAllRequiredRoles = await keycloakUserService.hasRole(requiredRoles);

    if (hasAllRequiredRoles) {
        console.log('User has all required roles. Access granted.');
        return true;
    } else {
        console.warn('User logged in but does not have required roles. Redirecting to unauthorized page.');
        return router.createUrlTree(['/auth/access']);
    }
};
