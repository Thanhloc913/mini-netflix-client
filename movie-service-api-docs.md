# Movie Service API Documentation

## Base URL
`http://localhost:3000`

---

## 🎬 Movies API

### 1. Create Movie
**POST** `/movies`

```json
{
  "title": "string (required)",
  "description": "string (required)", 
  "releaseDate": "string (ISO datetime, optional)",
  "duration": "number (minutes, optional)",
  "isSeries": "boolean (required)",
  "posterUrl": "string (URL, optional)",
  "trailerUrl": "string (URL, optional)",
  "genreIds": ["string (UUID array, optional)"],
  "castIds": ["string (UUID array, optional)"]
}
```

### 2. Get All Movies
**GET** `/movies`

**Query Parameters:**
- `page`: number (optional) - Trang hiện tại
- `limit`: number (optional, max 100) - Số items per page
- `sortBy`: string (optional, default: 'createdAt') - Sắp xếp theo field
- `sortOrder`: 'ASC' | 'DESC' (optional, default: 'DESC')

**Response:**
```json
// Có pagination
{
  "data": [Movie[]],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}

// Không pagination
{
  "data": [Movie[]],
  "total": 100
}
```

### 3. Get Latest Movies
**GET** `/movies?sortBy=createdAt&sortOrder=DESC`

### 4. Get Highest Rated Movies  
**GET** `/movies?sortBy=rating&sortOrder=DESC`

### 5. Get Movies Only (Phim lẻ)
**GET** `/movies` + filter `isSeries: false` (cần implement filter)

### 6. Get TV Series Only (Phim bộ)
**GET** `/movies` + filter `isSeries: true` (cần implement filter)

### 7. Search Movies
**GET** `/movies/search`

**Query Parameters:**
- `keyword`: string (required) - Từ khóa tìm kiếm
- `page`, `limit`, `sortBy`, `sortOrder` (optional)

### 8. Get Movies by Genre
**GET** `/movies/genre/:genreId`

**Query Parameters:**
- `page`, `limit`, `sortBy`, `sortOrder` (optional)

### 9. Get Movie by ID
**GET** `/movies/:id`

**Response:**
```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "releaseDate": "date",
  "duration": "number",
  "isSeries": "boolean",
  "posterUrl": "string",
  "trailerUrl": "string", 
  "rating": "number",
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "genres": [Genre[]],
  "casts": [Cast[]],
  "episodes": [Episode[]],
  "videoAssets": [VideoAsset[]]
}
```

### 10. Update Movie
**PATCH** `/movies/:id`

Body: Same as Create Movie (all fields optional)

### 11. Soft Delete Movie
**DELETE** `/movies/:id`

### 12. Hard Delete Movie
**DELETE** `/movies/:id/hard`

### 13. Seed Anime Movies (Development)
**POST** `/movies/seed`

---

## 🎭 Genres API

### 1. Create Genre
**POST** `/genres`

```json
{
  "name": "string (required, unique)"
}
```

### 2. Get All Genres
**GET** `/genres`

### 3. Get Genre by ID
**GET** `/genres/:id`

### 4. Update Genre
**PATCH** `/genres/:id`

```json
{
  "name": "string (optional)"
}
```

### 5. Delete Genre
**DELETE** `/genres/:id`

---

## 👥 Casts API

### 1. Create Cast
**POST** `/casts`

```json
{
  "name": "string (required)",
  "role": "string (required)" // Actor, Director, etc.
}
```

### 2. Get All Casts
**GET** `/casts`

### 3. Get Cast by ID
**GET** `/casts/:id`

### 4. Update Cast
**PATCH** `/casts/:id`

```json
{
  "name": "string (optional)",
  "role": "string (optional)"
}
```

### 5. Delete Cast
**DELETE** `/casts/:id`

---

## 📺 Episodes API

### 1. Create Episode
**POST** `/episodes`

```json
{
  "movieId": "string (UUID, required)",
  "seasonNumber": "number (required, positive integer)",
  "title": "string (required)",
  "duration": "number (optional, minutes)"
}
```

**Note:** `episodeNumber` được tự động tăng dựa trên season

### 2. Get Episodes by Movie
**GET** `/episodes/movie/:movieId`

### 3. Get Episode by ID
**GET** `/episodes/:id`

### 4. Update Episode
**PATCH** `/episodes/:id`

```json
{
  "seasonNumber": "number (optional)",
  "title": "string (optional)", 
  "duration": "number (optional)"
}
```

### 5. Delete Episode
**DELETE** `/episodes/:id`

---

## 🎥 Video Assets API

### 1. Create Video Asset
**POST** `/video-assets`

```json
{
  "movieId": "string (UUID, optional)", // Cho phim lẻ
  "episodeId": "string (UUID, optional)", // Cho episode
  "resolution": "1080p" | "720p" | "480p",
  "format": "string (required)", // mp4, hls, dash
  "url": "string (URL, required)",
  "status": "pending" | "processing" | "done" | "failed" (optional, default: pending)
}
```

**Note:** Chỉ được gắn với `movieId` HOẶC `episodeId`, không phải cả hai

### 2. Get Video Assets by Movie
**GET** `/video-assets/movie/:movieId`

### 3. Get Video Assets by Episode
**GET** `/video-assets/episode/:episodeId`

### 4. Update Video Asset Status
**PATCH** `/video-assets/:id/status`

```json
{
  "status": "pending" | "processing" | "done" | "failed"
}
```

---

## 📋 Common Response Formats

### Movie Object
```json
{
  "id": "uuid",
  "title": "string",
  "description": "string", 
  "releaseDate": "date | null",
  "duration": "number | null",
  "isSeries": "boolean",
  "posterUrl": "string | null",
  "trailerUrl": "string | null",
  "rating": "number (0-10)",
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "deletedAt": "datetime | null",
  "genres": [Genre[]],
  "casts": [Cast[]],
  "episodes": [Episode[]], // Only for series
  "videoAssets": [VideoAsset[]]
}
```

### Genre Object
```json
{
  "id": "uuid",
  "name": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "movies": [Movie[]] // When included
}
```

### Cast Object  
```json
{
  "id": "uuid",
  "name": "string",
  "role": "string",
  "createdAt": "datetime", 
  "updatedAt": "datetime",
  "movies": [Movie[]] // When included
}
```

### Episode Object
```json
{
  "id": "uuid",
  "seasonNumber": "number",
  "episodeNumber": "number", // Auto-generated
  "title": "string",
  "duration": "number | null",
  "createdAt": "datetime",
  "updatedAt": "datetime", 
  "movie": Movie, // When included
  "videoAssets": [VideoAsset[]] // When included
}
```

### VideoAsset Object
```json
{
  "id": "uuid",
  "resolution": "string",
  "format": "string", 
  "url": "string",
  "status": "pending" | "processing" | "done" | "failed",
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "movie": Movie | null, // When included
  "episode": Episode | null // When included  
}
```

---

## 🔍 Suggested Frontend Features

### Homepage
- **Latest Movies:** `GET /movies?sortBy=createdAt&sortOrder=DESC&limit=10`
- **Top Rated:** `GET /movies?sortBy=rating&sortOrder=DESC&limit=10`
- **Movies:** Filter by `isSeries=false`
- **TV Series:** Filter by `isSeries=true`

### Movie Detail Page
- `GET /movies/:id` để lấy full info
- `GET /video-assets/movie/:movieId` để lấy video links

### Series Detail Page  
- `GET /movies/:id` để lấy series info
- `GET /episodes/movie/:movieId` để lấy tất cả episodes
- `GET /video-assets/episode/:episodeId` để lấy video cho episode cụ thể

### Search & Filter
- **Search:** `GET /movies/search?keyword=...`
- **By Genre:** `GET /movies/genre/:genreId`
- **All Genres:** `GET /genres` để build filter UI

---

## ⚠️ Notes

1. **UUID Format:** Tất cả ID đều là UUID v4
2. **Soft Delete:** Sử dụng soft delete, records vẫn tồn tại trong DB với `deletedAt`
3. **Pagination:** Nếu không truyền `page/limit`, sẽ trả về tất cả data
4. **Relations:** Các endpoint GET thường include relations để tránh N+1 queries
5. **Video Status:** Video assets có status để track quá trình transcode
6. **Episode Numbering:** Episode number tự động tăng theo season

## 🚀 Cần Implement Thêm

Để hoàn thiện frontend, cần thêm các endpoint:

1. **Filter Movies:**
   ```
   GET /movies/filter?isSeries=true&genreId=...&rating=...
   ```

2. **Recently Updated Series:**
   ```  
   GET /movies/recently-updated-series
   ```

3. **Trending/Popular:**
   ```
   GET /movies/trending
   ```