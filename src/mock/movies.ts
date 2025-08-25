export type Movie = {
  id: string;
  title: string;
  description: string;
  genres: string[];
  imageUrl: string;
  backdropUrl: string;
  rating: number;
  year: number;
  duration: number; // in minutes
  director: string;
  cast: string[];
  trailerUrl?: string;
  featured?: boolean;
  season?: string;
  episode?: string;
  status?: string;
};

export type MovieCategory = {
  id: string;
  name: string;
  movies: Movie[];
};

export const MOCK_MOVIES: Movie[] = [
  {
    id: "1",
    title: "Gachakuza",
    description: "Bị buộc tội giết người và nằm xuống hố, đứa trẻ mồ côi nọ gặp nhóm chiến binh quái vật có sức mạnh đặc biệt để khám phá sự thật. Nội câu rơi xuống là một thế giới tăm tối, đầy sinh vật khát máu.",
    genres: ["Action", "Fantasy", "Shounen"],
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=400&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1920&auto=format&fit=crop",
    rating: 8.7,
    year: 2024,
    duration: 24,
    director: "Haruo Sotozaki",
    cast: ["Natsuki Hanae", "Satomi Sato"],
    featured: true,
    season: "Season 1",
    status: "Đang phát hành"
  },
  {
    id: "2",
    title: "Hoa Thơm Xin Lỗi",
    description: "Một câu chuyện tình yêu đầy cảm xúc về những người trẻ tìm kiếm ý nghĩa cuộc sống qua những mối quan hệ phức tạp.",
    genres: ["Romance", "Drama", "School"],
    imageUrl: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=400&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1920&auto=format&fit=crop",
    rating: 8.4,
    year: 2024,
    duration: 24,
    director: "Makoto Shinkai",
    cast: ["Ryunosuke Kamiki", "Mone Kamishiraishi"],
    featured: true,
    season: "Season 1",
    episode: "Tập 7",
    status: "Đang phát hành"
  },
  {
    id: "3",
    title: "Chuyện Sinh Thành Đệ Thất Hoàng Tử",
    description: "Cuộc phiêu lưu của hoàng tử thứ bảy trong thế giới ma thuật đầy nguy hiểm và bí ẩn.",
    genres: ["Fantasy", "Adventure", "Magic"],
    imageUrl: "https://images.unsplash.com/photo-1496715976403-7e36dc43f17b?q=80&w=400&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1496715976403-7e36dc43f17b?q=80&w=1920&auto=format&fit=crop",
    rating: 8.5,
    year: 2024,
    duration: 24,
    director: "Sunghoo Park",
    cast: ["Junya Enoki", "Yuma Uchida"],
    featured: true,
    season: "Season 2",
    episode: "Tập 8",
    status: "Đang phát hành"
  },
  {
    id: "4",
    title: "Seishun Buta Yarou wa Santa Claus",
    description: "Câu chuyện về thanh xuân và những hiện tượng siêu nhiên kỳ lạ xung quanh các nhân vật chính.",
    genres: ["Romance", "Supernatural", "School"],
    imageUrl: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=400&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=1920&auto=format&fit=crop",
    rating: 8.6,
    year: 2024,
    duration: 24,
    director: "Soichi Masui",
    cast: ["Kaito Ishikawa", "Asami Seto"],
    featured: true,
    season: "Season 2",
    episode: "Tập 5",
    status: "Đang phát hành"
  },
  {
    id: "5",
    title: "Sono Bisque Doll wa Koi wo Suru",
    description: "Câu chuyện tình yêu ngọt ngào giữa một chàng trai làm búp bê và cô gái yêu thích cosplay.",
    genres: ["Romance", "Comedy", "School"],
    imageUrl: "https://images.unsplash.com/photo-1495567720989-cebdbdd97913?q=80&w=400&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1495567720989-cebdbdd97913?q=80&w=1920&auto=format&fit=crop",
    rating: 8.8,
    year: 2024,
    duration: 24,
    director: "Keisuke Shinohara",
    cast: ["Shoya Ishige", "Hina Suguta"],
    featured: true,
    season: "Season 2",
    episode: "Tập 8",
    status: "Đang phát hành"
  },
  {
    id: "6",
    title: "Tiếng Gọi Của Trái Tim",
    description: "Một câu chuyện cảm động về tình bạn và sự trưởng thành của những người trẻ.",
    genres: ["Drama", "Slice of Life", "School"],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=400&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1920&auto=format&fit=crop",
    rating: 8.3,
    year: 2024,
    duration: 24,
    director: "Naoko Yamada",
    cast: ["Saori Hayami", "Takahiro Sakurai"],
    season: "Season 1",
    episode: "Tập 12",
    status: "Hoàn thành"
  }
];

export const MOVIE_CATEGORIES: MovieCategory[] = [
  {
    id: "new-releases",
    name: "Mới Phát Hành",
    movies: MOCK_MOVIES.filter(movie => movie.status === "Đang phát hành").slice(0, 6)
  },
  {
    id: "latest-updates",
    name: "Mới Cập Nhật",
    movies: MOCK_MOVIES.slice(0, 6)
  },
  {
    id: "romance",
    name: "Lãng Mạn",
    movies: MOCK_MOVIES.filter(movie => movie.genres.includes("Romance"))
  },
  {
    id: "action",
    name: "Hành Động",
    movies: MOCK_MOVIES.filter(movie => movie.genres.includes("Action"))
  },
  {
    id: "completed",
    name: "Hoàn Thành",
    movies: MOCK_MOVIES.filter(movie => movie.status === "Hoàn thành")
  }
];