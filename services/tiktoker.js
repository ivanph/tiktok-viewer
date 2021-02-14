const sign = require('./signature');
const url = 'https://m.tiktok.com/api/item_list/?secUid=&id=249022053511487488&sourceType=8&count=2&minCursor=0&maxCursor=0&lang=&verifyFp='
const userAgent = 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:82.0) Gecko/20100101 Firefox/82.0';
const signature = sign(userAgent, url);
console.log(`${url}&_signature=${signature}`);
