export type Subscriber = {
  id: string;
  email: string;
  created_at: string;
  verified: boolean;
  verification_token?: string;
};
