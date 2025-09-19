<?php
/**
 * Plugin Name: EE Plugin Check Organizer
 * Plugin URI: https://github.com/eemitch/ee-plugin-check-organizer
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

        // Enqueue module files in correct dependency order
        // 1. Configuration constants first
        wp_enqueue_script(
            'ee-plugin-check-organizer-config',
            plugins_url('config/constants.js', __FILE__),
            array('jquery'),
            self::VERSION,
            true
        );

        // 2. Utility functions
        wp_enqueue_script(
            'ee-plugin-check-organizer-utils',
            plugins_url('modules/utils.js', __FILE__),
            array('jquery', 'ee-plugin-check-organizer-config'),
            self::VERSION,
            true
        );

        // 3. Core modules
        wp_enqueue_script(
            'ee-plugin-check-organizer-results-parser',
            plugins_url('modules/results-parser.js', __FILE__),
            array('jquery', 'ee-plugin-check-organizer-config', 'ee-plugin-check-organizer-utils'),
            self::VERSION,
            true
        );

        wp_enqueue_script(
            'ee-plugin-check-organizer-interface',
            plugins_url('modules/interface.js', __FILE__),
            array('jquery', 'ee-plugin-check-organizer-config', 'ee-plugin-check-organizer-utils'),
            self::VERSION,
            true
        );

        wp_enqueue_script(
            'ee-plugin-check-organizer-filters',
            plugins_url('modules/filters.js', __FILE__),
            array('jquery', 'ee-plugin-check-organizer-config', 'ee-plugin-check-organizer-utils'),
            self::VERSION,
            true
        );

        wp_enqueue_script(
            'ee-plugin-check-organizer-sorting',
            plugins_url('modules/sorting.js', __FILE__),
            array('jquery', 'ee-plugin-check-organizer-config', 'ee-plugin-check-organizer-utils'),
            self::VERSION,
            true
        );

        wp_enqueue_script(
            'ee-plugin-check-organizer-export',
            plugins_url('modules/export.js', __FILE__),
            array('jquery', 'ee-plugin-check-organizer-config', 'ee-plugin-check-organizer-utils'),
            self::VERSION,
            true
        );

        // 4. Main coordinator last (depends on all modules)
        wp_enqueue_script(
            'ee-plugin-check-organizer',
            plugins_url('main.js', __FILE__),
            array('jquery', 'ee-plugin-check-organizer-config', 'ee-plugin-check-organizer-utils',
                  'ee-plugin-check-organizer-results-parser', 'ee-plugin-check-organizer-interface',
                  'ee-plugin-check-organizer-filters', 'ee-plugin-check-organizer-sorting',
                  'ee-plugin-check-organizer-export'),
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