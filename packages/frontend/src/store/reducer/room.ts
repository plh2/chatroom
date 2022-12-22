import {
  ADD_MESSAGE_REQUEST,
  MESSAGE,
  MESSAGE_REQUEST,
  MESSAGE_RESPONSE,
} from "@/interfaces/IMessage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import Api from "@/Api";

export interface IState {
  scrollToEnd: null | number;
  scrollToTop: null | number;
  error: string | null;
  data: MESSAGE_RESPONSE;
  loadingMessage: boolean;
}

const initialState: IState = {
  scrollToEnd: null,
  scrollToTop: null,
  loadingMessage: false,
  error: null,
  data: {
    message: [],
    totalCount: 0,
  },
};

// 加载房间基本信息
export const getRoomInfoThunk = createAsyncThunk<void, string>(
  `fetchRoomInfo`,
  async (id, { dispatch }) => {
    // 清空旧的信息
    dispatch(initialMessage({ message: [], totalCount: 0 }))
    // 加载中
    dispatch(changeLoading(true));
    // 获取当前房间基本信息
    let res = await Api.getRoom({
      page: 1,
      pageSize: 20,
      _id: id,
    });
    // 加载结束
    dispatch(changeLoading(false));
    // 将当前房间基本信息存到store里面
    dispatch(initialMessage(res));
    // div元素撑开后，滚动到底部
    dispatch(scrollToEnd());
  }
);
// 加载更多消息
export const loadRoomMoreMessageThunk = createAsyncThunk<void, MESSAGE_REQUEST>(
  `loadRoomMoreMessageThunk`,
  async (data, { dispatch }) => {
    dispatch(changeLoading(true));
    let res = await Api.getRoom(data);
    dispatch(changeLoading(false));
    dispatch(loadMoreMessage(res.message));
  }
);

// 发送一条新消息
export const addRoomMessageThunk = createAsyncThunk<void, ADD_MESSAGE_REQUEST>(
  `addRoomMessage`,
  async (data, { dispatch }) => {
    await Api.sendMessage(data);
  }
);

export const roomSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    changeLoading(state, action: PayloadAction<boolean>) {
      state.loadingMessage = action.payload;
    },
    scrollToEnd(state) {
      state.scrollToEnd = Math.random();
    },
    scrollToTop(state) {
      state.scrollToTop = Math.random();
    },
    loadMoreMessage(state, action: PayloadAction<MESSAGE[]>) {
      state.data.message = [...action.payload, ...state.data.message];
    },
    addMessage(state, action: PayloadAction<MESSAGE[]>) {
      state.data.message.push(action.payload[0]);
    },
    initialMessage(
      state,
      action: PayloadAction<{ message: MESSAGE[]; totalCount: number }>
    ) {
      state.data = action.payload;
    },
  },
});

export const {
  scrollToTop,
  scrollToEnd,
  addMessage,
  loadMoreMessage,
  initialMessage,
  changeLoading,
} = roomSlice.actions;

export default roomSlice.reducer;
