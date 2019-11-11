'use strict';

const mock = require('egg-mock');

describe('test/signature.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/signature-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect('hi, signature')
      .expect(200);
  });
});
