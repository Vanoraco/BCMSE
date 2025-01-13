export type AccountType = 'admin' | 'chamber' | 'business' | 'government';

export interface UserProfile {
  id: string;
  email: string;
  account_type: AccountType;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: UserProfile;
        Insert: Omit<UserProfile, 'id' | 'created_at'>;
        Update: Partial<Omit<UserProfile, 'id'>>;
      };
    };
  };
}