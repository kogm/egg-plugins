'use strict';
import {Context} from 'egg';

interface Handler {
  timegap:number;
  handler:(ctx:Context, accesskey:string) => void;
}

/**
 * egg-signature default config
 * @member Config#signature
 * @property {String} SOME_KEY - some description
 */
exports.signature = {
  timegap: 600000,
} as Handler;
