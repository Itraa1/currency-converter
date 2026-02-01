import { LRUCache } from "lru-cache";
import { type Request, type Response} from "express"

const optionsCacheGetCurrecncies = {
  max: 1,
  ttl: 1000 * 60 * 60,
};

const cacheGetCurrecncies = new LRUCache(optionsCacheGetCurrecncies);

export const cacheGetCurrecnciesMiddleware = async (req :Request, res: Response, next:Function) => {
  
  const key = req.originalUrl;
  const cachedResponse = cacheGetCurrecncies.get(key);

  if (cachedResponse) {
    return res.json(cachedResponse);
  } else {
    const originalJson = res.json;
    (res.json as any)  = (body:any) => {
      const status = res.statusCode;
      if(status >= 200 && status < 300){
      cacheGetCurrecncies.set(key, body);
      }
      return originalJson.call(res, body);
    };
    next();
  }
};

const optionsCacheGetRates = {
  max: 500,
  ttl: 1000 * 60 * 5,
}

const cacheGetRates = new LRUCache(optionsCacheGetRates);

export const cacheGetRatesMiddleware = async (req :Request, res: Response, next:Function) => {
  
  const Url = req.originalUrl;
  const user_id = req.user?.user_id;
  const key:string = Url + user_id;
  const cachedResponse = cacheGetRates.get(key);

  if (cachedResponse) {
    return res.json(cachedResponse);
  } else {
    const originalJson = res.json;
    (res.json as any)  = (body:any) => {
      const status = res.statusCode;
      if(status >= 200 && status < 300){
      cacheGetRates.set(key, body);
      }
      return originalJson.call(res, body);
    };
    next();
  }
};