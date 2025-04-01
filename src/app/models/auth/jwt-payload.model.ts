export interface JwtPayload {
    sub: string;
    roles: string[];
    userId: number;
    firstName: string;
    lastName: string;
    iat?: number;
    exp?: number;
  }
  