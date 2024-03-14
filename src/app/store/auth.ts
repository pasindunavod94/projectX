import { create } from "zustand";

export type AuthStore = {
  code: string;
  token: {
    token_type: string;
    access_token: string;
  };
  presignedUrl: string;
  csvFile: File | string;
};

export const useAuthStore = create<AuthStore>((set) => ({
  code: "",
  token: {
    token_type: "",
    access_token: "",
  },
  user: {},
  presignedUrl: "",
  csvFile: "",
  clearCode: () => set({ code: "" }),
}));
