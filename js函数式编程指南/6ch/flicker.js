requirejs.config({
  paths: {
    ramda: 'https://cdnjs.cloudflare.com/ajax/libs/ramda/0.13.0/ramda.min',
    jquery: 'https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min'
  }
});

require([
    'ramda',
    'jquery'
  ],
  function (_, $) {
    ////////////////////////////////////////////
    // Utils

    var Impure = {
      getJSON: _.curry(function(callback, url) {
        $.getJSON(url, callback);
      }),

      setHtml: _.curry(function(sel, html) {
        $(sel).html(html);
      })
    };

    var img = function (url) {
      return $('<img />', { src: url });
    };

    var trace = _.curry(function(tag, x) {
      console.log(tag, x);
      return x;
    });

    ////////////////////////////////////////////

    var url = function (t) {
      return 'https://api.flickr.com/services/feeds/photos_public.gne?tags=' + t + '&format=json&jsoncallback=?';
    };
  // "items":[{
	// 		"title": "Caption: Half cat half rug! Credit: Stephdawson",
	// 		"link": "https:\/\/www.flickr.com\/photos\/146320613@N07\/32373454814\/",
	// 		"media": {"m":"https:\/\/farm4.staticflickr.com\/3719\/32373454814_a759bf3e4c_m.jpg"},
	// 		"date_taken": "2017-03-02T17:57:16-08:00",
	// 		"description": " <p><a href=\"https:\/\/www.flickr.com\/people\/146320613@N07\/\">denisewestgarth<\/a> posted a photo:<\/p> <p><a href=\"https:\/\/www.flickr.com\/photos\/146320613@N07\/32373454814\/\" title=\"Caption: Half cat half rug! Credit: Stephdawson\"><img src=\"https:\/\/farm4.staticflickr.com\/3719\/32373454814_a759bf3e4c_m.jpg\" width=\"240\" height=\"180\" alt=\"Caption: Half cat half rug! Credit: Stephdawson\" \/><\/a><\/p> <p>via <a href=\"http:\/\/ift.tt\/2lFlWQO\" rel=\"nofollow\">ift.tt\/2lFlWQO<\/a><\/p>",
	// 		"published": "2017-03-03T01:57:16Z",
	// 		"author": "nobody@flickr.com (\"denisewestgarth\")",
	// 		"author_id": "146320613@N07",
	// 		"tags": "cat cats kitty awww pussy kat feline lol funny humour humor bellies belly"
	//    },
	//    {
	// 		"title": "Cat A-Frame Houses",
	// 		"link": "https:\/\/www.flickr.com\/photos\/124651729@N04\/33060767112\/",
	// 		"media": {"m":"https:\/\/farm1.staticflickr.com\/648\/33060767112_01ff826323_m.jpg"},
	// 		"date_taken": "2017-01-06T11:22:06-08:00",
	// 		"description": " <p><a href=\"https:\/\/www.flickr.com\/people\/124651729@N04\/\">Stabbur's Master<\/a> posted a photo:<\/p> <p><a href=\"https:\/\/www.flickr.com\/photos\/124651729@N04\/33060767112\/\" title=\"Cat A-Frame Houses\"><img src=\"https:\/\/farm1.staticflickr.com\/648\/33060767112_01ff826323_m.jpg\" width=\"240\" height=\"180\" alt=\"Cat A-Frame Houses\" \/><\/a><\/p> <p>It gets cold here in Virginia, so my wife, Judy, got the feral cats that live on our deck A-frames to keep warm in the winter. There is a mat inside that heats when they lay on it. They took to them pretty fast.<br \/> <br \/> In the photo Boomer, on the left, and Sooner, on the right, are looking out through the clear plastic flaps.<br \/> <br \/> Boomer is really spoiled!! As you can see, I put the food right up against the flap, that way he can stay inside and just stick his head out to eat.<br \/> <br \/> Unfortunately, as you can see by the feathers, Taffy, a female feral cat, brought us a dead bird as a thank you present.<\/p>",
	// 		"published": "2017-03-03T01:52:43Z",
	// 		"author": "nobody@flickr.com (\"Stabbur\'s Master\")",
	// 		"author_id": "124651729@N04",
	// 		"tags": "kitty kitten kitties cats kittyaframe cathouse kittyhouse catinhouse catinaframe"
  //   }]
    var mediaUrl = _.compose(_.prop('m'), _.prop('media'));
    // var images = _.compose(_.map(img), _.map(mediaUrl));
    var images = _.compose(_.map(_.compose(img, mediaUrl)), _.prop('items'));
    var renderImages = _.compose(Impure.setHtml("body"), images);
    var app = _.compose(Impure.getJSON(renderImages), url);
    app("cats");

    // var mediaUrl = _.compose(_.prop('m'), _.prop('media'));
    //
    // var srcs = _.compose(_.compose(_.map(mediaUrl)), _.prop('items'));
    //
    // var images = _.compose(_.map(img), srcs);
    //
    // var renderImages = _.compose(Impure.setHtml("body"), images);
    //
    // var app = _.compose(Impure.getJSON(renderImages), url);
    //
    // app("cats");
  });
