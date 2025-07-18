// src/app/services/keycloak-user.service.ts
import { Injectable, inject } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';

/**
 * Service to manage Keycloak user information and roles.
 * This service encapsulates interactions with the raw KeycloakService
 * to provide a cleaner API for user-related data.
 */
@Injectable({
    providedIn: 'root',
})
export class KeycloakUserService {

    private readonly keycloakService = inject(KeycloakService);

    private userProfile: KeycloakProfile | null = null;
    private userRoles: string[] = [];

    constructor() {
        // Optionally, you can subscribe to Keycloak events here
        // or load the profile/roles when needed by components/guards.
        // For simplicity, we'll ensure profile/roles are loaded on demand
        // or when isLoggedIn is first checked.
    }

    /**
     * Checks if the user is currently logged in.
     * @returns A promise that resolves to true if logged in, false otherwise.
     */
    async isLoggedIn(): Promise<boolean> {
        return this.keycloakService.isLoggedIn();
    }

    /**
     * Loads the user profile from Keycloak.
     * It stores the profile internally and returns it.
     * @returns A promise that resolves to the KeycloakProfile or null if not logged in.
     */
    async loadUserProfile(): Promise<KeycloakProfile | null> {
        if (await this.isLoggedIn()) {
            try {
                this.userProfile = await this.keycloakService.loadUserProfile();
                // Ensure roles are also updated when profile is loaded
                this.userRoles = this.keycloakService.getUserRoles();
                return this.userProfile;
            } catch (error) {
                console.error('Failed to load user profile:', error);
                this.userProfile = null;
                this.userRoles = [];
                return null;
            }
        }
        this.userProfile = null;
        this.userRoles = [];
        return null;
    }

    /**
     * Gets the currently loaded user profile.
     * Call `loadUserProfile()` first to ensure it's up-to-date.
     * @returns The KeycloakProfile object or null if not loaded/logged in.
     */
    getUserProfile(): KeycloakProfile | null {
        return this.userProfile;
    }

    /**
     * Gets all roles assigned to the current user.
     * Call `loadUserProfile()` or ensure user is logged in for accurate roles.
     * @returns An array of strings representing the user's roles.
     */
    getUserRoles(): string[] {
        // This method directly calls keycloakService.getUserRoles() for real-time roles
        // It's good practice to ensure the profile is loaded first for consistency.
        return this.keycloakService.getUserRoles();
    }

    /**
     * Checks if the current user has a specific role or any of the provided roles.
     * @param roles A single role string or an array of role strings to check against.
     * @returns A promise that resolves to true if the user has the role(s), false otherwise.
     */
    async hasRole(roles: string | string[]): Promise<boolean> {
        if (!(await this.isLoggedIn())) {
            return false; // Not logged in, cannot have roles
        }

        // Ensure roles are loaded before checking
        if (this.userRoles.length === 0) {
            await this.loadUserProfile(); // Re-load to ensure roles are fresh
        }

        const rolesToCheck = Array.isArray(roles) ? roles : [roles];
        return rolesToCheck.some(role => this.userRoles.includes(role));
    }

    /**
     * Gets the parsed ID token. This can contain additional user claims.
     * @returns The parsed ID token object or undefined if not available.
     */
    getParsedIdToken(): any | undefined {
        return this.keycloakService.getKeycloakInstance().idTokenParsed;
    }

    /**
     * Gets the raw access token.
     * @returns The access token string or undefined if not available.
     */
    getAccessToken(): Promise<string | undefined> {
        return this.keycloakService.getToken();
    }

    /**
     * Initiates the Keycloak login flow.
     * @param options Keycloak login options.
     * @returns A promise that resolves when the login process is complete.
     */
    login(options?: any): Promise<void> {
        return this.keycloakService.login(options);
    }

    /**
     * Initiates the Keycloak logout flow.
     * @param redirectUri The URI to redirect to after logout.
     * @returns A promise that resolves when the logout process is complete.
     */
    logout(redirectUri?: string): Promise<void> {
        return this.keycloakService.logout(redirectUri);
    }
}
