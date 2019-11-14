# 说明

1. egg-sign 用于服务端验签
2. sdk-sign 用于客户端加签

## 配置 

```ts
const config = {
  timegap: 600000,
  handler: (ctx)=>{}
}
```

1. AES加密  http://tool.chacuo.net/cryptaes  
2. MD5加密  https://www.sojson.com/md5/  

## 加签
客户端发送的所有都是POST请求
一次请求描述  
字段|类型|是否必须|备注|
:-|:-:|:-:|:-
accesskey|String|是|开放中心发放的开发者秘钥
data|Object|是|详情查看，如何生成请看下文
timestamp|Date|是|时间戳 本地时间生成的timestamp 服务器间隔超过600
sign| String |是| 数据data MD5签名值,如何生成请看下文

data:  
字段|类型|是否必须|备注|
:-|:-:|:-:|:-
appid|String(32)）|是|开放中心创建应用的时候都得
mch_id|String(32)|是|商户号
device_info|String|是|自定义参数 可以是终端设备号、门店号、收银设备号
extend|String|否|扩展字段  json字符串，若没有则不需要加入字符串中

### data、sign的生成
```js
// 开始 开发者中心得到
accesskey="12345"
secretkey="751f621ea5c8f930";

// 第一步
// 客户端待加密数据
data:	{
  appid:	1111111111 //必填 开放中心创建应用的时候都得
  mch_id:	2222222 // 必填 商户号
  device_info:	333333 // 自定义参数 可以是终端设备号、门店号、收银设备号
  extend: // 扩展字段  json字符串，若没有则不需要加入字符串中
}

// 第二步 
// 发送数据按a-z排序 得到 key1=value1&key2=value2 转stringA
stringA="accesskey=12345&appid=1111111111&body=test&device_info=333333&mch_id=2222222";
// 第三步
// 调用signature-client entry加密
// 加密AES （mode、ECB 、PKCS5Padding） 
data=AES(stringA, secretkey) //注：secretkey为商户平台设置的密钥secretkey 
// 第四步
sign=MD5(data+secretkey).toUpperCase()="00581ae47c384bfff54195b4ff42362ac254d2f7ab91438d1af4a07ef1c65d0aa71c3bbfc2988fe4c65ab40f978238f41a4d8039c0cc28eabab1292184fe99a16a9586c01a1755f74018a6dd4d904628" //注：MD5签名方式
```

```

```ts
data = {"appid":"1111111111","mch_id":"2222222","device_info":"333333"}
secretkey="751f621ea5c8f930"; // 16位

// 加密之后的data
data='00581ae47c384bfff54195b4ff42362ac254d2f7ab91438d1af4a07ef1c65d0aa71c3bbfc2988fe4c65ab40f978238f41a4d8039c0cc28eabab1292184fe99a16a9586c01a1755f74018a6dd4d904628'
```
加密之后待发送的数据包
```js
POST:
{
  accesskey: accesskey,
  data: data
  timestamp: 123123 // 时间戳 本地时间生成的timestamp 服务器间隔超过600秒 拒绝请求
  sign: sign // MD5
}
```

## 测试验签
```
accesskey: 12345
secretkey: 751f621ea5c8f930
测试待加密数据data: {"dser":"xxx","code":"123456"}  
AES加密后数据data: 9a021bfcc3b84232efc66d50ac83edaf3bc291837f5c3a53d984e4a68463f506
MD5加密得到sign值: 5BF566F74459628DC4C7C3E785B4AB80
```