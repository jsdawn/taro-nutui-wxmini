<template>
  <view class="container home-page">
    <nut-form :model-value="form" :rules="rules">
      <nut-form-item prop="account">
        <nut-input
          v-model="form.account"
          class="nut-input-text"
          placeholder="账号"
          type="text"
        />
      </nut-form-item>

      <nut-form-item prop="password">
        <nut-input
          v-model="form.password"
          class="nut-input-text"
          placeholder="密码"
          type="password"
        />
      </nut-form-item>

      <nut-cell class="action-btns" title="">
        <nut-button type="primary" block>登录</nut-button>
      </nut-cell>
    </nut-form>
  </view>
</template>

<script setup>
import { ref, reactive, toRefs } from 'vue';

const data = reactive({
  form: {},
  rules: {},
});
const { form, rules } = toRefs(data);
</script>

<style lang="scss">
.home-page {
}

.action-btns {
  padding-top: 100px;
}
</style>
