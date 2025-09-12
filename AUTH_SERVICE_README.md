# Auth Service API

Dịch vụ `auth-service` cung cấp các API cho xác thực, quản lý tài khoản và profile người dùng.  
Tất cả API trả về dữ liệu ở định dạng **JSON**.

---

## 1. Authentication APIs

### 🔹 Login
- **URL**: `/login`
- **Method**: `POST`
- **Auth**: ❌ Không cần  
- **Request body**:
```json
{
  "email": "user@example.com",
  "password": "mypassword"
}
```
- **Response**:
```json
{
  "access_token": "jwt_token_here",
  "refresh_token": "refresh_token_here"
}
```

---

### 🔹 Refresh Token
- **URL**: `/refresh`
- **Method**: `POST`
- **Auth**: ❌ Không cần  
- **Request body**:
```json
{
  "refresh_token": "refresh_token_here"
}
```
- **Response**:
```json
{
  "access_token": "new_jwt_token",
  "refresh_token": "new_refresh_token"
}
```

---

### 🔹 Register
- **URL**: `/register`
- **Method**: `POST`
- **Auth**: ❌ Không cần  
- **Content-Type**: `multipart/form-data`  
- **Request body**:

| Field           | Type                | Required | Description          |
|-----------------|---------------------|----------|----------------------|
| email           | string              | ✅       | Email đăng ký        |
| password        | string              | ✅       | Mật khẩu             |
| confirmPassword | string              | ✅       | Xác nhận mật khẩu    |
| role            | enum(USER, ADMIN)   | ✅       | Vai trò tài khoản    |
| name            | string              | ✅       | Tên hiển thị         |
| avatar          | file                | ❌       | Ảnh đại diện         |

- **Response**:
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "role": "USER",
  "name": "John Doe",
  "avatarUrl": "https://storage.example.com/avatar.jpg"
}
```

---

## 2. Accounts APIs

### 🔹 Get All Accounts
- **URL**: `/accounts`
- **Method**: `GET`
- **Auth**: ✅ `JWT` + `ADMIN`  
- **Response**:
```json
[
  {
    "id": "uuid",
    "email": "admin@example.com",
    "role": "ADMIN"
  },
  {
    "id": "uuid",
    "email": "user@example.com",
    "role": "USER"
  }
]
```

---

### 🔹 Get Account by ID
- **URL**: `/accounts/:id`
- **Method**: `GET`
- **Auth**: ✅ `JWT` + (`OWNER` hoặc `ADMIN`)  
- **Response**:
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "role": "USER"
}
```

---

### 🔹 Create Account
- **URL**: `/accounts`
- **Method**: `POST`
- **Auth**: ❌ Không cần  
- **Request body**:
```json
{
  "email": "newuser@example.com",
  "password": "mypassword",
  "role": "USER"
}
```
- **Response**:
```json
{
  "id": "uuid",
  "email": "newuser@example.com",
  "role": "USER"
}
```

---

### 🔹 Update Account
- **URL**: `/accounts/:id`
- **Method**: `PUT`
- **Auth**: ✅ `JWT` + (`OWNER` hoặc `ADMIN`)  
- **Request body**:
```json
{
  "email": "updated@example.com",
  "password": "newpassword",
  "updatedAt": "2025-09-12T09:00:00Z"
}
```
- **Response**:
```json
{
  "id": "uuid",
  "email": "updated@example.com",
  "role": "USER",
  "updatedAt": "2025-09-12T09:00:00Z"
}
```

---

### 🔹 Delete Account
- **URL**: `/accounts/:id`
- **Method**: `DELETE`
- **Auth**: ✅ `JWT` + (`OWNER` hoặc `ADMIN`)  
- **Response**:
```json
{
  "message": "Account deleted successfully"
}
```

---

## 3. Profiles APIs

### 🔹 Get All Profiles
- **URL**: `/profile`
- **Method**: `GET`
- **Auth**: ✅ `JWT` + `ADMIN`  
- **Response**:
```json
[
  {
    "id": "uuid",
    "accountId": "uuid",
    "name": "John Doe",
    "avatarUrl": "https://storage.example.com/avatar.jpg"
  }
]
```

---

### 🔹 Get Profile by ID
- **URL**: `/profile/:id`
- **Method**: `GET`
- **Auth**: ✅ `JWT` + (`OWNER` hoặc `ADMIN`)  
- **Response**:
```json
{
  "id": "uuid",
  "accountId": "uuid",
  "name": "John Doe",
  "avatarUrl": "https://storage.example.com/avatar.jpg"
}
```

---

### 🔹 Create Profile
- **URL**: `/profile`
- **Method**: `POST`
- **Auth**: ❌ Không cần  
- **Content-Type**: `multipart/form-data`  
- **Request body**:

| Field     | Type   | Required | Description           |
|-----------|--------|----------|-----------------------|
| accountId | string | ✅       | Liên kết tới account  |
| name      | string | ✅       | Tên hiển thị          |
| avatar    | file   | ❌       | Ảnh đại diện          |

- **Response**:
```json
{
  "id": "uuid",
  "accountId": "uuid",
  "name": "John Doe",
  "avatarUrl": "https://storage.example.com/avatar.jpg"
}
```

---

### 🔹 Update Profile
- **URL**: `/profile/:id`
- **Method**: `PUT`
- **Auth**: ✅ `JWT` + (`OWNER` hoặc `ADMIN`)  
- **Content-Type**: `multipart/form-data`  
- **Request body**:
```json
{
  "name": "Updated Name"
}
```
- **Response**:
```json
{
  "id": "uuid",
  "accountId": "uuid",
  "name": "Updated Name",
  "avatarUrl": "https://storage.example.com/avatar.jpg"
}
```

---

### 🔹 Delete Profile
- **URL**: `/profile/:id`
- **Method**: `DELETE`
- **Auth**: ✅ `JWT` + (`OWNER` hoặc `ADMIN`)  
- **Response**:
```json
{
  "message": "Profile deleted successfully"
}
```
