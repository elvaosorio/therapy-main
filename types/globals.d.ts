export {};

// Create a type for the roles
export type Roles = "admin" | "therapist" | "user";

declare global {
    interface CustomJwtSessionClaims {
        metadata: {
            role?: Roles;
        };
    }
}
