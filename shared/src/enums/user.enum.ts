export const UserRole = {
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export const UserStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUSPENDED: 'SUSPENDED',
} as const;

export type UserStatus = typeof UserStatus[keyof typeof UserStatus];