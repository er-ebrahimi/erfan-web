import { User } from '@/context/auth-context';

const API_URL = process.env.STRAPI_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL;

export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  jwt: string;
  user: User;
}

export interface StrapiError {
  error: {
    status: number;
    name: string;
    message: string;
    details: any;
  };
}

export class AuthService {
  private static baseUrl = `${API_URL}/api/auth`;

  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/local`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Login failed');
    }

    return data;
  }

  static async register(
    credentials: RegisterCredentials
  ): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/local/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Registration failed');
    }

    return data;
  }

  static async forgotPassword(email: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error?.message || 'Password reset failed');
    }
  }

  static async resetPassword(
    code: string,
    password: string,
    passwordConfirmation: string
  ): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        password,
        passwordConfirmation,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Password reset failed');
    }

    return data;
  }

  static async getMe(token: string): Promise<User> {
    const response = await fetch(`${API_URL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch user data');
    }

    return data;
  }

  static async updateMe(token: string, userData: Partial<User>): Promise<User> {
    const response = await fetch(`${API_URL}/api/users/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to update user data');
    }

    return data;
  }
}
