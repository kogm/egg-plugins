export default app => {
  const index = app.config.coreMiddleware.indexOf('gzip');

  if(index>0){
    app.loggers.coreLogger.info('[egg-gzip] 已经存在');
  }else{
    app.config.coreMiddleware.push('gzip');
  }
}