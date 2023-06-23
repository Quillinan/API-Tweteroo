const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

let users = [];
let tweets = [];

function addUser(username, avatar) {
  const newUser = {
    username,
    avatar,
  };

  users.push(newUser);
  return 'OK';
}

app.post('/sign-up', (req, res) => {
  const { username, avatar } = req.body;

  if (
    !username ||
    !avatar ||
    typeof username !== 'string' ||
    typeof avatar !== 'string'
  ) {
    return res.status(400).send('Bad Request');
  }

  const response = addUser(username, avatar);

  res.status(201).send(response);
});

app.post('/tweets', (req, res) => {
  let { username, tweet } = req.body;

  if (!username) {
    username = decodeURIComponent(req.headers.user);
  }

  if (!username) {
    return res.status(401).send('UNAUTHORIZED');
  }

  const userExists = users.some((user) => user.username === username);

  if (!userExists) {
    return res.status(401).send('UNAUTHORIZED');
  }

  if (!tweet || typeof tweet !== 'string') {
    return res.status(400).send('Bad Request');
  }

  const newTweet = {
    username,
    tweet,
  };

  tweets.push(newTweet);

  res.status(201).send('OK');
});

app.get('/tweets', (_, res) => {
  const formattedTweets = [];

  if (tweets.length === 0) {
    return res.json(formattedTweets);
  }

  const lastTweets = tweets.slice(-10);

  lastTweets.forEach(({ username, tweet }) => {
    const user = users.find((user) => user.username === username);
    const formattedTweet = {
      username,
      avatar: user ? user.avatar : null,
      tweet,
    };
    formattedTweets.push(formattedTweet);
  });

  res.json(formattedTweets);
});

app.get('/tweets/:username', (req, res) => {
  const { username } = req.params;
  const userTweets = tweets.filter((tweet) => tweet.username === username);

  const formattedTweets = userTweets.map(({ username, tweet }) => {
    const user = users.find((user) => user.username === username);
    return {
      username,
      avatar: user ? user.avatar : null,
      tweet,
    };
  });

  res.status(200).json(formattedTweets);
});

app.get('/users', (_, res) => {
  res.status(200).json(users);
});

app.listen(5000, () => {
  console.log('Servidor rodando na porta 5000');
  ('Online');
});
