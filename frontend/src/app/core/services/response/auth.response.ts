export interface AuthResponse {
  token: string;
  token_type: string;
  expires_in: number;
  user_id: number;
  username: string;
  name: string;
}
