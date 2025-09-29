# Gateway Migration Summary

## Tổng quan
Đã cập nhật toàn bộ API calls trong project để sử dụng gateway thay vì gọi trực tiếp đến từng service.

## Thay đổi chính

### 1. API Base URL
- **Trước**: Các service riêng biệt với port khác nhau
  - Movie service: `http://localhost:3001`
  - File service: `http://localhost:3002`
- **Sau**: Tất cả qua gateway
  - Gateway: `http://localhost:3000`

### 2. API Endpoints đã cập nhật

#### Movies API (`src/apis/movies.ts`)
- `/movie/movies` → `/movies`
- `/movie/movies/{id}` → `/movies/{id}`
- `/movie/movies/search` → `/movies/search`

#### Casts API (`src/apis/casts.ts`)
- `/movie/casts` → `/casts`
- `/movie/casts/{id}` → `/casts/{id}`

#### Genres API (`src/apis/genres.ts`)
- `/movie/genres` → `/genres`
- `/movie/genres/{id}` → `/genres/{id}`

#### Files API (Mới tạo: `src/apis/files.ts`)
- `/files/presign-movie` - Lấy presigned URL
- `/video-assets` - Tạo video asset
- `/video-assets/movie/{movieId}` - Lấy video assets của movie

### 3. Files mới được tạo
- `src/apis/files.ts` - API cho file service và video assets
- `GATEWAY_MIGRATION.md` - Tài liệu này

### 4. Files đã cập nhật
- `src/apis/movies.ts` - Cập nhật endpoints
- `src/apis/casts.ts` - Cập nhật endpoints  
- `src/apis/genres.ts` - Cập nhật endpoints
- `src/hooks/mutations/useFileMutations.ts` - Cập nhật để sử dụng files API
- `src/hooks/queries/useUploadMutation.ts` - Cập nhật parameters

## API Flow sau khi migration

### Upload Movie Flow
1. **POST** `/files/presign-movie` - Lấy presigned URL
2. **PUT** `{uploadUrl}` - Upload video lên Azure
3. **POST** `/movies` - Tạo movie metadata
4. **POST** `/video-assets` - Tạo video asset
5. Transcoding tự động trigger

### Movie Operations
- **GET** `/movies?page=1&limit=20` - Lấy danh sách movies
- **GET** `/movies/{id}` - Lấy movie chi tiết
- **GET** `/movies/search?keyword=...` - Tìm kiếm movies
- **POST** `/movies` - Tạo movie mới
- **PUT** `/movies/{id}` - Cập nhật movie
- **DELETE** `/movies/{id}` - Xóa movie

### Video Assets
- **GET** `/video-assets/movie/{movieId}` - Lấy HLS assets để streaming

## Cấu hình Gateway
Gateway routing:
- `/movies/*` → Movie Service (port 3000)
- `/casts/*` → Movie Service (port 3000)  
- `/genres/*` → Movie Service (port 3000)
- `/video-assets/*` → Movie Service (port 3000)
- `/files/*` → File Service (port 3000)
- `/auth/*` → Auth Service (port 3000)

## Lưu ý
- Auth API đã sử dụng đúng paths từ trước (không cần thay đổi)
- Base URL được cấu hình qua environment variable `VITE_API_URL`
- Tất cả API calls đều đi qua `apiClient` với automatic token handling
- Error handling và fallback logic được giữ nguyên