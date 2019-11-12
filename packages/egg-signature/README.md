# 说明

authorization 插件用于客户端鉴权

## 加签
请求参数说明
```js
// 待加密数据
data:	{
  appid:	1111111111 //必填 系统申请
  mch_id:	2222222 // 必填 商户号
  device_info:	333333 // 自定义参数 可以是终端设备号、门店号、收银设备号
  extend: // 扩展字段  json字符串，若没有则不需要加入字符串中
}  
nonce_str:	44444444 // 必填 随机值 
timestamp: 123123// 时间戳 本地时间生成的timestamp 服务器间隔超过600秒 拒绝请求
sign: // 签名
```

**data 加签过程**
```js
accesskey="accesskey"
secretkey="192006250b4c09247ec02edce69f6a2d";
// 1. 发送数据按a-z排序 得到 key1=value1&key2=value2 转stringA
stringA="accesskey=accesskey&appid=1111111111&body=test&device_info=333333&mch_id=2222222&nonce_str=44444444";

// 2. 加密AES （mode、ECB 、PKCS5Padding） 
data=AES(stringA,secretkey) //注：secretkey为商户平台设置的密钥secretkey

// 3. 加密数据
sign=MD5(data+secretkey).toUpperCase()="9A0A8659F005D6984697E2CA0A9CF3B7" //注：MD5签名方式
```
1. 发送数据

```js
POST:
{
  accesskey: accesskey,
  data: data
  timestamp: 123123 // 时间戳 本地时间生成的timestamp 服务器间隔超过600秒 拒绝请求
  sign: sign // MD5
}
```
## 验签

比对AES加密测试数据
```
accesskey: 12345
加密key: 751f621ea5c8f930
测试数据: {"dser":"xxx","code":"123456"}
加密数据: 9a021bfcc3b84232efc66d50ac83edaf3bc291837f5c3a53d984e4a68463f506
sign: 5BF566F74459628DC4C7C3E785B4AB80
```