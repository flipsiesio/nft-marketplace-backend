
import * as express from 'express';

const app = express();

app.use(express.static('public'));

app.use((req, res) => {
  res.status(404).send('Not found');
});

app.listen(5000, function () {
  console.log('Server started on port 5000');
});
