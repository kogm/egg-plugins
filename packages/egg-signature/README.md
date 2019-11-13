# 说明

1. egg-signature 插件用于服务端验签
2. signature-client 用于客户端加签

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
appid|String|是|开放中心发放的开发者id
mch_id|String|是|商户号
device_info|String|是|自定义参数 可以是终端设备号、门店号、收银设备号
extend|String|否|扩展字段  json字符串，若没有则不需要加入字符串中

### data的生成
```js
// 第一步开发者中心得到
accesskey="accesskey"
secretkey="192006250b4c09247ec02edce69f6a2d";

//第二步 
//发送数据按a-z排序 得到 key1=value1&key2=value2 转stringA
stringA="accesskey=accesskey&appid=1111111111&body=test&device_info=333333&mch_id=2222222";
//第三步
//调用signature-client entry加密
data= AES(stringA,secretkey) //注：secretkey为商户平台设置的密钥secretkey 


```


## 案例
一个客户端待发送的数据包
```js
// 第一步准备数据
data:	{
  appid:	1111111111 //必填 系统申请
  mch_id:	2222222 // 必填 商户号
  device_info:	333333 // 自定义参数 可以是终端设备号、门店号、收银设备号
  extend: // 扩展字段  json字符串，若没有则不需要加入字符串中
}  
timestamp: 123123// 时间戳 本地时间生成的timestamp 服务器间隔超过600秒 拒绝请求
sign: // 签名
```

```js

// 2. 加密AES （mode、ECB 、PKCS5Padding） 


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