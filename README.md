# mito-egg

egg 中间件

## egg-gzip

```
npm i egg-gzip 或者yarn add egg-gzip
```

> 启动
```ts
// plugin.ts
const plugin = {
  //...
  gzip: {
    enable: true, 
    package: 'egg-gzip',
  },
};
```

> 配置
```ts

// config.default.[jt]s
export default = ()=>{
  //...
  const confg = {};
  config.gzip: {
    threshold: 1024, // 小于 1k 的响应体不压缩
  },
  //...
  return {
    ...config,
  }
}

```

## egg-mockjs

用于模拟数据,依赖mockjs，可以使用mockjs生成随机数据
```
npm i egg-mockjs 或者yarn add egg-mockjs
```

> 启动
```ts
// plugin.ts
const plugin = {
  //...
  mockjs: {
    enable: true,
    package: 'egg-mockjs',
  },
};
```

> 配置
```ts

// config.default.[jt]s
export default = ()=>{
  //...
  const confg = {};
  config.mockjs: {
    dev: true, //开发模式 会启动mockjs
  },
  //...
  return {
     ...config,
  }
}

```
> 使用
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
