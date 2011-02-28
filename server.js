var express = require('express');
var app = express.createServer();

app.configure(function(){
    app.use(express.methodOverride());
    app.use(express.bodyDecoder());
    app.use(app.router);
    app.use(express.staticProvider('/public'));
});


app.get('/', function(req, res){
    res.sendfile('flip.html');
});


app.get('/public/(*.(js|css|png|jpg))', function(req, res){
		res.sendfile(__dirname + '/public/' + req.params[0] + '.' + req.params[1]);
});

app.listen(3000);
