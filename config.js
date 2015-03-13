var package = require('./package');
module.exports = {
  userAgent: process.title + ":" + package.name + ":v" + package.version,
  pollingTime: parseInt(process.env.BOT_POLLING_TIME || 1000),
  youtube: {
    channel: process.env.BOT_YOUTUBE_CHANNEL || "YouTubeDev",
    apiKey: process.env.BOT_YOUTUBE_API_KEY || function (){throw "Get you YouTube API key into BOT_YOUTUBE_API_KEY"}(),
    limitResults: parseInt(process.env.BOT_YOUTUBE_LIMIT_RESULTS || 5)
  },
  reddit: {
    username: process.env.BOT_REDDIT_USERNAME || function(){throw "Get your Reddit account name into BOT_REDDIT_USERNAME"}(),
    password: process.env.BOT_REDDIT_PASSWORD || function(){throw "Get your Reddit account passwork into BOT_REDDIT_PASSWORD"}(),
    subreddit: process.env.BOT_REDDIT_SUBREDDIT || "BotTest",
    limitResults: parseInt(process.env.BOT_REDDIT_LIMIT_RESULTS || 5),
    scope: ['read', 'submit'],
    oauth: {
      consumerKey: process.env.BOT_REDDIT_OAUTH_KEY || function(){throw "Get your Reddit oAuth2 Key into BOT_REDDIT_OAUTH_KEY"}(),
      consumerSecret: process.env.BOT_REDDIT_OAUTH_SECRET || function(){throw "get your Reddit oAuth2 Secret into BOT_REDDIT_OAUTH_SECRET"}()
    }
  }
}
// old scope: ['identity', 'edit', 'flair', 'history', 'modconfig', 'modflair', 'modlog', 'modposts', 'modwiki', 'mysubreddits', 'privatemessages', 'read', 'report', 'save', 'submit', 'subscribe', 'vote', 'wikiedit', 'wikiread']
