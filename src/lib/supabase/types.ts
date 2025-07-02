export type Subscriber = {
  id: string;
  email: string;
  created_at: string;
  verified: boolean;
  verification_token?: string;
};

export type ViewCount = {
  id: string;
  post_slug: string;
  view_count: number;
  created_at: string;
  updated_at: string;
};

export type Comment = {
  id: string;
  post_slug: string;
  author_name: string;
  author_email: string;
  content: string;
  created_at: string;
  is_approved: boolean;
  parent_id?: string | null;
  replies?: Comment[];
};
