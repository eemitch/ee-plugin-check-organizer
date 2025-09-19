/**
 * EE Plugin Check Organizer - Sorting System
 * Sorting functionality for filtered results
 */

(function($) {
    'use strict';

    // Create namespace if it doesn't exist
    window.EEPluginCheckOrganizer = window.EEPluginCheckOrganizer || {};

    /**
     * Sorting System
     */
    window.EEPluginCheckOrganizer.Sorting = {
        currentSort: { field: 'line', direction: 'asc' }, // Default sorting by line number

        /**
         * Initialize sorting and bind events
         */
        init: function() {
            this.bindSortEvents();
        },

        /**
         * Bind sort events
         */
        bindSortEvents: function() {
            const self = this;

            // Sort dropdown change event
            $(document).on('change', '#ee-sort-dropdown', function() {
                const sortValue = $(this).val();
                const [field, direction] = sortValue.split('-');

                self.applySortFromDropdown(field, direction);
            });
        },

        /**
         * Apply sort from dropdown selection
         */
        applySortFromDropdown: function(field, direction) {
            const utils = window.EEPluginCheckOrganizer.Utils;
            const filters = window.EEPluginCheckOrganizer.Filters;

            utils.debugLog('Applying sort from dropdown:', field, direction);

            this.currentSort.field = field;
            this.currentSort.direction = direction;

            // Re-apply filters with new sort order
            if (filters) {
                filters.applyFilters();
            }
        },

        /**
         * Apply sorting to filtered issues array
         */
        applySorting: function(issues, sortField = null, direction = null) {
            const config = window.EEPluginCheckOrganizer.Config;

            // Use provided sort or current sort
            const field = sortField || this.currentSort.field;
            const dir = direction || this.currentSort.direction;

            return issues.slice().sort((a, b) => {
                let compareResult = 0;

                switch (field) {
                    case 'line':
                        compareResult = a.line - b.line;
                        break;
                    case 'type':
                        // Use priority order: ERROR (1) → WARNING (2) → INFO (3)
                        const aPriority = config.ERROR_TYPE_PRIORITY[a.type] || 999;
                        const bPriority = config.ERROR_TYPE_PRIORITY[b.type] || 999;
                        compareResult = aPriority - bPriority;
                        break;
                    case 'code':
                        compareResult = a.code.localeCompare(b.code);
                        break;
                    case 'file':
                        compareResult = a.fileName.localeCompare(b.fileName);
                        break;
                    default:
                        compareResult = a.line - b.line; // Default to line sorting
                }

                // Apply direction (asc/desc)
                return dir === 'desc' ? -compareResult : compareResult;
            });
        },

        /**
         * Get current sort settings
         */
        getCurrentSort: function() {
            return this.currentSort;
        },

        /**
         * Set current sort settings
         */
        setCurrentSort: function(field, direction) {
            this.currentSort.field = field;
            this.currentSort.direction = direction;
        }
    };

})(jQuery);