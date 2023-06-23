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

  const response = addUser(username, avatar);

  res.status(201).send(response);
});

app.post('/tweets', (req, res) => {
  const { username, tweet } = req.body;

  if (!username || !users.includes(username)) {
    return res.status(401).send('UNAUTHORIZED');
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

app.listen(5000, () => {
  console.log('Servidor rodando na porta 5000');
  ('Online');
});
