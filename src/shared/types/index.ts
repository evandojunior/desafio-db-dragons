export interface Dragon {
  id: string;
  name: string;
  type: string;
  createdAt: string;
  histories: string[];
}

export type CreateDragonInput = Pick<Dragon, 'name' | 'type'>;
export type UpdateDragonInput = Partial<Pick<Dragon, 'name' | 'type' | 'histories'>>;

export interface StoredUser {
  id: string;
  username: string;
  password: string;
  createdAt: string;
}

export interface Session {
  userId: string;
  username: string;
}

export interface Credentials {
  username: string;
  password: string;
}

export interface SignUpInput extends Credentials {
  confirmPassword: string;
}

export type RequestStatus = 'idle' | 'loading' | 'success' | 'error';
