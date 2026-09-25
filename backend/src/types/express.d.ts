export interface AuthUser {
  uid: string;
  role: string | null;
  email?: string;
  org_id?: string;
  organization_id: string; // Made required for TS
}

declare global {
  namespace Express {
    interface Request {
      user: AuthUser; // Made required for TS
    }
  }
}
