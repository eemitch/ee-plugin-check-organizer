<?php
/**
 * Plugin Name: EE Plugin Check Organizer
 * Plugin URI: https://elementengage.com
 * Description: Adds filtering and organization capabilities to the WordPress Plugin Check tool results. Filter by file name, error type, or error code with real-time search.
 * Version: 1.0.0
 * Author: Element Engage
 * Author URI: https://elementengage.com
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: ee-plugin-check-organizer
 * Requires at least: 5.0
 * Tested up to: 6.3
 * Requires PHP: 7.4
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Main Plugin Class
 */
class EE_Plugin_Check_Organizer {

    /**
     * Plugin version
     */
    const VERSION = '1.0.0';

    /**
     * Constructor
     */
    public function __construct() {
        add_action('init', array($this, 'init'));
    }

    /**
     * Initialize the plugin
     */
    public function init() {
        // Hook into admin pages
        add_action('admin_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_action('admin_footer', array($this, 'add_filter_interface'));
    }

    /**
     * Enqueue scripts and styles on Plugin Check pages
     */
    public function enqueue_scripts($hook) {
        // Only load on Plugin Check pages
        if ($hook !== 'tools_page_plugin-check' && strpos($hook, 'plugin-check') === false) {
            return;
        }

        // Enqueue our JavaScript
        wp_enqueue_script(
            'ee-plugin-check-organizer',
            plugins_url('main.js', __FILE__),
            array('jquery'),
            self::VERSION,
            true
        );

        // Enqueue our CSS
        wp_enqueue_style(
            'ee-plugin-check-organizer',
            plugins_url('style.css', __FILE__),
            array(),
            self::VERSION
        );

        // Localize script for translations
        wp_localize_script('ee-plugin-check-organizer', 'eePluginCheckOrganizer', array(
            'nonce' => wp_create_nonce('ee_plugin_check_organizer'),
            'strings' => array(
                'filterPlaceholder' => __('Filter by file name, error type, or error code...', 'ee-plugin-check-organizer'),
                'clearFilter' => __('Clear Filter', 'ee-plugin-check-organizer'),
                'noResults' => __('No results found matching your filter.', 'ee-plugin-check-organizer'),
                'showAll' => __('Show All', 'ee-plugin-check-organizer'),
                'errorType' => __('Error Type', 'ee-plugin-check-organizer'),
                'errorCode' => __('Error Code', 'ee-plugin-check-organizer'),
                'fileName' => __('File Name', 'ee-plugin-check-organizer')
            )
        ));
    }

    /**
     * Add filter interface to Plugin Check pages
     */
    public function add_filter_interface() {
        $screen = get_current_screen();

        // Only add to Plugin Check pages
        if (!$screen || (strpos($screen->id, 'plugin-check') === false && $screen->id !== 'tools_page_plugin-check')) {
            return;
        }

        ?>
        <script type="text/javascript">
        console.log('EE Plugin Check Organizer: PHP script loaded');
        jQuery(document).ready(function($) {
            console.log('EE Plugin Check Organizer: jQuery ready fired');
            console.log('EE Plugin Check Organizer: Looking for categories table:', $('#plugin-check__categories').length);

            // Initialize the filter interface on Plugin Check pages
            if (typeof window.eePluginCheckOrganizerInit === 'function') {
                console.log('EE Plugin Check Organizer: Init function found, calling...');
                window.eePluginCheckOrganizerInit();
            } else {
                console.log('EE Plugin Check Organizer: Init function NOT found!');
                console.log('EE Plugin Check Organizer: Available functions:', Object.keys(window).filter(k => k.includes('ee')));
            }
        });
        </script>
        <?php
    }
}

// Initialize the plugin
new EE_Plugin_Check_Organizer();