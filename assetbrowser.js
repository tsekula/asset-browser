// external js: isotope.pkgd.js, imagesloaded.pkgd.js
// https://demo.skyoverhill.com/wp-content/uploads/2019/03/assets.json

// Variables for asset list and images
var $grid;
var $assets;
var $assetindex = 0;
var $assetbatchsize = 40;
var $imgpath = "https://i2.wp.com/demo.skyoverhill.com/wp-content/uploads/2019/02/";
var $assetsourceURL = "https://qwess.io/graphql";
var $imgheight = 400;

function displayImages() {
  var $items = loadItems();
  $grid.isotope();
  $grid.isotopeImagesReveal( $items );  
}

// Handle clicking an asset image
function clickAssetHandler(error){
  // populate details pane
  var index = jQuery(this).attr( "data-asset-index" );
  var thisitem = $assets[index]["node"]
  jQuery("div#sAssetDetails .overlaypane").hide();
  jQuery("div#sAssetDetails h1#title").html(thisitem.title);
  jQuery("div#sAssetDetails div#description h2#category").html(thisitem.wc_filter_list);
  var fullimg = '<img src="' + 
  thisitem.thumbnail + '?h=700" ' +
  ' class = "assetmain"' +
  '/>';

  jQuery("div#imgmain").html(fullimg);

  toggleDetailsPane(1);
}

// Close Details Pane
function clickCloseDetailsPaneHandler(error){
  toggleDetailsPane();
}

function toggleDetailsPane(show){
  // set visibility of details pane if hidden
  if (instance.getSizes()[1]<35 || show) {
    // show pane
    instance.setSizes([65,35]);
    jQuery("div#sAssetDetails").show();
    jQuery("div#sAssetDetails .overlaypane").show("fade");
    $grid.isotope();
  } else {
    // hide pane
    jQuery("div#sAssetDetails").hide();
    jQuery("div#sAssetDetails .overlaypane").hide();
    instance.setSizes([100,0]);
    $grid.isotope();
  }
}


$.fn.isotopeImagesReveal = function( $items ) {
  var iso = this.data('isotope');
  var itemSelector = iso.options.itemSelector;
  // hide by default
  $items.hide();
  // append to container
  this.append( $items );
  $items.imagesLoaded().progress( function( imgLoad, image ) {
    // get item
    // image is imagesLoaded class, not <img>, <img> is image.img
    var $item = jQuery( image.img ).parents( itemSelector );
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

/* create a new individual DOM asset item*/
function loadItem(index) {
  var thisitem = $assets[index]["node"];
  var item = '<div class="grid-item '+ thisitem.wc_filter_list.toLowerCase() + '"' +
      ' data-asset-index = "' + index + '"' +
      ' data-asset-name = "' + thisitem.title + '"' +
    '>'+
    '<img src="' + 
      thisitem.thumbnail + '?h=' +  $imgheight +'" ' +
      ' class = "assets"' +
      '/></div>';
  return item;
}

/* retrieve a set of asset data and create DOM items */
function loadItems() {
  var items = '';
  for (var i=$assetindex; i < $assetindex+$assetbatchsize; i++ ) {
    if (i==$assets.length)
       break;
    items += loadItem(i);
  }
  $assetindex = i;
  // return jQuery object
  return jQuery( items );  
}

/* Pull initial list of assets from remote source*/
function loadAssets() {
  // Default options are marked with *
    return fetch($assetsourceURL, {
        method: "POST",
        mode: "cors", // no-cors, cors, *same-origin
        cache: "default", // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
            "Content-Type": "application/json",
        },
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer", // no-referrer, *client
        body: JSON.stringify({
          query: `
          query GETPRODUCTS {
            products(last:100) {
            edges {
              node {
                productId
                thumbnail
                id
                date
                price
                thumbnail_video
                title
                wc_filter_list
              }
            }
          }
        }
              `,
        }), // body data type must match "Content-Type" header
    })
    .then(response => response.json()); // parses JSON response into native Javascript objects 

}

/* Split */
var instance 

/* startup instructions */
jQuery(document).ready(function($){

    // initialize splitter
    instance = Split(['#sGallery', '#sAssetDetails'], {
      gutterSize: 0,
      sizes: [100, 0],
  });
        


    $grid = jQuery('.grid').isotope({
        // set itemSelector so .grid-sizer is not used in layout
        itemSelector: '.grid-item',
        percentPosition: true,
        masonry: {
          columnWidth: '.grid-sizer'
        },
        getSortData: {
          name: '[data-asset-name]',
          category: '[data-asset-category]'
        },
        initLayout: false
      });
      
    // wire-up click event for the grid
    jQuery(".grid").on("click", ".grid-item", clickAssetHandler);
    // wire-up click event for the grid
    jQuery("button.closepane").on("click", clickCloseDetailsPaneHandler);

    // filter items on button click
    jQuery('.filter-button-group').on( 'click', 'button', function() {
    var filterValue = jQuery(this).attr('data-filter');
    $grid.isotope({ filter: filterValue });
    });

    jQuery('#load-images').click(displayImages);

    //loadAssets(displayImages);

    loadAssets()
    //.then(data => $assets = data["data"]["products"]["edges"])
    .then(function(data){
      $assets = data["data"]["products"]["edges"];
      displayImages();
    })
    //.then(displayImages())
    .catch(function(error){
      console.log("There has been an error: " + error.data);}
    );
      
});