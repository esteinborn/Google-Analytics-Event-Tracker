/*
 * GoogleAnalyticsEventTracker
 * https://github.com/esteinborn/Google-Analytics-Event-Tracker
 *
 * Copyright (c) 2012 Eric Steinborn
 * Licensed under the MIT license.
 */

(function($) {

  // Collection method. is new
  $.fn.awesome = function() {
    return this.each(function() {
      $(this).html('awesome');
    });
  };

  // Static method.
  $.awesome = function() {
    return 'awesome';
  };

  // Custom selector.
  $.expr[':'].awesome = function(elem) {
    return elem.textContent.indexOf('awesome') >= 0;
  };

}(jQuery));
