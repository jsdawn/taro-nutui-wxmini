<template>
  <view class="index">
    <view>
      <img src="" alt="" />
    </view>
    {{ state.msg }} <Dongdong />
    <view class="btn-wrap">
      <nut-button type="primary" @click="handleClick('text', state.msg2, true)">点我1</nut-button>
      <nut-button type="primary" @click="fetchList">获取列表</nut-button>
    </view>

    <nut-toast
      :msg="state.msg2"
      v-model:visible="state.show"
      :type="state.type"
      :cover="state.cover"
    />
  </view>
</template>

<script setup>
import { reactive } from 'vue';
import { Dongdong } from '@nutui/icons-vue-taro';
import { getMsg } from '@/utils/index';
import { sessionStore } from '@/store/sessionStore';
import { listProduct } from '@/api/product';

const store = sessionStore();
const state = reactive({
  // msg: '欢迎使用 NutUI4.0 开发小程序',
  msg: getMsg(),
  msg2: '你成功了～',
  type: 'text',
  show: false,
  cover: false,
});

const handleClick = (type, msg, cover = false) => {
  state.show = true;
  state.msg2 = msg;
  state.type = type;
  state.cover = cover;
};

const fetchList = async () => {
  const res = await listProduct();
  if (res?.data) {
    console.log(res.data);
  }
};
</script>

<style lang="scss">
.index {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

.btn-wrap {
  padding: 20px;
}
</style>
