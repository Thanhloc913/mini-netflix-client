export type TokenPair = {
  access_token: string;
  refresh_token: string;
};

export type Account = {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
  createdAt?: string;
  updatedAt?: string;
};

export type Profile = {
  id: string;
  accountId: string;
  name: string;
  avatarUrl?: string;
};

export type RegisterResponse = {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
  name: string;
  avatarUrl?: string;
};

export type AuthUser = {
  account: Account;
  profile: Profile;
};
