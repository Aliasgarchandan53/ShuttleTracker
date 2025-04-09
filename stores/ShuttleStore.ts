import { create } from "zustand";
import { Shuttle } from "../types/types";

type ShuttleStore = {
  shuttles: Shuttle[],
};

const useShuttleStore = create<ShuttleStore>()((set) => ({
  shuttles: [
    { id: '1', from: 'Campus', to: 'Gate 1', active: true },
    { id: '2', from: 'Campus', to: 'Gate 2', active: false },
    { id: '3', from: 'Hostel', to: 'Main Block', active: true },
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
