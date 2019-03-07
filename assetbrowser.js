// external js: isotope.pkgd.js, imagesloaded.pkgd.js
// https://demo.skyoverhill.com/wp-content/uploads/2019/03/assets.json

// Variables for asset list and images
var $grid;
var $assets;
var $currentasset = 0;
var $imgpath = "https://i2.wp.com/demo.skyoverhill.com/wp-content/uploads/2019/02/";
var $imgheight = 400;

function displayImages() {
  var $items = loadItems();
  $grid.isotope();
  $grid.isotopeImagesReveal( $items );  
}

// Handle clicking an asset image
function clickAssetHandler(error){
  var index = $(this).attr( "data-asset-index" );
  $("div#sAssetDetails h1#title").html($assets[index].name);
  $("div#sAssetDetails div#description").html($assets[index].cat);
}

$.fn.isotopeImagesReveal = function( $items ) {
  var iso = this.data('isotope');
  console.log(this);
  var itemSelector = iso.options.itemSelector;
  // hide by default
  $items.hide();
  // append to container
  this.append( $items );
  $items.imagesLoaded().progress( function( imgLoad, image ) {
    // get item
    // image is imagesLoaded class, not <img>, <img> is image.img
    var $item = $( image.img ).parents( itemSelector );
    // un-hide item
    $item.show();
    // isotope does its thing
    iso.appended( $item );
  });
  
  return this;
};

function randomInt( min, max ) {
  return Math.floor( Math.random() * max + min );
}

function loadItem(index) {
  var thisitem = $assets[index];
  var item = '<div class="grid-item" '+ 
      ' data-asset-index = "' + index + '"' +
      ' data-asset-name = "' + thisitem.name + '"' +
      ' data-asset-category = "' + thisitem.cat + '"' +
      ' data-asset-subcategory = "' + thisitem.subcat + '"' +  
    '>'+
    '<img src="' + 
      $imgpath + thisitem.imgsrc + '?h=' +  $imgheight +'" ' +
      ' class = "assets"' +
      '/></div>';
  return item;
}

function loadItems() {
  var items = '';
  for (var i=$currentasset; i < $currentasset+40; i++ ) {
    if (i==$assets.length)
       break;
    items += loadItem(i);
  }
  $currentasset = i;
  // return jQuery object
  return $( items );  
}

function loadAssets(callback) {
  //var assetsourceURL = "http://www.sekula.com/uploads/assets2.json";
  var assetsourceURL = "https://next.json-generator.com/api/json/get/4kWOAyt8U";

  $.getJSON(assetsourceURL)
    .fail(function() {
      console.log( "error" );
    })
    .done(function(data) {
      $assets = data;
      callback();
      });  
}


/* Split */
var instance 

window.onload = function() {
};


/* startup instructions */
$(function() {
    instance = Split(['#sGallery', '#sAssetDetails'], {
        gutterSize: 0,
        sizes: [65, 35],
        cursor: 'pointer',
    });

    $grid = $('.grid').isotope({
        itemSelector: '.grid-item',
        getSortData: {
          name: '[data-asset-name]',
          category: '[data-asset-category]'
        },
        masonry: {
          columnWidth: 200  
        },
        initLayout: false
      });
      
    // wire-up click event for the grid
    $(".grid").on("click", ".grid-item", clickAssetHandler);

    // filter items on button click
    $('.filter-button-group').on( 'click', 'button', function() {
    var filterValue = $(this).attr('data-filter');
    $grid.isotope({ filter: filterValue });
    });

    $('#load-images').click(displayImages);

    loadAssets(displayImages);
});