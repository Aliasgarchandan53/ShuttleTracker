import { create } from "zustand";
import { Shuttle } from "../types/types";

type ShuttleStore = {
  shuttles: Shuttle[],
};

const useShuttleStore = create<ShuttleStore>()((set) => ({
  shuttles: [
    { id: '1', from: 'SJT', to: 'MB', active: true },
  ],

  addShuttle: (shuttle:Shuttle) =>
    set((state) => ({
      shuttles: [...state.shuttles, shuttle],
    })),

  removeShuttle: (id:string) =>
    set((state) => ({
      shuttles: state.shuttles.filter((s) => s.id !== id),
    })),
}));

export default useShuttleStore;
