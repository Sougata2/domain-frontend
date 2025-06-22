import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  id: "",
  name: "",
  username: "",
  defaultRole: "",
  menus: [],
  error: "",
  isLoading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserName: (state, action) => {
      state.username = action.payload;
    },
    setId: (state, action) => {
      state.id = action.payload;
    },
    setName: (state, action) => {
      state.name = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDefaultRole.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchDefaultRole.fulfilled, (state, action) => {
        state.isLoading = false;
        state.menus = action.payload.menus;
        state.defaultRole = action.payload.name;
      })
      .addCase(fetchDefaultRole.rejected, (state) => {
        state.error = "Failed To Fetch Default Role";
      })
      .addCase(validateToken.fulfilled, (state, action) => {
        state.id = action.payload.id;
        state.username = action.payload.username;
        state.name = action.payload.name;
      });
  },
});

export const fetchDefaultRole = createAsyncThunk(
  "user/fetchDefaultRole",
  async (userId, thunkApi) => {
    try {
      const response = await axios.get(`/user/default-role/${userId}`);
      response.data.menus.sort((a, b) => a.name.localeCompare(b.name));
      return response.data;
    } catch (error) {
      thunkApi.rejectWithValue(error.message);
    }
  }
);

export const validateToken = createAsyncThunk(
  "user/validateToken",
  async (token, thunkApi) => {
    try {
      const response = await axios.post("/auth/validate-token", { token });
      return response.data;
    } catch (error) {
      thunkApi.rejectWithValue(error.message);
    }
  }
);

export const { setUserName, setId, setName } = userSlice.actions;
export default userSlice.reducer;
