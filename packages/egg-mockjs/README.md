# egg-mockjs


## 使用
```ts
// root/app/mock/demo.ts
export default {
  // 支持值为 Object 和 Array
  'GET /api/users': { users: [1, 2] },

  // GET POST 可省略
  '/api/users/1': { id: 1 },

  // 支持自定义函数，API 参考 koa
  'POST /api/users/create': (ctx) => { ctx.body = 'ok';},
};
```