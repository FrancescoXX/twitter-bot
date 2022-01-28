const twit = require("twit");
require('dotenv').config();

const T = new twit({
	consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

console.log(process.env);

function retweet(search) {
  T.get(
    "search/tweets",
    {
      q: search,
      result_type: "mixed",
      count: 1,
    },
    (err, data, response) => {
      if (err) {
        console.error("An error occured while searching");
        console.error(err);
        process.exit(1);
        return;
      }

      const tweets = data.statuses;
      const tweetIDs = tweets.map((tweet) => {
        if (tweet.text.startsWith("RT @")) {
          if (tweet.retweeted_status) return tweet.retweeted_status.id_str;
          else return tweet.id_str;
        } else return tweet.id_str;
      });

      for (let id of tweetIDs) {
        T.post("statuses/retweet/:id", { id }, (err, data, response) => {
          if (err) {
            console.error("An error occured while retweeting");
            console.error("Prob a duplicate");
            console.error(err);
          } else {
            console.log("Retweeted tweet with ID " + id + ", yeye!");
          }
        });
      }
    }
  );
}

setInterval(() => retweet("#portainer2"), 10000);