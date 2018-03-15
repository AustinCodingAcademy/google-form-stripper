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
    $('input').each(function() {
      inputs.push(this);
    });
    $('form').html('');
    $('form').removeAttr('id');
    for (var i = 0; i < inputs.length; i++) {
      if ($(inputs[i].attr('type') !== 'hidden') {
          const id = inputs[i].attr('aria-label').toLowerCase().split(' ').join('-');
          $('form').append(`<label for="${id}">${inputs[i].attr('aria-label')}</label>`);
          $(inputs[i]).attr('id', id);
      }
      _.keys(_.omit($(inputs[i]).attribs, ['type', 'name', 'value', 'id'])).forEach(key => {
        $(inputs[i]).removeAttr(key);
      })
      $('form').append(inputs[i]);
    }
    $('form').append('<input type="submit" />');
    res.json({ html: html.prettyPrint($.html('form'), {indent_size: 2}) });
  });
});

module.exports = router;
