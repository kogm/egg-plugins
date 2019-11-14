import {decrypt} from '@mitod/js-utils/lib/secret/aes';
import {checkSign,getOriginData} from '@mitod/sdk-sign';
/**
 * timegap 客户端访问时间 默认600秒
 */
export default options => async (ctx: any, next: any) => {
  const { timegap = 600000, handler } = options;
  const { errorCode } = ctx.app.config;

  ctx.logger.info('请求验签参数', ctx.request.body);
  const { accesskey, data, timestamp, sign } = ctx.request.body;

  // 1.检查必要字段
  if (!accesskey || !data || !timestamp || !sign) {
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
    secretkey = handler(ctx,accesskey)
  } else {
    throw new Error('【egg-signature】没有配置回调函数handler');
  }

  // 4. 验签
  const ret = checkSign(sign, data, secretkey);
  if (!ret) {
    ctx.body = { code: 1005, message: errorCode[1005] };
    return;
  }

  // 5. 解密数据并赋值给locals
  const realData = decrypt(data, secretkey);

  if (realData) {
    ctx.locals.signData = getOriginData(realData);
  } else {
    throw new Error('解析异常');
  }
  await next();
};
