import { ImageEffectTypes } from "@/modules/expo-opencv";
import {
  deletePhotoEffectById,
  getNextPhotoEffectOrder,
  getPhotoById,
  getPhotoEffectsByPhotoId,
  insertPhotoEffectsByPhotoId,
} from "@/persistence/photos";
import { PhotoEffectEntity, PhotoEntity } from "@/persistence/schema";
import { produce } from "immer";
import { create } from "zustand";

export interface PhotoActiveRecordState {
  photo: PhotoEntity | null;
  photoEffects: PhotoEffectEntity[] | null;
  isLoading: boolean;
  loadPhotoById: (id: number, force?: boolean) => void;
  addEffect: (effectName: ImageEffectTypes) => void;
  removeEffect: (effectId: number) => void;
}

const usePhotoActiveRecord = create<PhotoActiveRecordState>()((set, get) => ({
  photo: null,
  photoEffects: null,
  isLoading: false,
  loadPhotoById: async (id: number, force = false) => {
    if (get().photo?.id === id && !force) return;

    set({ isLoading: true });
    try {
      const photo = await getPhotoById(id);
      const photoEffects = await getPhotoEffectsByPhotoId(id);
      set({ photo, photoEffects });
    } catch (error) {
      console.error(`Failed to load photo with id ${id}:`, error);
      set({ photo: null, photoEffects: null });
    } finally {
      set({ isLoading: false });
    }
  },
  addEffect: async (effectName: ImageEffectTypes) => {
    const photo = get().photo;
    if (!photo) return;

    const nextOrder = await getNextPhotoEffectOrder(photo.id);
    const newEffect = await insertPhotoEffectsByPhotoId(photo.id, {
      effectName,
      order: nextOrder,
    });
    set((state) =>
      produce(state, (draft) => {
        (draft.photoEffects || (draft.photoEffects = [])).push(...newEffect);
      }),
    );
  },
  removeEffect: async (effectId: number) => {
    await deletePhotoEffectById(effectId);
    set((state) => ({
      photoEffects: state.photoEffects?.filter(
        (effect) => effect.id !== effectId,
      ),
    }));
  },
}));

export default usePhotoActiveRecord;
