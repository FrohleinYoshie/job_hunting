export interface UserProfile {
    id: string;
    email: string;
    name?: string;
    department?: string;
  }
  
  export interface AuthState {
    isAuthenticated: boolean;
    user: UserProfile | null;
  }