var fs         = require('fs'); // node file I/O
var path       = require('path'); // handles/transforms file paths
var bodyParser = require('body-parser'); // node body-parsing middleware
var express    = require('express'); // web framework
var app        = express();

var COMMENTS_FILE = path.join(__dirname, 'comments.json'); //faking DB w/ static file

app.set('port', (process.env.PORT || 3000));

//**** Middleware ****//
app.use('/', express.static(path.join(__dirname, 'public'))); // express midleware to serve static files
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true})); // allows parsing of urlencoded

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*'); // allow CORS

  res.setHeader('Cache-Control', 'no-cache'); // disable caching
  next();
});

//**** Routes ****//
app.get('/api/comments', function(req, res) {
  fs.readFile(COMMENTS_FILE, function(err, data) {
    if (err) {
      console.error(err);
      process.exit(1); //end process w/ failure code 1
    }
    res.json(JSON.parse(data));
  });
});

app.post('/api/comments', function(req,res) {
  fs.readFile(COMMENTS_FILE, function(err,data) {
    if (err) {
      console.log(err);
      process.exit(1);
    }
    var comments = JSON.parse(data);

    //faking DB w/ static file
    var newComment = {
      id: Date.now(),
      author: req.body.author,
      text: req.body.text,
    };
    comments.push(newComment);

    fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 4), function(err) {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      res.json(comments);
    });
  });
});

//**** Express HTTP server ****//
app.listen(app.get('port'), function() {
  console.log('Server started: 127.0.0.1:' + app.get('port') + '/');
});
