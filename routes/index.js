var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var html = require('html');
var _ = require('underscore');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

/* POST form. */
router.post('/', function(req, res, next) {
  request.get(req.body.form_url, function(err, response, body) {
    $ = cheerio.load(body);
    console.log($.html());
    var inputs = [];
    $('input,select,textarea,label').each(function() {
      inputs.push(this);
    });
    $('form').html('');
    $('form').removeAttr('id');
    for (var i = 0; i < inputs.length; i++) {
      if ($(inputs[i]).find('div,span').length > 0) {
        var texts = [];
        $(inputs[i]).find('div,span').each(function() {
          texts.push($(this).text())
        });
        $(inputs[i]).text(texts.join(' '));
      }

      $(inputs[i]).removeAttr('class');
      $(inputs[i]).removeAttr('id');
      $('form').append(inputs[i]);
    }
    $('form').append('<input type="submit" />');
    res.json({ html: html.prettyPrint($.html('form'), {indent_size: 2}) });
  });
});

module.exports = router;
