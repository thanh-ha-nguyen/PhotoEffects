import { getAllPhotos } from "@/persistence/photos";
import { Photo } from "@/persistence/schema";
import { create } from "zustand";

export interface PhotosState {
  photos: Photo[];
  isLoaded: boolean;
  isLoading: boolean;
  loadPhotos: (force?: boolean) => void;
}

const usePhotos = create<PhotosState>()((set, get) => ({
  photos: [],
  isLoaded: false,
  isLoading: false,
  loadPhotos: async (force = false) => {
    if (get().isLoaded && !force) return;

    set({ isLoading: true });
    try {
      const photos = await getAllPhotos();
      set({ photos, isLoaded: true });
    } catch (error) {
      console.error("Failed to load photos:", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default usePhotos;
