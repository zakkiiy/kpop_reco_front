const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const apis = {
  addFavorite: (videoId: string) => `${apiUrl}/api/v1/videos/${videoId}/favorites`,
  removeFavorite: (videoId: string) => `${apiUrl}/api/v1/videos/${videoId}/favorites`,
};
