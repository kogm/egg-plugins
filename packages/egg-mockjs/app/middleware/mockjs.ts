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
let cacheMock:string[] | null = null;

export default () => {
  return async function mockjs(ctx, next) {
      const { mockData } = ctx.app;
      if(!cacheMock){
        cacheMock = Object.keys(mockData);
      }

      for(let i=0;i< cacheMock.length;i++){
        const mock = cacheMock[i];
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
              await handler(ctx, next);
              break;
            } else {
              ctx.body = handler;
              break;
            }
          } else if(i === cacheMock.length-1){
            await next();
          }
        }
      }
  };
};
