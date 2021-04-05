const fetch = require('node-fetch');
const tape = require('tape');

const { userProfile, userFeed } = require('./api');

if (!globalThis.fetch) {
  globalThis.fetch = fetch;
}
(async () => {
  const userName = 'tiktok';

  tape.test('Should fetch a valid user', async (t) => {
    const user = await userProfile(userName);
    t.equal(user.uniqueId, userName, `Unique id should be ${userName}`);
    t.end();
  });
  tape.test('Should fetch a video feed', async (t) => {
    const feedSize = 10;

    const user = await userProfile(userName);
    t.equal(user.uniqueId, userName, `Unique id should be ${userName}`);
    const videos = await userFeed(user, feedSize, 0);
    t.equal(
      videos.length,
      feedSize,
      `Size of video array should be ${feedSize}`,
    );
    t.end();
  });
})();
