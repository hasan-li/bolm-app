// src/types/auth.ts
export interface User {
    id: string;
    email: string;
    name: string;
}

export interface Session {
    user: User;
    token: string;
}
