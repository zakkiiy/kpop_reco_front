// KpopVideo
export interface Artist {
  name: string;
}

export interface KpopVideo {
  id: number;
  name: string;
  videoId: string;
  image: string;
  viewCount: number;
  postedAt: string;
  artist: Artist;
}
