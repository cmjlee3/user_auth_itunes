const fetch = require('node-fetch');

const API_URL = 'https://itunes.apple.com/search?';

function searchMusic(req, res, next) {
  fetch(`${API_URL}term=${req.body.searchTerm}&entity=album&medium=music`)
  .then(r => r.json())
  .then((albums) => {
    res.results = albums.results;
    next();
  })
  .catch((err) => {
    res.error = err;
    next();
  });
}

module.exports = { searchMusic }
