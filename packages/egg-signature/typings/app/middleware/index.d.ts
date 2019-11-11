// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportServer from '../../../app/middleware/signature';

declare module 'egg' {
  interface IMiddleware {
    server: typeof ExportServer;
  }
}
