import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { subscribeWithSelector } from 'zustand/middleware';

interface HistoryState {
  past: any[];
  present: any;
  future: any[];
}

interface HistoryStore {
  history: HistoryState;
  canUndo: boolean;
  canRedo: boolean;
  pushState: (state: any) => void;
  undo: () => any | null;
  redo: () => any | null;
  clear: () => void;
}

const MAX_HISTORY_SIZE = 50;

export const useHistoryStore = create<HistoryStore>()(
  subscribeWithSelector(
    immer((set, get) => ({
      history: {
        past: [],
        present: null,
        future: []
      },
      canUndo: false,
      canRedo: false,

      pushState: (state) => set((draft) => {
        const { history } = draft;
        
        // Add current present to past
        if (history.present !== null) {
          history.past.push(history.present);
          
          // Limit history size
          if (history.past.length > MAX_HISTORY_SIZE) {
            history.past.shift();
          }
        }
        
        // Set new present and clear future
        history.present = JSON.parse(JSON.stringify(state));
        history.future = [];
        
        // Update flags
        draft.canUndo = history.past.length > 0;
        draft.canRedo = false;
      }),

      undo: () => {
        const { history } = get();
        if (history.past.length === 0) return null;
        
        const previous = history.past[history.past.length - 1];
        
        set((draft) => {
          // Move present to future
          if (draft.history.present !== null) {
            draft.history.future.unshift(draft.history.present);
          }
          
          // Move last past to present
          draft.history.present = previous;
          draft.history.past.pop();
          
          // Update flags
          draft.canUndo = draft.history.past.length > 0;
          draft.canRedo = true;
        });
        
        return previous;
      },

      redo: () => {
        const { history } = get();
        if (history.future.length === 0) return null;
        
        const next = history.future[0];
        
        set((draft) => {
          // Move present to past
          if (draft.history.present !== null) {
            draft.history.past.push(draft.history.present);
          }
          
          // Move first future to present
          draft.history.present = next;
          draft.history.future.shift();
          
          // Update flags
          draft.canUndo = true;
          draft.canRedo = draft.history.future.length > 0;
        });
        
        return next;
      },

      clear: () => set((draft) => {
        draft.history = { past: [], present: null, future: [] };
        draft.canUndo = false;
        draft.canRedo = false;
      })
    }))
  )
);