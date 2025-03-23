export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  classe: string;
  role: 'ROLE_STUDENT' | 'ROLE_TEACHER';
}
