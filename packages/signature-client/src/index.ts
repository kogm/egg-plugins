import { encrypt } from '@mitod/js-utils/lib/secret/aes';
import md5 from '@mitod/js-utils/lib/secret/md5';
import { object2Str } from '@mitod/js-utils/lib/str';

// api签名
class Sign {
  /**
   * 设备激活加签
   * @param {String} account 开发者密钥
   * @param {String} data 待加密数据 使用@utils/secret加密aes
   */
  static dserSign = (account, data) => {
    const { dno, dser } = account;
    // 转str
    const params2str = JSON.stringify({
      dser,
      ...data,
    });
    // 参数排序 A-Z
    const sortData = {
      data: encrypt(params2str, dser),
      dno,
      dser,
      timestamp: Date.now(),
    };
    const data2sort = object2Str(sortData);
    // md5加密
    const sign = md5(data2sort);
    // 删除 开发密钥
    delete sortData.dser;
    return {
      ...sortData,
      sign,
    };
  };

  /**
   * 网络请求加签
   * @param {String} posid 设备id
   * @param {String} posser 激活密钥
   * @param {String} data 待加密数据 使用@utils/secret加密aes
   */
  static posserSign = (posid, posser, data?) => {
    // 1.拼装数据
    const params = {
      posser,
      ...data,
    };
    // 2.转str
    const params2str = JSON.stringify(params);
    // 3.加密数据
    const data2hex = encrypt(params2str, posser);
    const timestamp = Date.now();
    // 4. 参数排序 A-Z
    const preSortData = {
      data: data2hex,
      posid,
      posser,
      timestamp,
    };
    const data2sort = object2Str(preSortData);
    // 5.md5加密
    const sign = md5(data2sort);
    // 6.postdata
    delete preSortData.posser;
    return {
      ...preSortData,
      sign,
    };
  };
}
export default Sign;
