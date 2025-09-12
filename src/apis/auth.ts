import { apiClient } from "@/apis/api-client";
import type { LoginRequest, RegisterRequest } from "@/schemas/auth.schema";
import type { TokenPair, RegisterResponse, Account, Profile } from "@/types/auth";

export class AuthError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "AuthError";
  }
}

// Helper function để handle form data với axios
async function postFormData<T>(path: string, formData: FormData): Promise<T> {
  try {
    const response = await apiClient.post(path, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || "Request failed";
    throw new AuthError(message, error.response?.status);
  }
}

// Authentication APIs
export async function login(payload: LoginRequest): Promise<TokenPair> {
  try {
    const response = await apiClient.post<TokenPair>("/auth/login", payload);

    // Kiểm tra role - chỉ cho phép USER đăng nhập
    if (response.data.access_token) {
      try {
        const tokenPayload = JSON.parse(atob(response.data.access_token.split('.')[1]));
        if (tokenPayload.role === 'ADMIN') {
          throw new AuthError("Tài khoản Admin không được phép đăng nhập ở đây", 403);
        }
      } catch (jwtError) {
        // Nếu không decode được JWT thì vẫn cho phép (fallback)
        console.warn("Cannot decode JWT:", jwtError);
      }
    }

    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || "Đăng nhập thất bại";
    throw new AuthError(message, error.response?.status);
  }
}

export async function refreshToken(refresh_token: string): Promise<TokenPair> {
  try {
    const response = await apiClient.post<TokenPair>("/auth/refresh", { refresh_token });
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || "Refresh token thất bại";
    throw new AuthError(message, error.response?.status);
  }
}

export async function register(payload: RegisterRequest, avatar?: File): Promise<RegisterResponse> {
  const formData = new FormData();
  formData.append("email", payload.email);
  formData.append("password", payload.password);
  formData.append("confirmPassword", payload.confirmPassword);
  formData.append("role", payload.role);
  formData.append("name", payload.name);

  if (avatar) {
    formData.append("avatar", avatar);
  }

  return postFormData<RegisterResponse>("/auth/register", formData);
}

// Account APIs - sử dụng apiClient (đã có token tự động)
export async function getAccounts(): Promise<Account[]> {
  try {
    const response = await apiClient.get<Account[]>("/auth/accounts");
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || "Lấy danh sách tài khoản thất bại";
    throw new AuthError(message, error.response?.status);
  }
}

export async function getAccountById(id: string): Promise<Account> {
  try {
    console.log("🌐 getAccountById API call for ID:", id);
    const response = await apiClient.get<Account>(`/auth/accounts/${id}`);
    console.log("✅ getAccountById successful");
    return response.data;
  } catch (error: any) {
    console.error("❌ getAccountById failed:", error);

    // TEMPORARY: Mock fallback nếu backend chưa sẵn sàng
    if (error.code === 'ECONNREFUSED' || error.response?.status === 404) {
      console.warn("🔄 Using mock account data (backend not available)");
      return {
        id: id,
        email: "user@example.com",
        role: "USER",
      };
    }

    const message = error.response?.data?.message || error.message || "Lấy thông tin tài khoản thất bại";
    throw new AuthError(message, error.response?.status);
  }
}

export async function updateAccount(id: string, payload: Partial<Account>): Promise<Account> {
  try {
    const response = await apiClient.put<Account>(`/auth/accounts/${id}`, payload);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || "Cập nhật tài khoản thất bại";
    throw new AuthError(message, error.response?.status);
  }
}

export async function deleteAccount(id: string): Promise<{ message: string }> {
  try {
    const response = await apiClient.delete<{ message: string }>(`/auth/accounts/${id}`);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || "Xóa tài khoản thất bại";
    throw new AuthError(message, error.response?.status);
  }
}

// Profile APIs - sử dụng apiClient (đã có token tự động)
export async function getProfiles(): Promise<Profile[]> {
  try {
    const response = await apiClient.get<Profile[]>("/auth/profile");
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || "Lấy danh sách profile thất bại";
    throw new AuthError(message, error.response?.status);
  }
}

export async function getProfileById(id: string): Promise<Profile> {
  try {
    const response = await apiClient.get<Profile>(`/auth/profile/${id}`);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || "Lấy thông tin profile thất bại";
    throw new AuthError(message, error.response?.status);
  }
}

// Get profile by account ID
export async function getProfileByAccountId(accountId: string): Promise<Profile> {
  try {
    console.log("🌐 getProfileByAccountId API call for accountId:", accountId);
    const response = await apiClient.get<Profile>(`/auth/profile/account/${accountId}`);
    console.log("✅ getProfileByAccountId successful");
    return response.data;
  } catch (error: any) {
    console.error("❌ getProfileByAccountId failed:", error);

    // TEMPORARY: Mock fallback nếu backend chưa sẵn sàng
    if (error.code === 'ECONNREFUSED' || error.response?.status === 404) {
      console.warn("🔄 Using mock profile data (backend not available)");
      return {
        id: `profile-${accountId}`,
        accountId: accountId,
        name: "User",
      };
    }

    const message = error.response?.data?.message || error.message || "Lấy profile thất bại";
    throw new AuthError(message, error.response?.status);
  }
}

export async function updateProfile(id: string, name: string, avatar?: File): Promise<Profile> {
  try {
    const formData = new FormData();
    formData.append("name", name);

    if (avatar) {
      formData.append("avatar", avatar);
    }

    const response = await apiClient.put(`/auth/profile/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || "Cập nhật profile thất bại";
    throw new AuthError(message, error.response?.status);
  }
}

export async function deleteProfile(id: string): Promise<{ message: string }> {
  try {
    const response = await apiClient.delete<{ message: string }>(`/auth/profile/${id}`);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || "Xóa profile thất bại";
    throw new AuthError(message, error.response?.status);
  }
}

// Get current user info từ token - decode JWT để lấy ID
export async function getCurrentUser(userId: string): Promise<{ account: Account; profile: Profile }> {
  try {
    console.log("🌐 getCurrentUser API call for userId:", userId);

    // Gọi song song để lấy account và profile
    const [account, profile] = await Promise.all([
      getAccountById(userId).catch((err) => {
        console.error("❌ getAccountById failed:", err);
        throw err;
      }),
      getProfileByAccountId(userId).catch((err) => {
        console.warn("⚠️ getProfileByAccountId failed:", err);
        return null; // Profile có thể không tồn tại
      })
    ]);

    console.log("✅ getCurrentUser successful:", {
      accountEmail: account.email,
      profileName: profile?.name || 'no profile'
    });

    return {
      account,
      profile: profile || {
        id: `profile-${account.id}`,
        accountId: account.id,
        name: account.email.split('@')[0],
      }
    };
  } catch (error: any) {
    console.error("❌ getCurrentUser failed:", error);
    const message = error.response?.data?.message || error.message || "Lấy thông tin người dùng thất bại";
    throw new AuthError(message, error.response?.status);
  }
}

// Change password
export async function changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
  try {
    const response = await apiClient.post<{ message: string }>("/auth/change-password", {
      currentPassword,
      newPassword
    });
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || "Đổi mật khẩu thất bại";
    throw new AuthError(message, error.response?.status);
  }
}

// Backward compatibility aliases
export const loginApi = login;
export const registerApi = register;
export const refreshTokenApi = refreshToken;

// Convenience functions
export async function loginUser(credentials: LoginRequest): Promise<TokenPair> {
  return login(credentials);
}

export async function registerUser(
  userData: RegisterRequest,
  avatar?: File
): Promise<RegisterResponse> {
  return register(userData, avatar);
}

export async function refreshUserToken(refreshToken: string): Promise<TokenPair> {
  return refreshToken(refreshToken);
}