/**
 * EE Plugin Check Organizer - Filtering System
 * All filtering logic and dropdown management
 */

(function($) {
    'use strict';

    // Create namespace if it doesn't exist
    window.EEPluginCheckOrganizer = window.EEPluginCheckOrganizer || {};

    /**
     * Filtering System
     */
    window.EEPluginCheckOrganizer.Filters = {
        /**
         * Initialize filters and bind events
         */
        init: function() {
            this.bindFilterEvents();
        },

        /**
         * Get HTML options for file dropdown
         */
        getFileOptionsHtml: function(hasResults) {
            const utils = window.EEPluginCheckOrganizer.Utils;
            const resultsParser = window.EEPluginCheckOrganizer.ResultsParser;

            console.log('EE Plugin Check Organizer: Getting file options, hasResults:', hasResults);

            if (!hasResults) {
                return '<option value="all">All Files</option>';
            }

            const originalResults = resultsParser.getAllResults();
            if (originalResults.length === 0) {
                return '<option value="all">All Files</option>';
            }

            // Get unique filenames from our organized data, excluding hidden files
            const uniqueFiles = [...new Set(originalResults.map(issue => issue.fileName))]
                .filter(fileName => {
                    // Exclude hidden files like .DS_Store, .gitignore, etc.
                    return !utils.isHiddenFile(fileName);
                });
            console.log('EE Plugin Check Organizer: Unique files found (excluding hidden):', uniqueFiles);

            const files = ['<option value="all">All Files</option>'];
            uniqueFiles.forEach(function(fileName) {
                files.push(`<option value="${fileName}">${fileName}</option>`);
            });

            console.log('EE Plugin Check Organizer: Generated options:', files);
            return files.join('');
        },

        /**
         * Get HTML options for error type dropdown
         */
        getErrorTypeOptionsHtml: function(hasResults) {
            const resultsParser = window.EEPluginCheckOrganizer.ResultsParser;

            console.log('EE Plugin Check Organizer: Getting error type options, hasResults:', hasResults);

            if (!hasResults) {
                return '<option value="all">All Error Types</option>';
            }

            const originalResults = resultsParser.getAllResults();
            if (originalResults.length === 0) {
                return '<option value="all">All Error Types</option>';
            }

            // Get unique error types from our organized data
            const typeCounts = {};
            originalResults.forEach(issue => {
                typeCounts[issue.type] = (typeCounts[issue.type] || 0) + 1;
            });

            const errorTypes = ['<option value="all">All Error Types</option>'];
            Object.keys(typeCounts).sort().forEach(function(errorType) {
                errorTypes.push(`<option value="${errorType}">${errorType} (${typeCounts[errorType]})</option>`);
            });

            console.log('EE Plugin Check Organizer: Generated error type options:', errorTypes);
            return errorTypes.join('');
        },

        /**
         * Get HTML options for error code dropdown
         * @param {boolean} hasResults - Whether results are available
         * @param {Array} filteredData - Optional filtered data to use instead of originalResults
         */
        getErrorCodeOptionsHtml: function(hasResults, filteredData = null) {
            const resultsParser = window.EEPluginCheckOrganizer.ResultsParser;

            console.log('EE Plugin Check Organizer: Getting error code options, hasResults:', hasResults);

            if (!hasResults) {
                return '<option value="all">All Error Codes</option>';
            }

            const originalResults = resultsParser.getAllResults();
            if (originalResults.length === 0) {
                return '<option value="all">All Error Codes</option>';
            }

            // Use filtered data if provided, otherwise use original results
            const dataToUse = filteredData || originalResults;

            // Get unique error codes from the data
            const codeCounts = {};
            dataToUse.forEach(issue => {
                if (issue.code) {
                    codeCounts[issue.code] = (codeCounts[issue.code] || 0) + 1;
                }
            });

            const errorCodes = ['<option value="all">All Error Codes</option>'];
            Object.keys(codeCounts).sort().forEach(function(errorCode) {
                const count = codeCounts[errorCode];
                const displayCode = errorCode.length > 40 ? errorCode.substring(0, 40) + '...' : errorCode;
                errorCodes.push(`<option value="${errorCode}" title="${errorCode}">${displayCode} (${count})</option>`);
            });

            console.log('EE Plugin Check Organizer: Generated error code options:', errorCodes);
            return errorCodes.join('');
        },

        /**
         * Update Error Code dropdown based on current File and Error Type filters
         */
        updateErrorCodeDropdown: function() {
            const utils = window.EEPluginCheckOrganizer.Utils;
            const resultsParser = window.EEPluginCheckOrganizer.ResultsParser;

            const selectedFile = $('#ee-file-filter').val();
            const selectedErrorType = $('#ee-error-type-filter').val();
            const selectedErrorCode = $('#ee-error-code-filter').val();
            const hideHiddenFiles = $('#ee-hide-hidden-files').is(':checked');

            // Get filtered data based on current File and Error Type selections
            let filteredData = resultsParser.getAllResults();

            if (selectedFile !== 'all') {
                filteredData = filteredData.filter(issue => issue.fileName === selectedFile);
            }

            if (selectedErrorType !== 'all') {
                filteredData = filteredData.filter(issue => issue.type === selectedErrorType);
            }

            // Filter out hidden files if checkbox is checked
            if (hideHiddenFiles) {
                filteredData = filteredData.filter(issue => {
                    return !utils.isHiddenFile(issue.fileName);
                });
            }

            // Generate new Error Code options based on filtered data
            const newErrorCodeOptions = this.getErrorCodeOptionsHtml(true, filteredData);

            // Update the dropdown
            const errorCodeDropdown = $('#ee-error-code-filter');
            errorCodeDropdown.html(newErrorCodeOptions);

            // Try to preserve the selected error code if it still exists in filtered data
            const availableCodes = filteredData.map(issue => {
                return issue.code;
            });
            const uniqueAvailableCodes = [...new Set(availableCodes)];

            if (selectedErrorCode && selectedErrorCode !== 'all' && uniqueAvailableCodes.includes(selectedErrorCode)) {
                errorCodeDropdown.val(selectedErrorCode);
            } else {
                errorCodeDropdown.val('all');
            }

            utils.debugLog('Updated Error Code dropdown with', uniqueAvailableCodes.length, 'available codes');
        },

        /**
         * Bind filter events
         */
        bindFilterEvents: function() {
            const self = this;

            // Dropdown change events - trigger filtering when any dropdown changes
            $(document).on('change', '#ee-file-filter', function() {
                self.updateErrorCodeDropdown();
                self.applyFilters();
            });

            $(document).on('change', '#ee-error-type-filter', function() {
                self.updateErrorCodeDropdown();
                self.applyFilters();
            });

            $(document).on('change', '#ee-error-code-filter', function() {
                self.applyFilters();
            });

            // Hidden files checkbox change event
            $(document).on('change', '#ee-hide-hidden-files', function() {
                self.updateErrorCodeDropdown();
                self.applyFilters();
            });

            // Export Go button event
            $(document).on('click', '#ee-export-go', function(event) {
                event.preventDefault();
                const selectedFormat = $('#ee-export-dropdown').val();
                if (selectedFormat && window.EEPluginCheckOrganizer.Export) {
                    window.EEPluginCheckOrganizer.Export.exportResults(selectedFormat);
                }
            });
        },

        /**
         * Apply combined filters based on all dropdown selections
         */
        applyFilters: function() {
            const config = window.EEPluginCheckOrganizer.Config;
            const utils = window.EEPluginCheckOrganizer.Utils;
            const resultsParser = window.EEPluginCheckOrganizer.ResultsParser;
            const sorting = window.EEPluginCheckOrganizer.Sorting;

            const selectedFile = $('#ee-file-filter').val();
            const selectedErrorType = $('#ee-error-type-filter').val();
            const selectedErrorCode = $('#ee-error-code-filter').val();
            const hideHiddenFiles = $('#ee-hide-hidden-files').is(':checked');

            console.log('EE Plugin Check Organizer: Applying filters - File:', selectedFile, 'Error Type:', selectedErrorType, 'Error Code:', selectedErrorCode, 'Hide Hidden:', hideHiddenFiles);

            // Remove any existing filtered results
            $('#ee-filtered-results').remove();

            // Always hide original results when using the organizer - we'll show our organized version
            $(config.SELECTORS.RESULTS_CONTAINER).hide();

            // Filter issues based on all criteria
            let filteredIssues = resultsParser.getAllResults();

            if (selectedFile !== 'all') {
                filteredIssues = filteredIssues.filter(issue => issue.fileName === selectedFile);
            }

            if (selectedErrorType !== 'all') {
                filteredIssues = filteredIssues.filter(issue => issue.type === selectedErrorType);
            }

            if (selectedErrorCode !== 'all') {
                filteredIssues = filteredIssues.filter(issue => {
                    return issue.code === selectedErrorCode;
                });
            }

            // Filter out hidden files if checkbox is checked
            if (hideHiddenFiles) {
                filteredIssues = filteredIssues.filter(issue => {
                    return !utils.isHiddenFile(issue.fileName);
                });
            }

            console.log('EE Plugin Check Organizer: Found', filteredIssues.length, 'filtered issues');

            // Apply sorting if available
            if (sorting) {
                filteredIssues = sorting.applySorting(filteredIssues);
            }

            if (filteredIssues.length === 0) {
                const noResultsHtml = '<div id="ee-filtered-results"><div class="notice notice-info"><p>No issues match the current filter criteria.</p></div></div>';
                $(config.SELECTORS.RESULTS_CONTAINER).after(noResultsHtml);
                return;
            }

            // Create tables grouped by file
            const filteredHTML = this.createFilteredResultsByFile(filteredIssues, selectedFile, selectedErrorType, selectedErrorCode);
            $(config.SELECTORS.RESULTS_CONTAINER).after(filteredHTML);
        },

        /**
         * Create filtered results grouped by file
         */
        createFilteredResultsByFile: function(issues, selectedFile, selectedErrorType) {
            let html = '<div id="ee-filtered-results">';

            // Group issues by file
            const fileGroups = {};
            issues.forEach(function(issue) {
                if (!fileGroups[issue.fileName]) {
                    fileGroups[issue.fileName] = [];
                }
                fileGroups[issue.fileName].push(issue);
            });

            // Create a table for each file that has issues
            Object.keys(fileGroups).sort().forEach(function(fileName) {
                const fileIssues = fileGroups[fileName];

                html += '<h4>FILE: ' + fileName + '</h4>';
                html += '<table class="widefat striped plugin-check__results-table">';
                html += '<thead>';
                html += '<tr>';
                html += '<th scope="col">Line</th>';
                html += '<th scope="col">Column</th>';
                html += '<th scope="col">Type</th>';
                html += '<th scope="col">Code</th>';
                html += '<th scope="col">Message</th>';
                html += '</tr>';
                html += '</thead>';
                html += '<tbody>';

                fileIssues.forEach(function(issue) {
                    html += '<tr>';
                    html += '<td>' + issue.line + '</td>';
                    html += '<td>' + issue.column + '</td>';
                    html += '<td>' + issue.type + '</td>';
                    html += '<td>' + issue.code + '</td>';
                    html += '<td>' + issue.message + '</td>';
                    html += '</tr>';
                });

                html += '</tbody>';
                html += '</table>';
                html += '<br>';
            });

            html += '</div>';
            return $(html);
        },

        /**
         * Get currently displayed results for export
         */
        getCurrentlyDisplayedResults: function() {
            const utils = window.EEPluginCheckOrganizer.Utils;
            const resultsParser = window.EEPluginCheckOrganizer.ResultsParser;

            const selectedFile = $('#ee-file-filter').val();
            const selectedErrorType = $('#ee-error-type-filter').val();
            const selectedErrorCode = $('#ee-error-code-filter').val();
            const hideHiddenFiles = $('#ee-hide-hidden-files').is(':checked');

            let results = resultsParser.getAllResults();

            // Apply the same filters as the display
            if (selectedFile !== 'all') {
                results = results.filter(issue => issue.fileName === selectedFile);
            }

            if (selectedErrorType !== 'all') {
                results = results.filter(issue => issue.type === selectedErrorType);
            }

            if (selectedErrorCode !== 'all') {
                results = results.filter(issue => issue.code === selectedErrorCode);
            }

            if (hideHiddenFiles) {
                results = results.filter(issue => !utils.isHiddenFile(issue.fileName));
            }

            utils.debugLog('getCurrentlyDisplayedResults returning', results.length, 'results');
            return results;
        }
    };

})(jQuery);