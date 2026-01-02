import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { IUser } from "../types/auth/IUser";

interface IAuthStore {
  user: IUser;
  state: string;
  setUser: (inUser: IUser) => void;
  setState: (inState: string) => void;
}

export const authStore = create<IAuthStore>()(
  devtools(
    (set) => ({
      user: {},
      state: "non-authenticated",
      setUser: (inUser) => set(() => ({ user: inUser })),
      setState: (inState) => set(() => ({ state: inState })),
    }),
    { name: "authStore" }
  )
);
