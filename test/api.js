const { stringify } = require('querystring');

const userAgent = () => {
  const os = [
    'Macintosh; Intel Mac OS X 10_15_7',
    'Macintosh; Intel Mac OS X 10_15_5',
    'Macintosh; Intel Mac OS X 10_11_6',
    'Macintosh; Intel Mac OS X 10_6_6',
    'Macintosh; Intel Mac OS X 10_9_5',
    'Macintosh; Intel Mac OS X 10_10_5',
    'Macintosh; Intel Mac OS X 10_7_5',
    'Macintosh; Intel Mac OS X 10_11_3',
    'Macintosh; Intel Mac OS X 10_10_3',
    'Macintosh; Intel Mac OS X 10_6_8',
    'Macintosh; Intel Mac OS X 10_10_2',
    'Macintosh; Intel Mac OS X 10_10_3',
    'Macintosh; Intel Mac OS X 10_11_5',
    'Windows NT 10.0; Win64; x64',
    'Windows NT 10.0; WOW64',
    'Windows NT 10.0',
  ];

  return `Mozilla/5.0 (${
    os[Math.floor(Math.random() * os.length)]
  }) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${
    Math.floor(Math.random() * 3) + 87
  }.0.${Math.floor(Math.random() * 190) + 4100}.${
    Math.floor(Math.random() * 50) + 140
  } Safari/537.36`;
};

const makeid = (len) => {
  let text = '';
  const charList = '0123456789';
  for (let i = 0; i < len; i += 1) {
    text += charList.charAt(Math.floor(Math.random() * charList.length));
  }
  return text;
};

const feedUrl = 'https://m.tiktok.com/api/post/item_list/?';
const profileUrl = 'https://www.tiktok.com/@';

function transformItem (item) {
  const video = {
    id: 0,
    video: '',
    poster: {
      uri: '',
    },
    user: {
      username: '',
      description: '',
      music: { uri: '' },
      avatar: {
        uri: '',
      },
    },
    count: {
      like: '',
      comment: '',
      share: '',
    },
    musicThumb: { uri: '' },
    date: item.createTime,
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
    const res = await fetch(`${profileUrl}${user}`, {
      headers: {
        'user-agent': userAgent(),
        cookie: `tt_webid_v2=68${makeid(16)}`,
        referer: 'https://tiktok.com',
      },
    });
    const userHtml = await res.text();
    const breakResponse = userHtml
      .split(
        /<script id="__NEXT_DATA__" type="application\/json" nonce="[\w-]+" crossorigin="anonymous">/,
      )[1]
      .split('</script>')[0];
    if (!breakResponse) {
      return {};
    }
    const userMetadata = JSON.parse(breakResponse);
    return userMetadata.props.pageProps.userInfo.user;
  },
  userFeed: async (user = {}, count = 5, tries = 0) => {
    const randmUserAgent = userAgent();
    const id = user.id;
    const secUid = user.secUid;
    const params = stringify({ secUid, id, count });
    const url = `${feedUrl}sourceType=8&cursor=0&lang=&verifyFp=&aid=1988&${params}`;
    try {
      const res = await fetch(url, {
        headers: {
          'user-agent': randmUserAgent,
        },
      });
      const { itemList } = await res.json();
      if (itemList == null) {
        console.log('Failed to fetch data with user-agent:', randmUserAgent);
        if (tries > 4) {
          console.error('Max attempts to fetch video feed, bailing');
          return [];
        }
        return api.userFeed(user, count, tries + 1);
      }
      return itemList.map(transformItem);
    } catch (e) {
      console.log(e);
      return [];
    }
  },
};
module.exports = api;
