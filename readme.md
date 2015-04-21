# SparklezBot

A Reddit bot built for posting CaptainSparklez YouTube videos to /r/CaptainSparklez.

## Config and setup
Config is all done though environment variables.

| Name | Desciption | Default |
|------|------------|---------|
| BOT_USER_AGENT | Set to change part of the user agent for the Reddit API `node:YourRedditAccountNameHere:v1.0.0` | defauts to the Reddit account name |
| BOT_POLLING_TIME | Delay to check for videos again, in miliseconds | 60000 |
| BOT_YOUTUBE_CHANNEL | The channel name to look at | YouTubeDev |
| BOT_YOUTUBE_API_KEY | your API key for accessing the YouTube API, get one [here](https://developers.google.com/) | No default, set it or I don't start! |
| BOT_YOUTUBE_LIMIT_RESULTS | Limit how many results you get from YT | 5 |
| BOT_REDDIT_USERNAME | The Reddit account name | No default |
| BOT_REDDIT_PASSWORD | Reddit account password | No default |
| BOT_REDDIT_SUBREDDIT | Subreddit to post to | BotTest |
| BOT_REDDIT_LIMIT_RESULTS | Limit how many results from Reddit | 50 |
| BOT_REDDIT_OAUTH_KEY | Reddit Script oAuth key, get one [here](https://www.reddit.com/prefs/apps/) | No default |
| BOT_REDDIT_OAUTH_SECRET | Reddit Script oAuth secret | No default |
