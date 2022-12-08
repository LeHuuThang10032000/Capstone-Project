export interface RegisterResponse {
  access_token?: string;
  user_id?: number;
  email: string;
  full_name: string;
  image: {
    original_url: string;
  };
  phone?: string;
  token_type?: string;
  message?: string;
  errors?: Record<string, string[]>;
}
