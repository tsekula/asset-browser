<?php
/**
 * Child theme functions
 *
 * When using a child theme (see http://codex.wordpress.org/Theme_Development
 * and http://codex.wordpress.org/Child_Themes), you can override certain
 * functions (those wrapped in a function_exists() call) by defining them first
 * in your child theme's functions.php file. The child theme's functions.php
 * file is included before the parent theme's file, so the child theme
 * functions would be used.
 *
 * Text Domain: oceanwp
 * @link http://codex.wordpress.org/Plugin_API
 *
 */

/**
 * Load the parent style.css file
 *
 * @link http://codex.wordpress.org/Child_Themes
 */

 // include custom jQuery
function include_custom_jquery() {

	wp_deregister_script('jquery');
	wp_enqueue_script('jquery', 'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.2/jquery.min.js', array(), null, true);
	wp_enqueue_script('split', 'https://cdnjs.cloudflare.com/ajax/libs/split.js/1.3.5/split.min.js', array(), null, true);
	wp_enqueue_script('isotope', 'https://unpkg.com/isotope-layout@3/dist/isotope.pkgd.js', array(), null, true);
	wp_enqueue_script('imagesloaded', 'https://unpkg.com/imagesloaded@4/imagesloaded.pkgd.js', array(), null, true);
	wp_enqueue_script('jqueryui', 'https://code.jquery.com/ui/1.12.1/jquery-ui.js', array(), null, true);
}

function oceanwp_child_enqueue_parent_style() {
	// Dynamically get version number of the parent stylesheet (lets browsers re-cache your stylesheet when you update your theme)
	$theme   = wp_get_theme( 'OceanWP' );
	$version = $theme->get( 'Version' );
	// Load the stylesheet
	wp_enqueue_style( 'child-style', get_stylesheet_directory_uri() . '/style.css', array( 'oceanwp-style' ), $version );
	wp_enqueue_style( 'assetbrowser', get_stylesheet_directory_uri() . '/assets/assetbrowser.css',false,'1.1','all');
	wp_enqueue_style( 'asset-split', get_stylesheet_directory_uri() . '/assets/asset-split.css',false,'1.1','all');

	wp_enqueue_script( 'assetbrowser', get_stylesheet_directory_uri() . '/assets/assetbrowser.js',array ( 'jquery','split','isotope','imagesloaded','jqueryui' ), 1.1, true);	
}
add_action('wp_enqueue_scripts', 'include_custom_jquery');
add_action( 'wp_enqueue_scripts', 'oceanwp_child_enqueue_parent_style' );