"use strict";

/**
 * egg-gzip default config
 * @member Config#gzip
 * @property {String} SOME_KEY - some description
 */
exports.gzip = {
  threshold: 1024 // 小于 1k 的响应体不压缩
};
