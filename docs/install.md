# Config and setup
Config is all done though environment variables.

| Name | Desciption | Default |
|------|------------|---------|
| BOT_USER_AGENT | Set to change part of the user agent for the Reddit API `node:YourRedditAccountNameHere:v1.0.0` | defauts to the Reddit account name |
| BOT_POLLING_TIME | Delay to check for videos again, or set to 0 to not check again, in miliseconds | 60000 |
| BOT_YOUTUBE_CHANNEL | The channel name to look at | YouTubeDev |
| BOT_YOUTUBE_API_KEY | your API key for accessing the YouTube API, find out how to get one [here](google.md) | No default, set it or I don't start! |
| BOT_YOUTUBE_LIMIT_RESULTS | Limit how many results you get from YT | 5 |
| BOT_REDDIT_USERNAME | The Reddit account name | No default |
| BOT_REDDIT_PASSWORD | Reddit account password | No default |
| BOT_REDDIT_SUBREDDIT | Subreddit to post to | BotTest |
| BOT_REDDIT_LIMIT_RESULTS | Limit how many results from Reddit | 50 |
| BOT_REDDIT_OAUTH_KEY | Reddit Script oAuth key, find out how to get one [here](reddit.md) | No default |
| BOT_REDDIT_OAUTH_SECRET | Reddit Script oAuth secret | No default |

To run on a normal machine, first install [Node.js](https://nodejs.org/), then just type in a command window `npm install` in this directory to install dependences then `npm start` with the required environment variables set.

For [Heroku](https://heroku.com), just push this repo onto a Heroku app and set config variables as needed. Heroku will deal with dependencies and config changes automatically.
