export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserInfo;
}

export interface UserInfo {
  userId: number;
  email: string;
  name: string;
}

// Detailed user profile from /users/me
export interface UserProfile {
  userId: number;
  email: string;
  name: string;
}

// Request body for updating profile
export interface UpdateProfileRequest {
  name: string;
}
