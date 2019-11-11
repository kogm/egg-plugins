function decodeParam(val) {
  if (typeof val !== 'string' || val.length === 0) {
    return val;
  }
  try {
    return decodeURIComponent(val);
  } catch (err) {
    if (err instanceof URIError) {
      err.message = `Failed to decode param ' ${val} '`;
      err['status'] = 400;
      err['statusCode'] = 400;
    }
    throw err;
  }
}
export default options => {
  return async function mockjs(ctx, next) {
    const { dev } = options;
    if (dev) {
      const { mockData } = ctx.app;
      Object.keys(mockData).forEach(mock => {
        const { method, re, keys, handler } = mockData[mock];

        if (method === ctx.request.method) {
          const match = re.exec(ctx.request.url);
          if (match) {
            const params = {};
            for (let i = 1; i < match.length; i += 1) {
              const key = keys[i - 1];
              const prop = key.name;
              const val = decodeParam(match[i]);
              if (val !== undefined || !params[prop]) {
                params[prop] = val;
              }
            }
            ctx.request.query = params;
            if (typeof handler === 'function') {
              handler(ctx);
            } else {
              ctx.body = handler;
            }
          }
        }
      });
    }
    await next();
  };
};
