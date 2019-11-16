import {getApiAuth} from '@mitod/sdk-sign';
/**
 * timegap 客户端访问时间 默认600秒
 */
export default options => async (ctx: any, next: any) => {
  const { timegap = 600000, handler } = options;
  const { errorCode } = ctx.app.config;

  ctx.logger.info('【请求验签参数】:', ctx.request.body);
  const { appid, timestamp, sign, signType, ...rest } = ctx.request.body;

  // 1.检查必要字段
  if (!appid || !timestamp || !sign) {
    ctx.body = { code: 1001, message: errorCode[1001] };
    return;
  }

  // 2.检查时间戳
  const now = Date.now();
  if (timestamp > now + timegap || timestamp < now - timegap) {
    ctx.body = { code: 1002, message: '无效时间戳' };
    return;
  }

  // 3.获取secretkey
  let secretkey;
  if(handler){
    secretkey = handler(ctx, appid)
  } else {
    throw new Error('【egg-signature】没有配置回调函数handler');
  }

  // 临时签名
  const realData = {appid, timestamp, ...rest};
  const _signData = getApiAuth(realData, secretkey, signType === 2 ? "AES" : "MD5");
  // 4. 验签
  const ret = (_signData.sign == sign);
  if (!ret) {
    ctx.body = { code: 1005, message: errorCode[1005] };
    return;
  }

  await next();
};
