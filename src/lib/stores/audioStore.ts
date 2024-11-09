import { writable } from 'svelte/store';

interface AudioState {
    playingId: string | number | null;
}

const initialState: AudioState = {
    playingId: null
};

export const audioStore = writable<AudioState>(initialState);

// Export actions separately to avoid circular deps
export const audioActions = {
    stopAll: () => audioStore.set({ playingId: null }),
    setPlaying: (id: string | number | null) => audioStore.set({ playingId: id })
}; 