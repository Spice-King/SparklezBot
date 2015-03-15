var debug = require('debug');
log = debug('bot'),
logPoll = debug('bot:poll'),
logYoutube = debug('bot:youtube'),
logReddit = debug('bot:reddit'),
logYoutubeSetup = debug('bot:youtube:setup'),
logRedditSetup = debug('bot:reddit:setup'),
logYoutubePoll = debug('bot:youtube:poll'),
logRedditPoll = debug('bot:reddit:poll'),
logRedditPost = debug('bot:reddit:post');
log('Starting requires');
var config = require('./config');
var Snoocore = require('snoocore');
var gapi = require('googleapis');
var youtube = gapi.youtube('v3');
var async = require('async');
var moment = require('moment');
// var util = require('util');
log('Finished');

var reddit = new Snoocore({
  userAgent: config.userAgent,
  login: {username: config.reddit.username, password: config.reddit.password},
  oauth: {
    type: 'script',
    duration: "permanent",
    consumerKey: config.reddit.oauth.consumerKey,
    consumerSecret: config.reddit.oauth.consumerSecret,
    scope: config.reddit.scope
  }
});

function setupReddit(cb) {
  logRedditSetup("Started to set up Reddit");
  reddit.auth().then(function() {
    return reddit('/api/needs_captcha.json').get();
 }, function(error){
    logRedditSetup("Erred in setting up Reddit: Auth: " + error)
    if (cb) {
      cb(error);
    }
    return null;
 }).then(function(needs_captcha){
    if (!cb) {
      logRedditSetup("No call back, got " + needs_captcha + ' for testing.');
      return;
    }
    if (needs_captcha) {
      cb("Error: I've been hit with captchas!!!!");
      return;
    }
    logRedditSetup("Finished setting up Reddit.")
    cb(null, !needs_captcha);
    // find where to pin the after mark here.
    // redditHoneInOnTime(null, null, cb);
    // reddit('/r/' + config.reddit.subreddit + '/top').get({count: 5, t: 'hour'}).then(function(data){
    //   cb(null, JSON.stringify(data));
    // }, cb);
  }, function(error) {
    logRedditSetup("Erred in setting up Reddit: Checking captchas: " + error)
    if (cb) {
      cb(error);
    }
  })
};

var redditTokenInterval = setInterval(setupReddit, 55 * 60 * 1000);

// function redditHoneInOnTime(after, before, cb) {
//   opts = {}
//   if (typeof after == 'string') {
//     opts.after = after;
//   }
//   if (typeof before == 'string') {
//     opts.before = before;
//   }
//   reddit('/r/' + config.reddit.subreddit + '/top').get({count: 2, t: 'week'}).then(function(data){
//     // console.log(util.inspect(data.data.children[0].data));
//     cb(null,data);
//   }, function(error) {
//     cb(error);
//   })
// }

function setupYoutube(cb) {
  logYoutubeSetup('Started to set up YouTube')
  gapi.options({auth: config.youtube.apiKey})
  youtube.channels.list({part: 'contentDetails', forUsername: config.youtube.channel}, function getChannelDetails (err, response) {
    if (err) {
      cb("YouTube Error: " + err);
      return;
    }
    if (response.pageInfo.totalResults != 1) {
      logYoutubeSetup(response);
      cb("Well poop. Got " + response.pageInfo.totalResults + " channels some how, expected 1.");
      return;
    }
    var res = response.items[0].contentDetails.relatedPlaylists.uploads;
    logYoutubeSetup("Finished setting up Youtube.")
    cb(null, res);
  });
};

function pollYouTube(cb) {
  logYoutubePoll("Started polling YouTube");
  youtube.playlistItems.list({part: 'contentDetails', playlistId: uploadedPlaylist, maxResults: config.youtube.limitResults}, function (err, results) {
    if (err) {
      logYoutubePoll("YouTube polling failed at fetching play list items")
      cb("YouTube Error: " + err);
      return;
    }
    var data = results.items.map(function(item){
      return item.contentDetails.videoId;
    })
    youtube.videos.list({part: 'snippet,contentDetails', fields: "items(contentDetails,id,snippet)", id: data.join(',')}, function(err, results) {
      if (err) {
        logYoutubePoll("YouTube polling failed at getting content Details")
        cb(err);
        return;
      }
      var time = moment().subtract(1, 'hour').add(5, 'minutes');
      logYoutubePoll(time);
      var finalResults = results.items.filter(function(item){
        logYoutubePoll(item.snippet.title + " " + item.snippet.publishedAt + " " + moment(item.snippet.publishedAt).from(time));
        return time.isBefore(item.snippet.publishedAt);
      }).map(function(item){
        logYoutubePoll(item.snippet.title + " - [" + formatTime(item.contentDetails.duration) + "]");
        return {
          length: item.contentDetails.duration,
          title: item.snippet.title,
          id: item.id,
          publishedAt: item.snippet.publishedAt
        }
      })
      logYoutubePoll("Finished polling YouTube")
      cb(err, finalResults);
    })
  })
}
// TODO: make sure that I do get every thing in the past hour.
function pollReddit(cb) {
  logRedditPoll("Started polling Reddit.");
  // cb(null,"Poll Reddit is unfinished!");
  // return null;
  reddit('/r/' + config.reddit.subreddit + '/new').get({limit: config.reddit.limitResults, /*count: 1,*/ t: 'hour'}).then(function(data){
    // logRedditPoll(data.data);
    var results = data.data.children.map(function (item) {
      return item.data
    }).filter(function(item){
      // logRedditPoll(item.title + " - " + moment.unix(item.created_utc).fromNow() + ' - ' + item.name);
      // logRedditPoll(item)
      return item.domain.match(/youtu(be\.(com|ca)|\.be)/)
    }).map(function (item){
      return item.url.match(/^https?:\/\/(?:www.)?youtu(?:be.(?:(?:com|ca)\/watch\?v=)|\.be\/)(.+)$/im)[1];
    })
    logRedditPoll("Finished polling Reddit");
    cb(null, results);
  }, function(error) {
    logRedditPoll("Reddit Polling failed!")
    cb(error);
  })
}

function formatTime(time) {
  var values = time.match(/PT(?:([0-9]{1,2})H)?(?:([0-9]{1,2})M)?(?:([0-9]{1,2})S)?/)
  var minutes = 60 * (parseInt(values[1]) || 0) + (parseInt(values[2]) || 0);
  var seconds = lpad(values[3] || 0, 2);
  return minutes + ":" + seconds;
}
function lpad(value, padding) {
    var zeroes = "0";
    for (var i = 0; i < padding; i++) { zeroes += "0"; }
    return (zeroes + value).slice(padding * -1);
}

function pollingLoop () {
  cleanupTimeout();
  logPoll("Polling! Blame Google!");
  async.parallel([pollYouTube, pollReddit], function pollCallback(err, results) {
    if (err) {
      logPoll(err);
      shutdownLoop();
      return;
    }
    // logPoll("Work on stuff here.", JSON.stringify( results ) );
    var videosToPost = results[0].filter(function(item){
      return -1 == results[1].indexOf(item.id);
    })
    // logPoll("Videos to post: ", videosToPost);
    async.each(videosToPost, postVideoToReddit, function(err){
      if (err) {
        logPoll(err);
      } else {
        var titles = videosToPost.map(function(item){return item.title + " - [" + formatTime(item.length) + "] {http://youtube.com/watch?v=" + item.id + "}"}).join(", ");
        logPoll("Posted " + videosToPost.length + " video(s) to Reddit! Titles were: " + titles);
      }
    })
    setupTimeout();
  });
}

function postVideoToReddit(item, cb) {
  // logRedditPost("Still can't post, but hey.");
  // cb("Can't post videos yet!");
  // cb();
  // return;
  reddit('/api/submit').post({
    kind: "link",
    sendReploes: false,
    sr: config.reddit.subreddit,
    url: "https://youtube.com/watch?v=" + item.id,
    title: item.title + " - [" + formatTime(item.length) + ']'
  }).then(function(result){
    logRedditPost(result);
    cb();
  }, function(error){
    logRedditPost("Got Error!")
    logRedditPost(error)
    cb(error)
  })
}

function postSetup (err, results) {
  if (err) {
    log(err);
    shutdownLoop();
    return;
  }
  log(results);
  uploadedPlaylist = results[0];
  pollingLoop();
};

var timeout = null;
var uploadedPlaylist = null;
var shutdown = false;

function setupTimeout() {
  if (timeout != null) {
    log("Something has gone wrong!");
  } else if (shutdown === false) {
    timeout = setTimeout(pollingLoop, config.pollingTime);
  }
};

function cleanupTimeout() {
  if (timeout != null) {
    clearTimeout(timeout);
    timeout = null;
    log("Cleaned up!");
  }
};

function shutdownLoop() {
  shutdown = true;
  clearInterval(redditTokenInterval);
  cleanupTimeout();
};

process.on('SIGTERM', shutdownLoop);
process.on('SIGINT', shutdownLoop);

async.parallel([setupYoutube, setupReddit], postSetup);
module.export = {
  formatTime: formatTime,
  setupTimeout: setupTimeout,
  cleanupTimeout: cleanupTimeout
}
