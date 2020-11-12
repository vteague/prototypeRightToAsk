import { createSlice, createSelector } from "@reduxjs/toolkit";
import fakeBackend from "../config/fakeBackend";

const slice = createSlice({
  name: "tags",
  initialState: {
    tags: [],
    tagsSelected: [],
  },
  reducers: {
    setTags: (state, action) => {
      state.tags = action.payload.tags;
      // console.log(
      //   "-------------------------------Set tags in redux to:-------------------------------\n",
      //   state.tags
      // );
    },
    addNewTag: (state, action) => {
      state.tags.push(action.payload);
    },
    useTag: (state, action) => {
      state.tags.find((t) => t.name === action.payload.name).count++;
    },
    selectTag: (state, action) => {
      state.tagsSelected.push(action.payload.tag);
    },
    deselectTag: (state, action) => {
      state.tagsSelected.splice(action.payload.index, 1);
    },
    resetTagSelection: (state, action) => {
      state.tagsSelected = [];
    },
  },
});

export default slice.reducer;
export const {
  addNewTag,
  selectTag,
  deselectTag,
  resetTagSelection,
  useTag,
  setTags,
} = slice.actions;

export const getUnselectedTags = createSelector(
  (state) => state.tags.tags,
  (state) => state.tags.tagsSelected,

  (tags, tagsSelected) => {
    const unselectedTags = tags.filter((t) => !tagsSelected.includes(t));
    return unselectedTags;
  }
);

export const getTagById = (tagId) =>
  createSelector(
    (state) => state.tags.tags,
    (tags) => tags.find((t) => t.tagId === tagId)
  );

export const getTagsByIdArray = (IdArray) =>
  createSelector(
    (state) => state.tags.tags,
    (tags) => tags.filter((t) => IdArray.includes(t.tagId))
  );
