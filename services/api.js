
import sign from './signature';
import { stringify } from 'query-string';

const userAgentList = [
  'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:83.0) Gecko/20100101 Firefox/83.0',
  'Mozilla/5.0 (Linux; Android 8.0.0; SM-G960F Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.84 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; Android 7.0; SM-G892A Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/60.0.3112.107 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; Android 7.0; SM-G930VC Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/58.0.3029.83 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; Android 6.0.1; SM-G935S Build/MMB29K; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/55.0.2883.91 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; Android 6.0.1; SM-G920V Build/MMB29K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.98 Mobile Safari/537.36',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/69.0.3497.105 Mobile/15E148 Safari/605.1',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/13.2b11866 Mobile/16A366 Safari/605.1.15',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
  'Mozilla/5.0 (Linux; Android 7.0; Pixel C Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/52.0.2743.98 Safari/537.36'
];
const feedUrl = 'https://m.tiktok.com/api/item_list/?';
const profileUrl = 'https://m.tiktok.com/node/share/user/';

function transformItem (item) {
  const video = {
    id: 0,
    video: '',
    poster: {
      uri: ''
    },
    user: {
      username: '',
      description: '',
      music: { uri: '' },
      avatar: {
        uri: ''
      }
    },
    count: {
      like: '',
      comment: '',
      share: ''
    },
    musicThumb: { uri: '' },
    date: item.createTime
  };
  video.video = item.video.downloadAddr;
  video.id = item.id;
  video.poster.uri = item.video.cover;
  video.user.username = item.author.uniqueId;
  video.user.avatar.uri = item.author.avatarThumb;
  video.user.description = item.desc;
  video.user.avatar.uri = item.author.avatarThumb;
  video.user.music = `${item.music.authorName} - ${item.music.title}`;
  video.musicThumb.uri = item.music.coverThumb;
  return video;
}

const api = {
  userProfile: async (user = '') => {
    const res = await fetch(`${profileUrl}@${user}`, {
      headers: {
        'user-agent': userAgentList[Math.floor(Math.random() * userAgentList.length)]
      }
    });
    const { userInfo: { user: userData } } = await res.json();
    return userData;
  },
  userFeed: async (user = {}, count = 30, tries = 0) => {
    const userAgent = userAgentList[Math.floor(Math.random() * userAgentList.length)];
    const id = user.id;
    const secUid = user.secUid;
    const params = stringify({ secUid, id, count });
    const url = `${feedUrl}sourceType=8&minCursor=0&maxCursor=0&lang=&verifyFp=&${params}`;
    const signature = sign(userAgent, url);
    const signedUrl = `${url}&_signature=${signature}`;
    try {
      const res = await fetch(signedUrl, {
        headers: {
          'user-agent': userAgent
        }
      });
      const { items } = await res.json();
      if (items == null) {
        console.log('Failed to fetch data with user-agent:', userAgent);
        if (tries > 4) {
          console.error('Max attempts to fetch video feed, bailing');
          return [];
        }
        return api.userFeed(user, count, tries + 1);
      }
      return items.map(transformItem);
    } catch (e) {
      console.log(e);
      return [];
    }
  }
};
export default api;
