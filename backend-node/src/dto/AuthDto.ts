export interface LoginRequest {
    username?: string;
    password?: string;
}

export interface SignupRequest {
    username?: string;
    email?: string;
    password?: string;
    role?: string;
    fullName?: string;
    phoneNumber?: string;
    address?: string;
}

export interface JwtResponse {
    token: string;
    id: number;
    username: string;
    email: string;
    role: string;
    fullName: string;
    phoneNumber: string;
    address: string;
    registrationDate: Date | null;
}

export interface MessageResponse {
    message: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    token: string;
    newPassword: string;
}

export interface GoogleLoginRequest {
    idToken: string;
}
