const rootURL = import.meta.env.VITE_API_ROOT_URL;

export const setImageUrl = (imagePath) => {
  if (imagePath) {
    return rootURL + imagePath;
  }
  return null;
}