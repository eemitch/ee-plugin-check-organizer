/**
 * EE Plugin Check Organizer
 * Main entry point - coordinates all modules
 *
 * This file initializes the modular plugin architecture and provides
 * the global API for the Plugin Check Organizer functionality.
 */

(function($) {
    'use strict';

    /**
     * Initialize the Plugin Check Organizer
     * This is the main entry point called by WordPress
     */
    window.eePluginCheckOrganizerInit = function() {
        console.log('EE Plugin Check Organizer: Init function called');
        console.log('EE Plugin Check Organizer: Checking module availability...');

        // Check each module individually for better debugging
        const modules = [
            'window.EEPluginCheckOrganizer',
            'window.EEPluginCheckOrganizer.Config',
            'window.EEPluginCheckOrganizer.Utils',
            'window.EEPluginCheckOrganizer.ResultsParser',
            'window.EEPluginCheckOrganizer.Interface',
            'window.EEPluginCheckOrganizer.Filters',
            'window.EEPluginCheckOrganizer.Sorting',
            'window.EEPluginCheckOrganizer.Export'
        ];

        const missingModules = [];
        modules.forEach(function(modulePath) {
            const parts = modulePath.split('.');
            let current = window;
            for (let i = 1; i < parts.length; i++) {
                if (!current[parts[i]]) {
                    missingModules.push(modulePath);
                    break;
                }
                current = current[parts[i]];
            }
        });

        if (missingModules.length > 0) {
            console.error('EE Plugin Check Organizer: Missing modules:', missingModules);
            console.log('EE Plugin Check Organizer: Available namespace:', window.EEPluginCheckOrganizer);
            return;
        }

        console.log('EE Plugin Check Organizer: All modules loaded successfully');

        // Ensure all modules are loaded
        if (!window.EEPluginCheckOrganizer ||
            !window.EEPluginCheckOrganizer.Config ||
            !window.EEPluginCheckOrganizer.Utils ||
            !window.EEPluginCheckOrganizer.ResultsParser ||
            !window.EEPluginCheckOrganizer.Interface ||
            !window.EEPluginCheckOrganizer.Filters ||
            !window.EEPluginCheckOrganizer.Sorting ||
            !window.EEPluginCheckOrganizer.Export) {
            console.error('EE Plugin Check Organizer: Required modules not loaded');
            return;
        }

        window.EEPluginCheckOrganizer.Utils.debugLog('Init function called');

        // Check if we're on a Plugin Check page
        const categoriesTable = $('#plugin-check__categories');
        console.log('EE Plugin Check Organizer: Categories table found:', categoriesTable.length > 0);
        window.EEPluginCheckOrganizer.Utils.debugLog('Categories table found:', categoriesTable.length > 0);

        if (categoriesTable.length === 0) {
            console.log('EE Plugin Check Organizer: No categories table found, exiting');
            window.EEPluginCheckOrganizer.Utils.debugLog('No categories table found, exiting');
            return;
        }

        console.log('EE Plugin Check Organizer: Initializing interface...');
        // Initialize the interface
        window.EEPluginCheckOrganizer.Interface.init();

        console.log('EE Plugin Check Organizer: Initializing results parser...');
        // Start watching for Plugin Check completion
        window.EEPluginCheckOrganizer.ResultsParser.init();

        console.log('EE Plugin Check Organizer: Setting up global API...');
        // Set up global API
        setupGlobalAPI();

        console.log('EE Plugin Check Organizer: Initialization complete');
        window.EEPluginCheckOrganizer.Utils.debugLog('Initialization complete');
    };

    /**
     * Set up the global API for external access
     */
    function setupGlobalAPI() {
        // Main API object
        window.eePluginCheckOrganizer = {
            refreshResults: window.EEPluginCheckOrganizer.ResultsParser.refreshResults,
            exportResults: window.EEPluginCheckOrganizer.Export.exportResults
        };

        // Add debug functions only in debug mode
        if (window.EEPluginCheckOrganizer.Config.DEBUG_MODE) {
            window.eePluginCheckOrganizer.testScan = function() {
                window.EEPluginCheckOrganizer.Utils.debugLog('Manual test scan triggered');
                window.EEPluginCheckOrganizer.ResultsParser.storeOriginalResults();
            };
            window.eePluginCheckOrganizer.debugMode = true;
            window.eePluginCheckOrganizer.exportCSV = function() {
                window.EEPluginCheckOrganizer.Export.exportResults('csv');
            };
            window.eePluginCheckOrganizer.exportJSON = function() {
                window.EEPluginCheckOrganizer.Export.exportResults('json');
            };
            window.eePluginCheckOrganizer.exportTXT = function() {
                window.EEPluginCheckOrganizer.Export.exportResults('txt');
            };
            window.eePluginCheckOrganizer.setExportFormat = function(format) {
                $('#ee-export-dropdown').val(format);
                window.EEPluginCheckOrganizer.Utils.debugLog('Export format set to:', format);
            };
            window.eePluginCheckOrganizer.sortByLineAsc = function() {
                window.EEPluginCheckOrganizer.Sorting.applySortFromDropdown('line', 'asc');
            };
            window.eePluginCheckOrganizer.sortByLineDesc = function() {
                window.EEPluginCheckOrganizer.Sorting.applySortFromDropdown('line', 'desc');
            };
            window.eePluginCheckOrganizer.sortByTypeAsc = function() {
                window.EEPluginCheckOrganizer.Sorting.applySortFromDropdown('type', 'asc');
            };
            window.eePluginCheckOrganizer.sortByTypeDesc = function() {
                window.EEPluginCheckOrganizer.Sorting.applySortFromDropdown('type', 'desc');
            };
            window.eePluginCheckOrganizer.clearSort = function() {
                window.EEPluginCheckOrganizer.Sorting.currentSort = { field: 'line', direction: 'asc' };
                $('#ee-sort-dropdown').val('line-asc');
                window.EEPluginCheckOrganizer.Filters.applyFilters();
            };
            window.EEPluginCheckOrganizer.Utils.debugLog('Debug mode enabled - testScan(), export, and sort functions available');
        }
    }

})(jQuery);