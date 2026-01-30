import { LRUCache } from "lru-cache";
import { type Request, type Response} from "express"

const options = {
  max: 1,
  ttl: 1000 * 60 * 60,
};

const cacheGetCurrecncies = new LRUCache(options);

export const cacheGetCurrecnciesMiddleware = async (req :Request, res: Response, next:Function) => {
  
  const key = req.originalUrl;
  const cachedResponse = cacheGetCurrecncies.get(key);

  if (cachedResponse) {
    console.log("отправка кешированных данных", cachedResponse);
    return res.json(cachedResponse);
  } else {
    console.log("Запрос не был кеширован");
    const originalJson = res.json;
    (res.json as any)  = (body:any) => {
      cacheGetCurrecncies.set(key, body);
      originalJson.call(res, body);
    };
    next();
  }
};
