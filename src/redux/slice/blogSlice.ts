import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PostFormFields {
  title: string;
  content: string;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  coverImage?: string;
  category: string;
  tags: string[];
}

interface PostFormState {
  formData: Partial<PostFormFields>;
  originalData: Partial<PostFormFields>;
}

const initialState: PostFormState = {
  formData: {},
  originalData: {},
};

const postFormSlice = createSlice({
  name: "postForm",
  initialState,
  reducers: {
    setInitialData(state, action: PayloadAction<Partial<PostFormFields>>) {
      state.formData = action.payload;
      state.originalData = action.payload;
    },
    updateField<K extends keyof PostFormFields>(
      state:any,
      action: PayloadAction<{ field: K; value: PostFormFields[K] }>
    ) {
      state.formData[action.payload.field] = action.payload.value;
    },
    resetForm(state) {
      state.formData = {};
      state.originalData = {};
    },
  },
});

export const { setInitialData, updateField, resetForm } = postFormSlice.actions;
export default postFormSlice.reducer;
