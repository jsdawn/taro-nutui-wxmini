import { defineStore } from 'pinia';

const initData = {
  requestObj: null, // 请求体
};

// 存放短期会话级别信息
// const store = useSessionStore()
export const useSessionStore = defineStore('session', {
  state: () => ({ ...initData }),
  getters: {
    // 使用方法 store.getJSON(key)
    getJSON(state) {
      return (key) => state[key];
    },
  },
  actions: {
    // 使用方法 store.setJSON(key，value)
    setJSON(key, value) {
      if (!Object.hasOwnProperty.call(initData, key)) {
        console.error('ERROR: sessionStore not has property [' + key + ']');
        return;
      }
      this[key] = value;
    },
  },
});
