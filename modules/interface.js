/**
 * EE Plugin Check Organizer - Interface Management
 * UI creation, updates, and DOM manipulation
 */

(function($) {
    'use strict';

    // Create namespace if it doesn't exist
    window.EEPluginCheckOrganizer = window.EEPluginCheckOrganizer || {};

    /**
     * Interface Management
     */
    window.EEPluginCheckOrganizer.Interface = {
        filterInterface: null,

        /**
         * Initialize the interface
         */
        init: function() {
            this.createFilterInterface();
            this.bindEvents();
        },

        /**
         * Create the filter interface
         */
        createFilterInterface: function() {
            const config = window.EEPluginCheckOrganizer.Config;
            const utils = window.EEPluginCheckOrganizer.Utils;
            const filters = window.EEPluginCheckOrganizer.Filters;

            // Look for the categories table first
            const categoriesTable = $(config.SELECTORS.CATEGORIES_TABLE);

            if (categoriesTable.length === 0) {
                utils.debugLog('Categories table not found, cannot create filter interface');
                return;
            }

            utils.debugLog('Creating filter interface');

            // Check if results exist to determine if inputs should be disabled
            const hasResults = $(config.SELECTORS.RESULTS_CONTAINER).length > 0 &&
                              $(config.SELECTORS.RESULTS_CONTAINER + ' h4').length > 0;
            const disabledAttr = hasResults ? '' : 'disabled';
            const disabledClass = hasResults ? '' : config.CSS_CLASSES.DISABLED;

            // Get list of files, error types, and error codes from results if available
            const fileOptions = filters ? filters.getFileOptionsHtml(hasResults) : '<option value="all">All Files</option>';
            const errorTypeOptions = filters ? filters.getErrorTypeOptionsHtml(hasResults) : '<option value="all">All Error Types</option>';
            const errorCodeOptions = filters ? filters.getErrorCodeOptionsHtml(hasResults) : '<option value="all">All Error Codes</option>';

            this.filterInterface = $(`
                <div id="ee-plugin-check-filter" class="${config.CSS_CLASSES.FILTER_CONTAINER} ${disabledClass}">
                    <div class="ee-filter-header">
                        <h3>🔍 Plugin Check Organizer</h3>
                        <div id="ee-results-summary" class="ee-results-summary-inline">
                            ${hasResults ? '' : 'Run a plugin check to organize and filter results'}
                        </div>
                    </div>
                    <div class="ee-filter-controls">
                        <div class="${config.CSS_CLASSES.FILTER_DROPDOWN_GROUP}">
                            <label for="ee-file-filter" class="ee-dropdown-label">
                                <strong>📁 Filter by File:</strong>
                            </label>
                            <select id="ee-file-filter" class="ee-file-dropdown" ${disabledAttr}>
                                ${fileOptions}
                            </select>
                        </div>
                        <div class="${config.CSS_CLASSES.FILTER_DROPDOWN_GROUP}">
                            <label for="ee-error-type-filter" class="ee-dropdown-label">
                                <strong>⚠️ Filter by Error Type:</strong>
                            </label>
                            <select id="ee-error-type-filter" class="ee-file-dropdown" ${disabledAttr}>
                                ${errorTypeOptions}
                            </select>
                        </div>
                        <div class="${config.CSS_CLASSES.FILTER_DROPDOWN_GROUP}">
                            <label for="ee-error-code-filter" class="ee-dropdown-label">
                                <strong>🔧 Filter by Error Code:</strong>
                            </label>
                            <select id="ee-error-code-filter" class="ee-file-dropdown" ${disabledAttr}>
                                ${errorCodeOptions}
                            </select>
                        </div>
                    </div>
                    <div class="ee-display-controls">
                        <div class="${config.CSS_CLASSES.FILTER_DROPDOWN_GROUP}">
                            <label class="ee-checkbox-label">
                                <input type="checkbox" id="ee-hide-hidden-files" ${disabledAttr}>
                                <strong>🙈 Hide Hidden Files</strong>
                                <span class="ee-checkbox-note">(Files starting with . like .DS_Store, .gitignore)</span>
                            </label>
                        </div>
                    </div>
                    <div class="ee-sort-controls">
                        <div class="${config.CSS_CLASSES.FILTER_DROPDOWN_GROUP}">
                            <label for="ee-sort-dropdown" class="ee-dropdown-label">
                                <strong>🔀 Sort Results:</strong>
                            </label>
                            <select id="ee-sort-dropdown" class="ee-file-dropdown" ${disabledAttr}>
                                <option value="line-asc" selected>Line # (Low to High)</option>
                                <option value="line-desc">Line # (High to Low)</option>
                                <option value="type-asc">Error Type (ERROR → WARNING → INFO)</option>
                                <option value="type-desc">Error Type (INFO → WARNING → ERROR)</option>
                                <option value="code-asc">Error Code (A to Z)</option>
                                <option value="code-desc">Error Code (Z to A)</option>
                                <option value="file-asc">File Name (A to Z)</option>
                                <option value="file-desc">File Name (Z to A)</option>
                            </select>
                        </div>
                    </div>
                    <div class="ee-export-controls">
                        <div class="${config.CSS_CLASSES.FILTER_DROPDOWN_GROUP}">
                            <label for="ee-export-dropdown" class="ee-dropdown-label">
                                <strong>📊 Export Results:</strong>
                            </label>
                            <select id="ee-export-dropdown" class="ee-file-dropdown" ${disabledAttr}>
                                <option value="">Select export format...</option>
                                <option value="csv">CSV (Comma-Separated Values)</option>
                                <option value="json">JSON (JavaScript Object Notation)</option>
                                <option value="txt">TXT (Plain Text)</option>
                            </select>
                            <button id="ee-export-go" class="button button-primary" ${disabledAttr}>Go</button>
                            <span class="ee-export-note">(Exports currently filtered results)</span>
                        </div>
                    </div>
                    <div class="ee-branding">
                        <a href="https://github.com/eemitch/ee-plugin-check-organizer" target="_blank" rel="noopener">eePCP</a>
                    </div>
                    <div id="ee-filter-results" class="${config.CSS_CLASSES.FILTERED_RESULTS}"></div>
                </div>
            `);

            // Find the main form area
            const mainForm = categoriesTable.closest('form');

            if (mainForm.length > 0) {
                // Insert after the form
                mainForm.after(this.filterInterface);
                utils.debugLog('Filter interface inserted after main form');
            } else {
                // Fallback: insert after categories table
                categoriesTable.after(this.filterInterface);
                utils.debugLog('Filter interface inserted after categories table (fallback)');
            }

            console.log('EE Plugin Check Organizer: Filter interface created and inserted');
        },

        /**
         * Bind interface events
         */
        bindEvents: function() {
            const config = window.EEPluginCheckOrganizer.Config;
            const self = this;

            // Watch for "Check It!" button clicks to reset interface immediately
            $(document).on('click', config.SELECTORS.SUBMIT_BUTTON, function() {
                setTimeout(function() {
                    self.resetInterface();
                }, 100);
            });
        },

        /**
         * Reset the interface when a new Plugin Check starts
         */
        resetInterface: function() {
            const config = window.EEPluginCheckOrganizer.Config;

            console.log('EE Plugin Check Organizer: Resetting interface for new check');

            // Reset interface to disabled state
            if (this.filterInterface) {
                this.filterInterface.addClass(config.CSS_CLASSES.DISABLED);
                this.filterInterface.find('select').prop('disabled', true);
                this.filterInterface.find('input').prop('disabled', true);
                this.filterInterface.find('button').prop('disabled', true);

                // Reset dropdown values
                this.filterInterface.find('#ee-file-filter').val('all');
                this.filterInterface.find('#ee-error-type-filter').val('all');
                this.filterInterface.find('#ee-error-code-filter').val('all');
                this.filterInterface.find('#ee-sort-dropdown').val('line-asc');
                this.filterInterface.find('#ee-hide-hidden-files').prop('checked', false);
                this.filterInterface.find('#ee-export-dropdown').val('');

                // Update subtitle
                this.filterInterface.find('#ee-results-summary').text('Run a plugin check to organize and filter results');

                // Clear any filtered results
                this.filterInterface.find('#ee-filter-results').empty();
            }

            // Remove any filtered results that might be showing
            $('#ee-filtered-results').remove();
            $(config.SELECTORS.RESULTS_CONTAINER).show();
        },

        /**
         * Enable the filter interface when results are available
         */
        enableInterface: function() {
            const config = window.EEPluginCheckOrganizer.Config;
            const filters = window.EEPluginCheckOrganizer.Filters;

            if (!this.filterInterface) return;

            // Remove disabled class and attributes
            this.filterInterface.removeClass(config.CSS_CLASSES.DISABLED);
            this.filterInterface.find('#ee-file-filter').prop('disabled', false);
            this.filterInterface.find('#ee-error-type-filter').prop('disabled', false);
            this.filterInterface.find('#ee-error-code-filter').prop('disabled', false);

            // Enable export dropdown and Go button
            this.filterInterface.find('#ee-export-dropdown').prop('disabled', false);
            this.filterInterface.find('#ee-export-go').prop('disabled', false);

            // Enable sort dropdown and hidden files checkbox
            this.filterInterface.find('#ee-sort-dropdown').prop('disabled', false);
            this.filterInterface.find('#ee-hide-hidden-files').prop('disabled', false);

            // Update dropdown options with current data
            if (filters) {
                const fileOptions = filters.getFileOptionsHtml(true);
                const errorTypeOptions = filters.getErrorTypeOptionsHtml(true);
                const errorCodeOptions = filters.getErrorCodeOptionsHtml(true);

                this.filterInterface.find('#ee-file-filter').html(fileOptions);
                this.filterInterface.find('#ee-error-type-filter').html(errorTypeOptions);
                this.filterInterface.find('#ee-error-code-filter').html(errorCodeOptions);
            }

            // Update subtitle
            this.filterInterface.find('#ee-results-summary').text('');

            // Update scan summary
            this.updateScanSummary();

            console.log('EE Plugin Check Organizer: Filter interface enabled');
        },

        /**
         * Update the scan summary display with current results
         */
        updateScanSummary: function() {
            const utils = window.EEPluginCheckOrganizer.Utils;
            const resultsParser = window.EEPluginCheckOrganizer.ResultsParser;
            const summaryElement = $('#ee-results-summary');

            if (summaryElement.length === 0) return;

            const originalResults = resultsParser.getAllResults();
            if (originalResults.length === 0) return;

            // Count unique files
            const uniqueFiles = new Set();
            originalResults.forEach(issue => {
                uniqueFiles.add(issue.fileName);
            });

            // Count issues by type
            const typeCounts = { ERROR: 0, WARNING: 0, INFO: 0 };
            originalResults.forEach(issue => {
                if (typeCounts.hasOwnProperty(issue.type)) {
                    typeCounts[issue.type]++;
                }
            });

            // Create summary HTML
            const totalIssues = originalResults.length;
            const fileCount = uniqueFiles.size;

            let summaryHtml = `
                <div class="ee-summary-stats">
                    <span class="ee-summary-item">
                        <strong>${totalIssues}</strong> issues found
                    </span>
                    <span class="ee-summary-separator">•</span>
                    <span class="ee-summary-item">
                        <strong>${fileCount}</strong> files affected
                    </span>
            `;

            // Add type breakdown if there are multiple types
            if (typeCounts.ERROR > 0 || typeCounts.WARNING > 0 || typeCounts.INFO > 0) {
                summaryHtml += '<span class="ee-summary-separator">•</span>';
                const typeBreakdown = [];
                if (typeCounts.ERROR > 0) typeBreakdown.push(`${typeCounts.ERROR} ERROR`);
                if (typeCounts.WARNING > 0) typeBreakdown.push(`${typeCounts.WARNING} WARNING`);
                if (typeCounts.INFO > 0) typeBreakdown.push(`${typeCounts.INFO} INFO`);
                summaryHtml += `<span class="ee-summary-item">${typeBreakdown.join(', ')}</span>`;
            }

            summaryHtml += `</div>`;

            summaryElement.html(summaryHtml);
            utils.debugLog('Scan summary updated:', { totalIssues, fileCount, typeCounts });
        }
    };

})(jQuery);