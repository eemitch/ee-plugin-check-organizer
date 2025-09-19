/**
 * EE Plugin Check Organizer - Utility Functions
 * Helper functions and utilities used throughout the plugin
 */

(function($) {
    'use strict';

    // Create namespace if it doesn't exist
    window.EEPluginCheckOrganizer = window.EEPluginCheckOrganizer || {};

    /**
     * Utility functions
     */
    window.EEPluginCheckOrganizer.Utils = {
        /**
         * Debug console logging - only when DEBUG_MODE is true
         */
        debugLog: function(...args) {
            if (window.EEPluginCheckOrganizer.Config.DEBUG_MODE) {
                console.log('EE Plugin Check Organizer:', ...args);
            }
        },

        /**
         * Escape CSV field
         */
        escapeCSVField: function(field) {
            if (field == null) return '';
            field = String(field);
            if (field.includes(',') || field.includes('"') || field.includes('\n')) {
                return '"' + field.replace(/"/g, '""') + '"';
            }
            return field;
        },

        /**
         * Escape RegExp special characters
         */
        escapeRegExp: function(string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        },

        /**
         * Download file to user's computer
         */
        downloadFile: function(content, filename, mimeType) {
            const blob = new Blob([content], { type: mimeType });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        },

        /**
         * Highlight matching text in results
         */
        highlightMatch: function(text, query) {
            if (!query || query.length < 2) return text;

            const regex = new RegExp(`(${this.escapeRegExp(query)})`, 'gi');
            return text.replace(regex, '<mark class="ee-highlight">$1</mark>');
        },

        /**
         * Check if a file is hidden based on patterns
         */
        isHiddenFile: function(fileName) {
            const config = window.EEPluginCheckOrganizer.Config;
            return config.HIDDEN_FILE_PATTERNS.some(pattern => fileName.startsWith(pattern));
        },

        /**
         * Generate timestamp for exports
         */
        generateTimestamp: function() {
            const now = new Date();
            return now.getFullYear() + '-' +
                   String(now.getMonth() + 1).padStart(2, '0') + '-' +
                   String(now.getDate()).padStart(2, '0') + '_' +
                   String(now.getHours()).padStart(2, '0') + '-' +
                   String(now.getMinutes()).padStart(2, '0');
        },

        /**
         * Get debug API functions (only in debug mode)
         */
        getDebugAPI: function(debugMode, dataManager, filterInterface, exportManager) {
            if (!debugMode) return {};

            return {
                testScan: function() {
                    console.log('EE Plugin Check Organizer: Manual test scan triggered');
                    if (dataManager) dataManager.refreshResults();
                },
                exportCSV: function() { exportManager.exportResults('csv'); },
                exportJSON: function() { exportManager.exportResults('json'); },
                exportTXT: function() { exportManager.exportResults('txt'); },
                debugMode: true
            };
        }
    };

})(jQuery);
