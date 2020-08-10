import { Injectable, HttpService } from '@nestjs/common';
import { isProd } from '@utils/env';
import { Request } from 'express';

@Injectable()
export class Logger {
  public loggerDB = console

  log(message: string) {
    console.log(message)
  }

  error(message: string, trace?) {
    console.log(message, trace)
  }

  warn(message: string) {
    console.log(message)
  }

  debug(message: string) {
    console.log(message)
  }

  verbose(message: string) {
    console.log(message)
  }

  doAccessLog(req: Request, resBody: any): void {
    const info = `method=${req.method}&ip=${req.ip}&ua=${req.headers['user-agent']}&url=${req.url}&jwt=${JSON.stringify(req.user)}&query=${JSON.stringify(req.query)}&reqBody=${JSON.stringify(req.body)}&resBody=${JSON.stringify(resBody)}`
    if(process.env.NODE_ENV === 'development'){
      console.log(info)
    } else{
      // loggerAccess.info(info);
      console.log(info)
    } 
  }
}