$(document).ready(function() {
    // $('#search').advanceBlockSearch({
    //     listSelector: '.card-body',
    //     hideUnmatched: true,
    //     matchedClass: 'matched',
    //     delay: 0,
    //     highlightClass: 'ting'
    // });

    // JavaScript initialization:
$('#search').searchHighlight({
    listSelector: '.card-item',
    searchFields: ['text', 'data-keywords', 'data-info'],
    caseSensitive: false,
    // delay: 300,
    highlightClass: 'myHighlight',
    tokenized: true, // Enable tokenized search: exact contiguous match first, then individual token matching
    // animation: {
    //   show: 'fadeIn',
    //   hide: 'fadeOut',
    //   duration: 300
    // },
    onSearchStart: function(query) {
      console.log("Searching for: " + query);
    },
    onSearchComplete: function(matches) {
      console.log("Found " + matches.length + " matching items.");
    }
  });
  
});