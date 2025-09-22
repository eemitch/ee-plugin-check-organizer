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
        console.log('eePCP: PHP script loaded');
        console.log('eePCP: jQuery available?', typeof jQuery !== 'undefined');
        console.log('eePCP: $ available?', typeof $ !== 'undefined');
        console.log('eePCP: About to call jQuery ready...');

        if (typeof jQuery !== 'undefined') {
            console.log('eePCP: Inside jQuery check, calling ready...');
            jQuery(document).ready(function($) {
                console.log('eePCP: jQuery ready fired!');

                // Find form elements
                var dropdown = $('#plugin-check__plugins-dropdown');
                var submitBtn = $('#plugin-check__submit');
                var spinner = $('#plugin-check__spinner');
                var form = submitBtn.closest('form');

                console.log('eePCP: Elements found - Dropdown:', dropdown.length, 'Submit:', submitBtn.length, 'Spinner:', spinner.length);

                // Listen to events
                if (dropdown.length > 0) {
                    dropdown.on('change', function() {
                        console.log('eePCP: DROPDOWN CHANGED to:', $(this).val());
                    });
                }

                if (form.length > 0) {
                    form.on('submit', function() {
                        console.log('eePCP: FORM SUBMITTED!');
                    });
                }

                // Monitor spinner with optimized polling
                if (spinner.length > 0) {
                    var lastState = spinner.hasClass('is-active');
                    var pollCount = 0;
                    var pollInterval = null;

                    function startPolling() {
                        if (pollInterval) return; // Already polling

                        console.log('eePCP: Starting spinner polling');
                        pollInterval = setInterval(function() {
                            pollCount++;
                            var currentState = spinner.hasClass('is-active');

                            if (pollCount % 50 === 0) {
                                console.log('eePCP: Poll #' + pollCount + ' - spinner active:', currentState);
                            }

                            if (currentState !== lastState) {
                                if (currentState) {
                                    console.log('eePCP: SPINNER ACTIVE!');
                                } else {
                                    console.log('eePCP: SPINNER INACTIVE!');

                                    // Activate interface when check completes
                                    if (window.EEPluginCheckOrganizer && window.EEPluginCheckOrganizer.Interface) {
                                        console.log('eePCP: Calling Interface.setActive()');
                                        window.EEPluginCheckOrganizer.Interface.setActive();
                                    } else {
                                        console.log('eePCP: Interface module not available');
                                    }
                                }
                                lastState = currentState;

                                // Stop polling when spinner becomes inactive
                                if (!currentState) {
                                    console.log('eePCP: Stopping spinner polling');
                                    clearInterval(pollInterval);
                                    pollInterval = null;
                                }
                            }
                        }, 100);
                    }

                    // Start polling when submit button is clicked
                    if (submitBtn.length > 0) {
                        submitBtn.on('click', function() {
                            console.log('eePCP: SUBMIT CLICKED!');

                            // Set interface to inactive state
                            if (window.EEPluginCheckOrganizer && window.EEPluginCheckOrganizer.Interface) {
                                console.log('eePCP: Calling Interface.setInactive()');
                                window.EEPluginCheckOrganizer.Interface.setInactive();
                            } else {
                                console.log('eePCP: Interface module not available');
                            }

                            startPolling();
                        });
                    }
                }

                // Initialize the filter interface
                console.log('eePCP: Calling eePluginCheckOrganizerInit...');
                if (typeof window.eePluginCheckOrganizerInit === 'function') {
                    window.eePluginCheckOrganizerInit();
                    console.log('eePCP: eePluginCheckOrganizerInit called successfully');
                } else {
                    console.log('eePCP: eePluginCheckOrganizerInit function not available');
                }
            });
        }
        </script>
        <?php
    }
}

// Initialize the plugin
new EE_Plugin_Check_Organizer();