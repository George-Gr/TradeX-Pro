import { User } from './index';

export interface AuthFormData {
  email: string;
  password: string;
}

export interface SignupFormData extends AuthFormData {
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface AuthResponse {
  user: User | null;
  session: {
    access_token: string;
    expires_at: number;
  } | null;
  error: Error | null;
}
