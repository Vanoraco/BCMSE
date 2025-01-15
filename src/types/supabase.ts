export type AccountType = 'admin' | 'chamber' | 'business' | 'government';

export interface UserProfile {
  id: string;
  email: string;
  account_type: AccountType;
  created_at: string;
}

export interface Message {
  id: string;
  user_id: string;
  category_id?: number; // Make category_id optional
  message: string;
  created_at: string;

  // Relationships (joined data)
  profiles?: {
    email: string;
  };
  message_categories?: {
    name: string;
  };
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