import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import axios from "axios";

const initialState = {
  stages: [],
  currentStage: null,
};

const stageSlice = createSlice({
  name: "stage",
  initialState,
  reducers: {
    setCurrentStage: (state, action) => {
      state.currentStage = action.payload;
    },
    nextStage: (state) => {
      state.currentStage += 1;
    },
    prevStage: (state) => {
      state.currentStage -= 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStages.pending, () => {
        console.log("Fetching Stages...");
      })
      .addCase(fetchStages.fulfilled, (state, action) => {
        state.stages = action.payload;
        state.currentStage = 0;
        console.log("Fetched Stages.");
      })
      .addCase(fetchStages.rejected, () => {
        toast.error("Error", { description: "Failed To Fetch Stages" });
      });
  },
});

export const fetchStages = createAsyncThunk(
  "stage/fetchStages",
  async (referenceNumber, thunkApi) => {
    try {
      const response = await axios.get(
        `/form-stage/by-reference-number/${referenceNumber}`
      );
      return response.data;
    } catch (error) {
      thunkApi.rejectWithValue(error.message);
    }
  }
);

export const { setCurrentStage, nextStage, prevStage } = stageSlice.actions;
export default stageSlice.reducer;
