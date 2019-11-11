export default app => {
  const index = app.config.coreMiddleware.indexOf('signature');

  if(index>0){
    app.loggers.coreLogger.info('[egg-signature] 已经存在');
  }else{
    app.config.coreMiddleware.push('signature');
  }
}