(function($) {
    $.fn.searchHighlight = function(options) {
      // Default settings
      var defaults = {
        listSelector: '',             // Selector for list items (required)
        searchFields: ['text'],       // Fields to search. Use 'text' for visible text and e.g., 'data-keywords' for attributes.
        caseSensitive: false,         // Whether the search is case sensitive
        delay: 300,                   // Debounce delay (ms)
        highlightClass: 'search-highlight', // CSS class applied to highlighted text
        tokenized: false,             // When true, if exact match fails, search using individual tokens (all must exist)
        // Optional animation settings:
        animation: {
          show: null,  // e.g., 'fadeIn'
          hide: null,  // e.g., 'fadeOut'
          duration: 300
        },
        // Callback hooks:
        onSearchStart: null,
        onSearchComplete: null
      };
  
      var settings = $.extend(true, {}, defaults, options);
      var $input = this;
  
      // Cache list items and store their original HTML content for later restoration
      var $listItems = $(settings.listSelector);
      $listItems.each(function() {
        var $item = $(this);
        if (!$item.data('originalHTML')) {
          $item.data('originalHTML', $item.html());
        }
      });
  
      // Debounce function to reduce search frequency
      var debounce = function(func, delay) {
        var timer;
        return function() {
          var context = this, args = arguments;
          clearTimeout(timer);
          timer = setTimeout(function() {
            func.apply(context, args);
          }, delay);
        };
      };
  
      // Main search function
      var doSearch = function() {
        var query = $input.val();
        
        // If the input is empty, restore all items to original state
        if (!query) {
          $listItems.each(function() {
            var $item = $(this);
            $item.html($item.data('originalHTML'));
            if (settings.animation && settings.animation.show) {
              $item.stop(true, true)[settings.animation.show](settings.animation.duration);
            } else {
              $item.show();
            }
          });
          if (typeof settings.onSearchComplete === 'function') {
            settings.onSearchComplete([]);
          }
          return;
        }
  
        if (typeof settings.onSearchStart === 'function') {
          settings.onSearchStart(query);
        }
        
        // Create a regular expression for an exact match, escaping special characters
        var flags = settings.caseSensitive ? 'g' : 'gi';
        var escapedQuery = query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        var exactRegex = new RegExp(escapedQuery, flags);
        
        var matches = [];
        $listItems.each(function() {
          var $item = $(this);
          var originalHTML = $item.data('originalHTML');
          var matchFound = false;
          var newHTML = originalHTML; // Will be updated if a match is found in text
  
          // Loop through each field specified in searchFields
          $.each(settings.searchFields, function(i, field) {
            if (field === 'text') {
              var textContent = $item.text();
              // First, try an exact contiguous match
              if (exactRegex.test(textContent)) {
                matchFound = true;
                exactRegex.lastIndex = 0;
                newHTML = originalHTML.replace(exactRegex, function(match) {
                  return '<span class="' + settings.highlightClass + '">' + match + '</span>';
                });
              }
              // If no exact match and tokenized search is enabled, then split into tokens
              else if (settings.tokenized) {
                var tokens = query.split(/\s+/).filter(function(token) { return token.length > 0; });
                // Check that every token exists somewhere in the text
                var allTokensFound = tokens.every(function(token) {
                  var tokenRegex = new RegExp(token.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), flags);
                  return tokenRegex.test(textContent);
                });
                if (allTokensFound && tokens.length) {
                  matchFound = true;
                  // Highlight each token individually. Note: This may result in overlapping <span>s if tokens are substrings.
                  tokens.forEach(function(token) {
                    var tokenEscaped = token.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                    var tokenRegex = new RegExp(tokenEscaped, flags);
                    newHTML = newHTML.replace(tokenRegex, function(match) {
                      return '<span class="' + settings.highlightClass + '">' + match + '</span>';
                    });
                  });
                }
              }
            }
            // For data attributes, just check for a match (no highlighting needed)
            else if (field.indexOf('data-') === 0) {
              var attrValue = $item.attr(field) || '';
              if (exactRegex.test(attrValue)) {
                matchFound = true;
              }
              else if (settings.tokenized) {
                var tokens = query.split(/\s+/).filter(function(token) { return token.length > 0; });
                var allTokensFound = tokens.every(function(token) {
                  var tokenRegex = new RegExp(token.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), flags);
                  return tokenRegex.test(attrValue);
                });
                if (allTokensFound && tokens.length) {
                  matchFound = true;
                }
              }
            }
          }); // end each searchFields
  
          if (matchFound) {
            matches.push($item);
            if (settings.animation && settings.animation.show) {
              $item.stop(true, true)[settings.animation.show](settings.animation.duration);
            } else {
              $item.show();
            }
            // Update HTML for text field highlighting (if applicable)
            $item.html(newHTML);
          } else {
            if (settings.animation && settings.animation.hide) {
              $item.stop(true, true)[settings.animation.hide](settings.animation.duration);
            } else {
              $item.hide();
            }
            // Restore original HTML so no stale markup remains
            $item.html(originalHTML);
          }
        });
  
        if (typeof settings.onSearchComplete === 'function') {
          settings.onSearchComplete(matches);
        }
      };
  
      // Bind input events (including the native 'search' event for type="search" inputs)
      $input.on('input search', debounce(doSearch, settings.delay));
      return this;
    };
  })(jQuery);
  