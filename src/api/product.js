import request from '@/utils/request';

export function listProduct(query) {
  return request({
    url: '/v1/product/list',
    method: 'get',
    params: query,
  });
}
