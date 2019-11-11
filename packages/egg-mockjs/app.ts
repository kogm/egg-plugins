import path from "path";
import pathToRegexp from 'path-to-regexp';
import glob from 'glob';

export default app => {
  const index = app.config.coreMiddleware.indexOf('mockjs');

  if (index > 0) {
    app.loggers.coreLogger.info('[egg-mockjs] 已经存在');
  } else {
    const directory = path.join(app.config.baseDir, 'app/mock');
    const mockData = glob
      .sync('**/*.[jt]s', { cwd: directory })
      .map(u => path.join(directory, u))
      .reduce((memo, mockFile) => {
        try {
          const m = require(mockFile);
          memo = {
            ...memo,
            ...(m.default || m),
          };
          return memo;
        } catch (e) {
          throw new Error(e.stack);
        }
      }, {});

    const newMock = {};
    Object.keys(mockData).forEach(originKey => {
      const splitkey = originKey.split(' ');
      const len = splitkey.length;
      const requestKey = splitkey[len - 1];
      const keys = [];
      newMock[requestKey] = {};
      newMock[requestKey]['re'] = pathToRegexp(requestKey, keys);
      newMock[requestKey]['keys'] = keys;

      if (len === 2) {
        newMock[requestKey]['method'] = splitkey[0].toUpperCase();
        newMock[requestKey]['handler'] = mockData[originKey];
      } else if (len === 1) {
        newMock[requestKey]['method'] = 'GET'; // default
        newMock[requestKey]['handler'] = mockData[originKey];
      }
    });

    app.mockData = newMock;
    app.config.coreMiddleware.push('mockjs');
  }
};
