// import type { loginType } from "@/schemas/auth.schema";
// import type { TokenPair } from "@/types/auth";

// const BASE_URL = "http://localhost:3000";

// async function http<T>(path: string, init?: RequestInit): Promise<T> {
//   const res = await fetch(`${BASE_URL}${path}`, {
//     headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
//     ...init,
//   });
//   if (!res.ok) {
//     const text = await res.text();
//     throw new Error(text || `HTTP ${res.status}`);
//   }
//   return res.json() as Promise<T>;
// }

// export async function login(payload: loginType): Promise<TokenPair> {
//   return http<TokenPair>("/auth/login", {
//     method: "POST",
//     body: JSON.stringify(payload),
//   });
// }

// export async function refresh(refreshToken: string): Promise<TokenPair> {
//   return http<TokenPair>("/auth/refresh", {
//     method: "POST",
//     body: JSON.stringify({ refreshToken }),
//   });
// }

// export async function logout(accessToken: string): Promise<{ success: true }>{
//   return http<{ success: true }>("/auth/logout", {
//     method: "POST",
//     headers: { Authorization: `Bearer ${accessToken}` },
//   });
// }


