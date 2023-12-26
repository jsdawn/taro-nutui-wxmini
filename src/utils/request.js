import axios from 'taro-axios';

import { sessionStore } from '@/store/sessionStore';
import { tansParams } from '@/utils/helper';
import Taro from '@tarojs/taro';

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: process.env.TARO_APP_API + '/api',
  // 超时
  timeout: 60000,
});

// request拦截器
service.interceptors.request.use(
  (config) => {
    // 是否需要设置 token，默认需要
    const isToken = (config.headers || {}).isToken === false;
    // 是否需要防止数据重复提交，默认防止
    const isRepeatSubmit = (config.headers || {}).repeatSubmit === false;

    if (!isToken) {
      config.headers['X-User-Token'] = Taro.getStorageSync('userToken') || '';
    }
    // get请求映射params参数
    if (config.method === 'get' && config.params) {
      let url = config.url + '?' + tansParams(config.params);
      url = url.slice(0, -1);
      config.params = {};
      config.url = url;
    }

    // 防止重复提交
    if (!isRepeatSubmit && (config.method === 'post' || config.method === 'put')) {
      const requestObj = {
        url: config.url,
        data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
        time: new Date().getTime(),
      };
      const requestSize = Object.keys(JSON.stringify(requestObj)).length; // 请求数据大小
      const limitSize = 5 * 1024 * 1024; // 限制存放数据5M
      if (requestSize >= limitSize) {
        console.warn(
          `[${config.url}]: ` + '请求数据大小超出允许的5M限制，无法进行防重复提交验证。'
        );
        return config;
      }
      const sessionObj = sessionStore().getJSON('requestObj');
      if (sessionObj === undefined || sessionObj === null || sessionObj === '') {
        sessionStore().setJSON('requestObj', requestObj);
      } else {
        const s_url = sessionObj.url; // 请求地址
        const s_data = sessionObj.data; // 请求数据
        const s_time = sessionObj.time; // 请求时间
        const interval = 1000; // 间隔时间(ms)，小于此时间视为重复提交
        if (
          s_data === requestObj.data &&
          requestObj.time - s_time < interval &&
          s_url === requestObj.url
        ) {
          const message = '数据正在处理，请勿重复提交';
          console.warn(`[${s_url}]: ` + message);
          return Promise.reject(new Error(message));
        } else {
          sessionStore().setJSON('requestObj', requestObj);
        }
      }
    }

    return config;
  },
  (error) => {
    console.log(error);
    Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (res) => {
    // 未设置状态码则默认成功状态
    const code = res.data.code || 200;
    // 二进制数据则直接返回
    if (res.request.responseType === 'blob' || res.request.responseType === 'arraybuffer') {
      return res.data;
    }
    if (code !== 200) {
      Taro.showToast({
        title: res.data.msg || '服务器开小差了～',
        icon: 'error',
        duration: 2000,
      });
      return Promise.reject('error');
    } else {
      return Promise.resolve(res.data); // 返回响应体 data
    }
  },
  (error) => {
    console.log('err' + error);
    let { message } = error;
    if (message == 'Network Error') {
      message = '后端接口连接异常';
    } else if (message.includes('timeout')) {
      message = '系统接口请求超时';
    } else if (message.includes('Request failed with status code')) {
      message = '系统接口' + message.substr(message.length - 3) + '异常';
    } else {
      message = '服务器开小差了～';
    }
    Taro.showToast({
      title: message,
      icon: 'error',
      duration: 2000,
    });
    return Promise.reject(error);
  }
);

/**
 * 使用示例
const fetchList = async () => {
  // 当 api() 不接 .catch(() => {}) 时，报错停止运行
  // 当接 .catch 时，res 为 undefine 且继续执行下方代码
  const res = await listProduct();
  
  if(res?.data){
    console.log(res.data);
  }
  console.log('1111111');
};
 */

export default service;
