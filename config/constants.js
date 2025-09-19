/**
 * EE Plugin Check Organizer - Configuration Constants
 * Central configuration and constants for the plugin
 */

(function() {
    'use strict';

    // Create namespace if it doesn't exist
    window.EEPluginCheckOrganizer = window.EEPluginCheckOrganizer || {};

    /**
     * Configuration constants
     */
    window.EEPluginCheckOrganizer.Config = {
        // Debug Mode - Set to false for production
        DEBUG_MODE: false,

        // Default sort configuration
        DEFAULT_SORT: {
            field: 'line',
            direction: 'asc'
        },

        // DOM selectors
        SELECTORS: {
            CATEGORIES_TABLE: '#plugin-check__categories',
            RESULTS_CONTAINER: '#plugin-check__results',
            RESULTS_TABLE: '.plugin-check__results-table',
            SUBMIT_BUTTON: '#plugin-check-form input[type="submit"]'
        },

        // CSS classes
        CSS_CLASSES: {
            FILTER_CONTAINER: 'ee-filter-container',
            FILTER_DROPDOWN_GROUP: 'ee-filter-dropdown-group',
            DISABLED: 'ee-disabled',
            FILTERED_RESULTS: 'ee-filtered-results'
        },

        // Export configuration
        EXPORT: {
            FORMATS: ['csv', 'json', 'txt'],
            MIME_TYPES: {
                csv: 'text/csv',
                json: 'application/json',
                txt: 'text/plain'
            }
        },

        // Hidden files patterns
        HIDDEN_FILE_PATTERNS: ['.DS_Store', '.gitignore', '.htaccess'],

        // Error type priorities for sorting
        ERROR_TYPE_PRIORITY: {
            'ERROR': 1,
            'WARNING': 2,
            'INFO': 3
        }
    };

})();