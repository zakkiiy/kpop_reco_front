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

export interface HeaderProps {
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface IconButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  label?: string;
  videoId?: string;
}
