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
  onClick?: () => void;
  active?: boolean;
  label?: string;
  videoId?: string;
  type: 'favorite' | 'playlist';
}

export interface Playlist {
  id: number;
  name: string;
}

export interface PlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
  playlists: Playlist[];
  onAddToPlaylist: (playlistId: number) => void;
}
