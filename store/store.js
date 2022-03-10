import create from "zustand";
import { devtools } from "zustand/middleware";

let useStore = (set) => ({
    formValue: {},
    setForm: (formValue) =>
        set((state) => ({
            ...state.formValue,
            formValue,
        })),
});

useStore = devtools(useStore);

export default useStore = create(useStore);