export const DATABASE_PREFIX = process.env.NEXT_PUBLIC_DATABASE_PREFIX;

export const TABLES = {
  SUBSCRIBERS: `${DATABASE_PREFIX}_subscribers`,
  VIEW_COUNTS: `${DATABASE_PREFIX}_view_counts`,
} as const;
