const express = require('express');
const app = express();
const axios = require('axios');

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get('/proxy', (req, res) => {
  const url = req.query.url;
  axios.get(url)
    .then(response => {
      res.send(response.data);
    })
    .catch(error => {
      console.log(error);
      res.status(500).send('Error');
    });
});

app.listen(3000, () => {
  console.log('Proxy server listening on port 3000');
});