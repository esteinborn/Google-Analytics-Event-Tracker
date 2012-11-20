/*! Google Analytics Event Tracker jQuery Plugin - v0.1.0 - 2012-11-20
* https://github.com/esteinborn/Google-Analytics-Event-Tracker
* Copyright (c) 2012 Eric Steinborn; Licensed MIT */

// the semi-colon before the function invocation is a safety 
// net against concatenated scripts and/or other plugins 
// that are not closed properly.
;(function ( $, window, document, undefined ) {
    
    // undefined is used here as the undefined global 
    // variable in ECMAScript 3 and is mutable (i.e. it can 
    // be changed by someone else). undefined isn't really 
    // being passed in so we can ensure that its value is 
    // truly undefined. In ES5, undefined can no longer be 
    // modified.
    
    // window and document are passed through as local 
    // variables rather than as globals, because this (slightly) 
    // quickens the resolution process and can be more 
    // efficiently minified (especially when both are 
    // regularly referenced in our plugin).

    // Create the defaults once
    var pluginName = "defaultPluginName",
        defaults = {
            propertyName: "value"
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;

        // jQuery has an extend method that merges the 
        // contents of two or more objects, storing the 
        // result in the first object. The first object 
        // is generally empty because we don't want to alter 
        // the default options for future instances of the plugin
        this.options = $.extend( {}, defaults, options) ;
        
        this._defaults = defaults;
        this._name = pluginName;
        
        this.init();
    }

    Plugin.prototype.init = function () {
        // Place initialization logic here
        // We already have access to the DOM element and
        // the options via the instance, e.g. this.element 
        // and this.options
    };

    // A really lightweight plugin wrapper around the constructor, 
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if ( !$.data(this, "plugin_" + pluginName )) {
                $.data( this, "plugin_" + pluginName, 
                new Plugin( this, options ));
            }
        });
    };
// Event Tracker Instructions *******************/
// add to link: <a class="gaEventTracker" data-ga='{"evtCategory": "Category", "evtAction": "Event Type", "evtLabel": "Event Name"}'>
// Example:     <a class="gaEventTracker" data-ga='{"evtCategory": "Videos", "evtAction": "Press", "evtLabel": "Child Sexual Predators HQ"}'>
// Allows you to leave out an option if you dont want one. You WILL need to provide at least the evtCategory For proper google tracking
 
$.fn.gaEventTracker = function(options) {
 
                return this.each(function(){
 
                                var $this = $(this),
                                                opts,
                                                defaults = {
                                                                evtCategory: "Category Not Defined",
                                                                evtAction: "",
                                                                evtLabel: ""
                                                };
 
                                if ($this.data("ga")) {
                                               
                                                var ga = $this.data("ga");
                                               
                                                defaults = {
                                                                evtCategory: ga.evtCategory || "Category Not Defined",
                                                                evtAction: ga.evtAction || "",
                                                                evtLabel: ga.evtLabel || ""
                                                };
 
                                }
 
                                opts = $.extend({}, defaults, options);
                                $this.attr('onClick', "_gaq.push(['_trackEvent', '" + opts.evtCategory + "', '" + opts.evtAction + "', '" + opts.evtLabel + "']);");
                });
};
//$("#mainContent a.gaEventTracker").gaEventTracker();
 
//$("#mainContent a[href$='.pdf'], #mainContent a[href$='.doc'], #mainContent a[href$='.docx'], #mainContent a[href$='.ppt'], #mainContent a[href$='.pptx'], #mainContent a[href$='.xls'], #mainContent a[href$='.xlsx']").each(gaDocumentTrack);
 
 
/*****************************
** gaDocumentTrack Overview
**
** Checks to make sure there isn't a gaEventTracker Init'd yet, and then checks HREF value of the link
** and compares it to the window.location.pathname and inserts appropriate directory names into the google event tracker.
** Full support for External Documents categorized as: "External Document"
**
** Eric Steinborn 4/2011
*******************************/
 
function gaDocumentTrack() {
               
                var $this = $(this);
 
                if (!$this.data("ga")) {  // Only run if no data-ga has been declared previously, you dont want to overwrite the specific stuff.
                               
                                var          category = "Documents",
                                                action = "",
                                                label = $this.attr("href"),
                                                i = 0, z = 0, numSlashes = 0,
                                                oURL = window.location.pathname,
                                                splitURL = oURL.split("/");
               
                                                splitURL.remove(0); // removes first blank entry in the Array
                                                splitURL.remove(-1); // removes filename
               
                                if (label.match(/(\.\.\/)/gi)) { // check for "../" in HREF attr
               
                                                numSlashes = label.match(/(\.\.\/)/gi).length; // how many slashes
                                                label = label.replace(/(\.\.\/)/gi, ""); // replace slashes with ""
               
                                                if (numSlashes === splitURL.length) { // if the number of slashes equals directories in splitURL
 
                                                                action = "/" + label;
 
                                                } else {  // If numSlashes !=== splitURL.length (meat and potatoes)
 
                                                                for (i; i < numSlashes; i++) {
               
                                                                                splitURL.remove(-1); // removes the last item in the array until numslashes are removed
                                                                               
                                                                }
               
                                                                for (z; z < splitURL.length; z++) {
               
                                                                                if (action === "") { // runs once at beginning
               
                                                                                                splitURL.reverse(); // reverse the split to reassemble URL
               
                                                                                                action = "/" + splitURL[z] + "/" + label; // /splitURL[0]/label
               
                                                                                } else { // runs until numSlashes has been fulfilled
               
                                                                                                action = "/" + splitURL[z] + action; // /splitURL[z]/splitURL[0]/label
                                                                                }
               
                                                                }
               
                                                }
               
                                } else { // run if there are NO ../'s
                               
                                                if (label.match("http://") && !oURL.match("/search")) { // External && not search!
               
                                                                category = "External Documents";
                                                                action = label;
                                                               
                                                } else if (oURL.match("/search")) { // If Search, make it pretty.
                                                               
                                                                action = label.replace(/(http:\/\/www.criminaljustice.ny.gov)/gi, "");
               
                                                } else if (splitURL.length < 1) { // if not External && isRoot
               
                                                                action = "/" + label;                                                       
               
                                                } else { // If not root and not external
               
                                                                action = "/" + splitURL.join("/") + "/" + label;
               
                                                }
               
                                }
               
                                oURL = oURL.replace("/index.htm", "/").replace("/index.html", "/"); // index URL's = "/"
               
                                $this.gaEventTracker({
                                                "evtCategory": category,
                                                "evtAction": action,
                                                "evtLabel": oURL
                                });
                }
}
})( jQuery, window, document );


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
