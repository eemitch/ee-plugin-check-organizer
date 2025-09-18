/**
 * EE Plugin Check Organizer
 * JavaScript functionality for filtering Plugin Check results
 *
 * DEBUG MODE: Set DEBUG_MODE to false for production release
 * When DEBUG_MODE is true:
 * - Console logging is enabled
 * - Raw array output is displayed below results
 * - testScan() function is available globally
 */

(function($) {
    'use strict';

    // Debug Mode - Set to false for production
    const DEBUG_MODE = true;

    let filterInterface = null;
    let originalResults = [];
    let allFileBlocks = [];
    let currentSort = { field: 'line', direction: 'asc' }; // Default sorting by line number

    /**
     * Debug console logging - only when DEBUG_MODE is true
     */
    function debugLog(...args) {
        if (DEBUG_MODE) {
            console.log('EE Plugin Check Organizer:', ...args);
        }
    }

    /**
     * Initialize the Plugin Check Organizer
     */
    window.eePluginCheckOrganizerInit = function() {
        debugLog('Init function called');

        // Check if we're on a Plugin Check page
        const categoriesTable = $('#plugin-check__categories');
        debugLog('Categories table found:', categoriesTable.length > 0);

        if (categoriesTable.length === 0) {
            debugLog('No categories table found, exiting');
            return;
        }

        // Create and insert filter interface
        createFilterInterface();

        // Bind events
        bindFilterEvents();

        // Watch for the "Checks complete" notice to appear
        watchForCheckComplete();

        // Watch for "Check It!" button clicks to reset interface immediately
        $(document).on('click', '#plugin-check-form input[type="submit"]', function() {
            console.log('EE Plugin Check Organizer: Check It button clicked, resetting interface');
            resetInterface();
        });

        // Add utility functions to the global scope
        window.eePluginCheckOrganizer = {
            refreshResults: refreshResults,
            exportResults: exportResults
        };

        // Add debug functions only in debug mode
        if (DEBUG_MODE) {
            window.eePluginCheckOrganizer.testScan = function() {
                debugLog('Manual test scan triggered');
                storeOriginalResults();
            };
            window.eePluginCheckOrganizer.debugMode = true;
            window.eePluginCheckOrganizer.exportCSV = function() { exportResults('csv'); };
            window.eePluginCheckOrganizer.exportJSON = function() { exportResults('json'); };
            window.eePluginCheckOrganizer.exportTXT = function() { exportResults('txt'); };
            window.eePluginCheckOrganizer.setExportFormat = function(format) {
                $('#ee-export-dropdown').val(format);
                debugLog('Export format set to:', format);
            };
            window.eePluginCheckOrganizer.sortByLineAsc = function() { applySortFromDropdown('line', 'asc'); };
            window.eePluginCheckOrganizer.sortByLineDesc = function() { applySortFromDropdown('line', 'desc'); };
            window.eePluginCheckOrganizer.sortByTypeAsc = function() { applySortFromDropdown('type', 'asc'); };
            window.eePluginCheckOrganizer.sortByTypeDesc = function() { applySortFromDropdown('type', 'desc'); };
            window.eePluginCheckOrganizer.clearSort = function() {
                currentSort = { field: 'line', direction: 'asc' };
                $('#ee-sort-dropdown').val('line-asc');
                applyFilters();
            };
            debugLog('Debug mode enabled - testScan(), export, and sort functions available');
        }

        debugLog('Initialization complete');
    };

    /**
     * Watch for the "Checks complete" notice to appear
     */
    function watchForCheckComplete() {
        console.log('EE Plugin Check Organizer: Setting up check complete watcher');

        // Use MutationObserver to watch for both start and completion
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) {
                        const $node = $(node);

                        // Check for Plugin Check starting (results being cleared)
                        if ($node.find('#plugin-check__results').length > 0 || $node.attr('id') === 'plugin-check__results') {
                            console.log('EE Plugin Check Organizer: Plugin Check starting, resetting interface');
                            resetInterface();
                        }

                        // Check if this node or any of its children contains the completion notice
                        const completionNotice = $node.find('.notice p').filter(function() {
                            return $(this).text().includes('Checks complete');
                        });

                        // Also check if the node itself is the notice
                        if ($node.hasClass('notice') && $node.find('p').text().includes('Checks complete')) {
                            completionNotice.push($node[0]);
                        }

                        if (completionNotice.length > 0) {
                            console.log('EE Plugin Check Organizer: Check completion detected!');

                            // Give it a moment for all results to load, then refresh
                            setTimeout(function() {
                                refreshResults();
                            }, 500);

                            // Keep watching for subsequent checks - don't disconnect
                        }
                    }
                });
            });
        });

        // Watch the entire document for changes
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log('EE Plugin Check Organizer: Check complete watcher active');
    }

    /**
     * Reset the interface when a new Plugin Check starts
     */
    function resetInterface() {
        console.log('EE Plugin Check Organizer: Resetting interface for new check');

        // Clear previous data
        originalResults = [];
        allFileBlocks = [];
        currentSort = { field: 'line', direction: 'asc' }; // Reset to default line number sorting

        // Reset interface to disabled state
        if (filterInterface) {
            filterInterface.addClass('ee-disabled');
            filterInterface.find('select').prop('disabled', true);
            filterInterface.find('button').prop('disabled', true);

            // Reset dropdowns to default options
            filterInterface.find('#ee-file-filter').html('<option value="all">All Files</option>');
            filterInterface.find('#ee-error-type-filter').html('<option value="all">All Error Types</option>');
            filterInterface.find('#ee-error-code-filter').html('<option value="all">All Error Codes</option>');
            filterInterface.find('#ee-sort-dropdown').val('line-asc');
            filterInterface.find('#ee-export-dropdown').val('');

            // Hide scan summary
            filterInterface.find('#ee-scan-summary').hide();

            // Update description
            filterInterface.find('.ee-filter-description').text('Plugin check is running...');

            // Clear any filtered results
            filterInterface.find('#ee-filter-results').empty();
        }

        // Remove any debug output
        $('#ee-debug-output').remove();
    }

    /**
     * Refresh results data when new results are loaded
     */
    function refreshResults() {
        console.log('EE Plugin Check Organizer: Refreshing results');

        // Check for results more thoroughly
        const resultsContainer = $('#plugin-check__results');
        const hasResults = resultsContainer.length > 0 && resultsContainer.find('h4').length > 0;

        console.log('EE Plugin Check Organizer: Results container found:', resultsContainer.length > 0);
        console.log('EE Plugin Check Organizer: H4 elements found:', resultsContainer.find('h4').length);

        if (hasResults) {
            console.log('EE Plugin Check Organizer: Results detected, enabling interface');

            // Store results for filtering
            storeOriginalResults();

            // Enable the filter interface
            enableFilterInterface();

            // Update scan summary
            updateScanSummary();
        } else {
            console.log('EE Plugin Check Organizer: No results found yet');
        }
    }

    /**
     * Enable the filter interface when results are available
     */
    function enableFilterInterface() {
        if (!filterInterface) return;

        // Remove disabled class and attributes
        filterInterface.removeClass('ee-disabled');
        filterInterface.find('#ee-file-filter').prop('disabled', false);
        filterInterface.find('#ee-error-type-filter').prop('disabled', false);
        filterInterface.find('#ee-error-code-filter').prop('disabled', false);

        // Enable export dropdown and Go button
        filterInterface.find('#ee-export-dropdown').prop('disabled', false);
        filterInterface.find('#ee-export-go').prop('disabled', false);

        // Enable sort dropdown
        filterInterface.find('#ee-sort-dropdown').prop('disabled', false);

        // Update dropdown options with current data
        const fileOptions = getFileOptionsHtml(true);
        const errorTypeOptions = getErrorTypeOptionsHtml(true);
        const errorCodeOptions = getErrorCodeOptionsHtml(true);

        filterInterface.find('#ee-file-filter').html(fileOptions);
        filterInterface.find('#ee-error-type-filter').html(errorTypeOptions);
        filterInterface.find('#ee-error-code-filter').html(errorCodeOptions);

        // Update description
        filterInterface.find('.ee-filter-description').text('Filter results by file, error type, and error code:');

        console.log('EE Plugin Check Organizer: Filter interface enabled');
    }

    /**
     * Update the scan summary display with current results
     */
    function updateScanSummary() {
        const summaryElement = $('#ee-scan-summary');
        if (summaryElement.length === 0 || originalResults.length === 0) {
            return;
        }

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
            summaryHtml += `<span class="ee-summary-separator">•</span>`;
            const typeBreakdown = [];
            if (typeCounts.ERROR > 0) typeBreakdown.push(`<span class="ee-error-count">${typeCounts.ERROR} errors</span>`);
            if (typeCounts.WARNING > 0) typeBreakdown.push(`<span class="ee-warning-count">${typeCounts.WARNING} warnings</span>`);
            if (typeCounts.INFO > 0) typeBreakdown.push(`<span class="ee-info-count">${typeCounts.INFO} info</span>`);
            summaryHtml += typeBreakdown.join(', ');
        }

        summaryHtml += `</div>`;

        summaryElement.html(summaryHtml).show();
        debugLog('Scan summary updated:', { totalIssues, fileCount, typeCounts });
    }

    /**
     * Store original results for filtering
     */
    function storeOriginalResults() {
        const resultsContainer = $('#plugin-check__results');

        // Clear previous data
        allFileBlocks = [];
        originalResults = [];

        let issueId = 1; // Counter for unique IDs

        // Find all file blocks (h4 + table + br combinations)
        resultsContainer.find('h4').each(function() {
            const fileHeader = $(this);
            const fileName = fileHeader.text().replace('FILE: ', '');
            const table = fileHeader.next('table');
            const breakElement = table.next('br');

            if (table.length > 0) {
                const fileBlock = {
                    fileName: fileName,
                    header: fileHeader,
                    table: table,
                    break: breakElement,
                    rows: []
                };

                // Store individual rows with their data and unique IDs
                table.find('tbody tr.plugin-check__results-row').each(function() {
                    const row = $(this);
                    const issue = {
                        id: issueId++,
                        fileName: fileName,
                        line: parseInt(row.find('td[data-label="Line"]').text().trim()) || 0,
                        column: parseInt(row.find('td[data-label="Column"]').text().trim()) || 0,
                        type: row.find('td[data-label="Type"]').text().trim(),
                        code: row.find('td[data-label="Code"]').text().trim(),
                        message: row.find('td[data-label="Message"]').text().trim(),
                        element: row,
                        fileHeader: fileHeader,
                        fileTable: table,
                        fileBreak: breakElement
                    };

                    // Add to flat results array
                    originalResults.push(issue);

                    // Also add to file block for compatibility
                    fileBlock.rows.push(issue);
                });

                allFileBlocks.push(fileBlock);
            }
        });

        debugLog('Stored', originalResults.length, 'issues from', allFileBlocks.length, 'files');

        // Create debug output
        if (DEBUG_MODE) {
            createDebugOutput();
        }
    }

    /**
     * Create debug output showing what data we found
     */
    function createDebugOutput() {
        // Only run in debug mode
        if (!DEBUG_MODE) return;

        // Remove any existing debug output
        $('#ee-debug-output').remove();

        // Create simple raw output like print_r
        let debugHtml = '<div id="ee-debug-output" style="margin: 20px 0; padding: 15px; background: #f9f9f9; border: 1px solid #ddd; font-family: monospace; white-space: pre-wrap; font-size: 12px;">';
        debugHtml += 'originalResults Array (' + originalResults.length + ' items):\n\n';
        debugHtml += JSON.stringify(originalResults.map(function(issue) {
            return {
                id: issue.id,
                fileName: issue.fileName,
                line: issue.line,
                column: issue.column,
                type: issue.type,
                code: issue.code,
                message: issue.message.substring(0, 100) + (issue.message.length > 100 ? '...' : '')
            };
        }), null, 2);
        debugHtml += '</div>';

        // Insert debug output after the results container
        const resultsContainer = $('#plugin-check__results');
        if (resultsContainer.length > 0) {
            resultsContainer.after(debugHtml);
        } else if (filterInterface) {
            filterInterface.after(debugHtml);
        }

        console.log('originalResults:', originalResults);
    }

    /**
     * Create the filter interface
     */
    function createFilterInterface() {
        // Look for the categories table first
        const categoriesTable = $('#plugin-check__categories');

        if (categoriesTable.length === 0) {
            console.log('EE Plugin Check Organizer: Categories table not found');
            return;
        }

        debugLog('Creating filter interface');

        // Check if results exist to determine if inputs should be disabled
        const hasResults = $('#plugin-check__results').length > 0 && $('#plugin-check__results h4').length > 0;
        const disabledAttr = hasResults ? '' : 'disabled';
        const disabledClass = hasResults ? '' : 'ee-disabled';

        // Get list of files, error types, and error codes from results if available
        const fileOptions = getFileOptionsHtml(hasResults);
        const errorTypeOptions = getErrorTypeOptionsHtml(hasResults);
        const errorCodeOptions = getErrorCodeOptionsHtml(hasResults);

        filterInterface = $(`
            <div id="ee-plugin-check-filter" class="ee-filter-container ${disabledClass}">
                <div class="ee-filter-header">
                    <div class="ee-header-content">
                        <h3>🔍 Plugin Check Organizer</h3>
                        <div id="ee-scan-summary" class="ee-scan-summary" style="display: none;"></div>
                    </div>
                    <p class="ee-filter-description">
                        ${hasResults ? 'Filter results by file, error type, and error code:' : 'Run a plugin check to organize and filter results.'}
                    </p>
                </div>
                <div class="ee-filter-controls">
                    <div class="ee-filter-dropdown-group">
                        <label for="ee-file-filter" class="ee-dropdown-label">
                            <strong>📁 Filter by File:</strong>
                        </label>
                        <select id="ee-file-filter" class="ee-file-dropdown" ${disabledAttr}>
                            ${fileOptions}
                        </select>
                    </div>
                    <div class="ee-filter-dropdown-group">
                        <label for="ee-error-type-filter" class="ee-dropdown-label">
                            <strong>⚠️ Filter by Error Type:</strong>
                        </label>
                        <select id="ee-error-type-filter" class="ee-file-dropdown" ${disabledAttr}>
                            ${errorTypeOptions}
                        </select>
                    </div>
                    <div class="ee-filter-dropdown-group">
                        <label for="ee-error-code-filter" class="ee-dropdown-label">
                            <strong>🔧 Filter by Error Code:</strong>
                        </label>
                        <select id="ee-error-code-filter" class="ee-file-dropdown" ${disabledAttr}>
                            ${errorCodeOptions}
                        </select>
                    </div>
                </div>
                <div class="ee-sort-controls">
                    <div class="ee-filter-dropdown-group">
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
                    <div class="ee-filter-dropdown-group">
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
                <div id="ee-filter-results" class="ee-filter-results"></div>
            </div>
        `);

        // Simple positioning - just put it after the categories table
        categoriesTable.after(filterInterface);

        console.log('EE Plugin Check Organizer: Filter interface created and inserted');
    }

    /**
     * Get HTML options for file dropdown
     */
    function getFileOptionsHtml(hasResults) {
        console.log('EE Plugin Check Organizer: Getting file options, hasResults:', hasResults);

        if (!hasResults || originalResults.length === 0) {
            return '<option value="all">All Files</option>';
        }

        // Get unique filenames from our organized data, excluding hidden files
        const uniqueFiles = [...new Set(originalResults.map(issue => issue.fileName))]
            .filter(fileName => {
                // Extract just the filename part (after last slash) and check if it starts with .
                const actualFileName = fileName.split('/').pop();
                return !actualFileName.startsWith('.');
            });
        console.log('EE Plugin Check Organizer: Unique files found (excluding hidden):', uniqueFiles);

        const files = ['<option value="all">All Files</option>'];
        uniqueFiles.forEach(function(fileName) {
            const issueCount = originalResults.filter(issue => issue.fileName === fileName).length;
            files.push(`<option value="${fileName}">${fileName} (${issueCount} issues)</option>`);
        });

        console.log('EE Plugin Check Organizer: Generated options:', files);
        return files.join('');
    }

    /**
     * Get HTML options for error type dropdown
     */
    function getErrorTypeOptionsHtml(hasResults) {
        console.log('EE Plugin Check Organizer: Getting error type options, hasResults:', hasResults);

        if (!hasResults || originalResults.length === 0) {
            return '<option value="all">All Error Types</option>';
        }

        // Get unique error types from our organized data
        const typeCounts = {};
        originalResults.forEach(issue => {
            typeCounts[issue.type] = (typeCounts[issue.type] || 0) + 1;
        });

        const errorTypes = ['<option value="all">All Error Types</option>'];
        Object.keys(typeCounts).sort().forEach(function(errorType) {
            const count = typeCounts[errorType];
            errorTypes.push(`<option value="${errorType}">${errorType} (${count} issues)</option>`);
        });

        console.log('EE Plugin Check Organizer: Generated error type options:', errorTypes);
        return errorTypes.join('');
    }

    /**
     * Get HTML options for error code dropdown
     */
    function getErrorCodeOptionsHtml(hasResults) {
        console.log('EE Plugin Check Organizer: Getting error code options, hasResults:', hasResults);

        if (!hasResults || originalResults.length === 0) {
            return '<option value="all">All Error Codes</option>';
        }

        // Get unique error codes from our organized data
        const codeCounts = {};
        originalResults.forEach(issue => {
            // Extract the main error code (without subcomponents for cleaner grouping)
            const mainCode = issue.code.split('.').slice(0, 3).join('.');
            codeCounts[mainCode] = (codeCounts[mainCode] || 0) + 1;
        });

        const errorCodes = ['<option value="all">All Error Codes</option>'];
        Object.keys(codeCounts).sort().forEach(function(errorCode) {
            const count = codeCounts[errorCode];
            // Truncate long error codes for display
            const displayCode = errorCode.length > 40 ? errorCode.substring(0, 37) + '...' : errorCode;
            errorCodes.push(`<option value="${errorCode}">${displayCode} (${count} issues)</option>`);
        });

        console.log('EE Plugin Check Organizer: Generated error code options:', errorCodes);
        return errorCodes.join('');
    }    /**
     * Bind filter events
     */
    function bindFilterEvents() {
        if (!filterInterface) return;

        const fileDropdown = $('#ee-file-filter');
        const errorTypeDropdown = $('#ee-error-type-filter');
        const errorCodeDropdown = $('#ee-error-code-filter');

        // Dropdown change events - trigger filtering when any dropdown changes
        fileDropdown.on('change', applyFilters);
        errorTypeDropdown.on('change', applyFilters);
        errorCodeDropdown.on('change', applyFilters);

        // Sort dropdown change event
        $('#ee-sort-dropdown').on('change', function() {
            const sortValue = $(this).val();
            if (sortValue) {
                const [field, direction] = sortValue.split('-');
                applySortFromDropdown(field, direction);
            } else {
                // Reset to default sorting
                currentSort = { field: 'line', direction: 'asc' };
                applyFilters();
            }
        });

        // Export Go button event
        $('#ee-export-go').on('click', function(event) {
            event.preventDefault(); // Prevent default button behavior
            const exportFormat = $('#ee-export-dropdown').val();
            if (exportFormat) {
                exportResults(exportFormat);
            } else {
                alert('Please select an export format first.');
            }
        });
    }

    /**
     * Apply sort from dropdown selection
     */
    function applySortFromDropdown(field, direction) {
        debugLog('Applying sort from dropdown:', field, direction);

        currentSort.field = field;
        currentSort.direction = direction;

        // Re-apply filters with new sort order
        applyFilters();
    }

    /**
     * Apply sorting to filtered issues array
     */
    function applySorting(issues, sortField, direction) {
        return issues.slice().sort((a, b) => {
            let valueA, valueB;

            switch (sortField) {
                case 'line':
                    valueA = parseInt(a.line) || 0;
                    valueB = parseInt(b.line) || 0;
                    break;
                case 'type':
                    // Sort by severity: ERROR, WARNING, INFO
                    const typeOrder = { 'ERROR': 1, 'WARNING': 2, 'INFO': 3 };
                    valueA = typeOrder[a.type] || 999;
                    valueB = typeOrder[b.type] || 999;
                    break;
                case 'code':
                    valueA = a.code.toLowerCase();
                    valueB = b.code.toLowerCase();
                    break;
                case 'file':
                    valueA = a.fileName.toLowerCase();
                    valueB = b.fileName.toLowerCase();
                    break;
                default:
                    return 0;
            }

            // Handle numeric vs string comparison
            let comparison;
            if (typeof valueA === 'number' && typeof valueB === 'number') {
                comparison = valueA - valueB;
            } else {
                comparison = valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
            }

            // Apply direction
            return direction === 'asc' ? comparison : -comparison;
        });
    }

    /**
     * Apply combined filters based on all dropdown selections
     */
    function applyFilters() {
        const selectedFile = $('#ee-file-filter').val();
        const selectedErrorType = $('#ee-error-type-filter').val();
        const selectedErrorCode = $('#ee-error-code-filter').val();

        console.log('EE Plugin Check Organizer: Applying filters - File:', selectedFile, 'Error Type:', selectedErrorType, 'Error Code:', selectedErrorCode);

        // Remove any existing filtered results
        $('#ee-filtered-results').remove();

        if (selectedFile === 'all' && selectedErrorType === 'all' && selectedErrorCode === 'all') {
            // Show all original results
            $('#plugin-check__results').show();
            console.log('EE Plugin Check Organizer: Showing all results');
            return;
        }

        // Hide original results
        $('#plugin-check__results').hide();

        // Filter issues based on both criteria
        let filteredIssues = originalResults;

        if (selectedFile !== 'all') {
            filteredIssues = filteredIssues.filter(issue => issue.fileName === selectedFile);
        }

        if (selectedErrorType !== 'all') {
            filteredIssues = filteredIssues.filter(issue => issue.type === selectedErrorType);
        }

        if (selectedErrorCode !== 'all') {
            // Match the main error code (first 3 parts) like we do in the dropdown
            filteredIssues = filteredIssues.filter(issue => {
                const mainCode = issue.code.split('.').slice(0, 3).join('.');
                return mainCode === selectedErrorCode;
            });
        }

        console.log('EE Plugin Check Organizer: Found', filteredIssues.length, 'filtered issues');

        // Apply sorting if a sort field is selected
        if (currentSort.field) {
            filteredIssues = applySorting(filteredIssues, currentSort.field, currentSort.direction);
            debugLog('Applied sorting by', currentSort.field, currentSort.direction);
        }

        if (filteredIssues.length === 0) {
            const noResults = $('<div id="ee-filtered-results" class="notice notice-info"><p>No issues found matching the selected criteria.</p></div>');
            $('#plugin-check__results').after(noResults);
            return;
        }

        // Create tables grouped by file
        const filteredHTML = createFilteredResultsByFile(filteredIssues, selectedFile, selectedErrorType, selectedErrorCode);
        $('#plugin-check__results').after(filteredHTML);
    }

    /**
     * Create filtered results grouped by file
     */
    function createFilteredResultsByFile(issues, selectedFile, selectedErrorType) {
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
                html += '<tr class="plugin-check__results-row">';
                html += '<td data-label="Line">' + issue.line + '</td>';
                html += '<td data-label="Column">' + issue.column + '</td>';
                html += '<td data-label="Type">' + issue.type + '</td>';
                html += '<td data-label="Code">' + issue.code + '</td>';
                html += '<td data-label="Message">' + issue.message + '</td>';
                html += '</tr>';
            });

            html += '</tbody>';
            html += '</table>';
            html += '<br>';
        });

        html += '</div>';
        return $(html);
    }

    /**
     * Apply file filter based on dropdown selection
     */
    function applyFileFilter(selectedFile) {
        console.log('EE Plugin Check Organizer: Filtering by file:', selectedFile);

        // Remove any existing filtered results
        $('#ee-filtered-results').remove();

        if (selectedFile === 'all') {
            // Show all original results
            $('#plugin-check__results').show();
            console.log('EE Plugin Check Organizer: Showing all files');
            return;
        }

        // Hide original results
        $('#plugin-check__results').hide();

        // Filter issues for selected file
        const filteredIssues = originalResults.filter(issue => issue.fileName === selectedFile);
        console.log('EE Plugin Check Organizer: Found', filteredIssues.length, 'issues for', selectedFile);

        if (filteredIssues.length === 0) {
            const noResults = $('<div id="ee-filtered-results" class="notice notice-info"><p>No issues found for ' + selectedFile + '</p></div>');
            $('#plugin-check__results').after(noResults);
            return;
        }

        // Create filtered results table using PCP structure
        const filteredHTML = createFilteredResultsTable(selectedFile, filteredIssues);
        $('#plugin-check__results').after(filteredHTML);
    }

    /**
     * Create a filtered results table using Plugin Check structure
     */
    function createFilteredResultsTable(fileName, issues) {
        let html = '<div id="ee-filtered-results">';
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

        issues.forEach(function(issue) {
            html += '<tr class="plugin-check__results-row">';
            html += '<td data-label="Line">' + issue.line + '</td>';
            html += '<td data-label="Column">' + issue.column + '</td>';
            html += '<td data-label="Type">' + issue.type + '</td>';
            html += '<td data-label="Code">' + issue.code + '</td>';
            html += '<td data-label="Message">' + issue.message + '</td>';
            html += '</tr>';
        });

        html += '</tbody>';
        html += '</table>';
        html += '<br>';
        html += '</div>';

        return $(html);
    }

    /**
     * Apply filter based on radio button selection
     */
    function applyFilter() {
        const selectedValue = $('.ee-radio-option input[type="radio"]:checked').val();
        console.log('EE Plugin Check Organizer: Filter applied:', selectedValue);

        if (selectedValue === 'all') {
            displayFilteredResults(allFileBlocks);
        } else {
            performFilter('', selectedValue);
        }
    }

    /**
     * Perform filtering based on query and optional type
     */
    function performFilter(query, filterType = null) {
        const lowercaseQuery = query.toLowerCase();
        let filteredBlocks = [];

        allFileBlocks.forEach(function(fileBlock) {
            let matchingRows = [];

            // Check if file name matches (if filtering by file or no specific type)
            const fileNameMatch = !filterType || filterType === 'file' ?
                fileBlock.fileName.toLowerCase().includes(lowercaseQuery) : false;

            // If file name matches, include all rows from this file
            if (fileNameMatch) {
                matchingRows = [...fileBlock.rows];
            } else {
                // Filter individual rows
                fileBlock.rows.forEach(function(row) {
                    let match = false;

                    switch (filterType) {
                        case 'type':
                            match = row.type.toLowerCase().includes(lowercaseQuery);
                            break;
                        case 'code':
                            match = row.code.toLowerCase().includes(lowercaseQuery);
                            break;
                        case 'file':
                            // Already handled above
                            break;
                        default:
                            // Search in all fields
                            match = row.type.toLowerCase().includes(lowercaseQuery) ||
                                   row.code.toLowerCase().includes(lowercaseQuery) ||
                                   row.message.toLowerCase().includes(lowercaseQuery);
                    }

                    if (match) {
                        matchingRows.push(row);
                    }
                });
            }

            if (matchingRows.length > 0) {
                filteredBlocks.push({
                    ...fileBlock,
                    rows: matchingRows
                });
            }
        });

        displayFilteredResults(filteredBlocks, query);
    }

    /**
     * Display filtered results
     */
    function displayFilteredResults(filteredBlocks, filterType) {
        const resultsContainer = $('#plugin-check__results');

        // Hide original results
        resultsContainer.hide();

        // Clear previous filtered results
        $('#ee-filter-results').empty();

        if (filteredBlocks.length === 0) {
            let message = 'No results found for the selected filter.';
            switch (filterType) {
                case 'errors':
                    message = 'No errors found! Your plugin looks good.';
                    break;
                case 'warnings':
                    message = 'No warnings found.';
                    break;
                case 'security':
                    message = 'No security issues found.';
                    break;
            }

            $('#ee-filter-results').html(`
                <div class="notice notice-success">
                    <p>${message}</p>
                </div>
            `);
            return;
        }

        // Create filtered results HTML
        let filteredHTML = '<div class="ee-filtered-results">';

        filteredBlocks.forEach(function(fileBlock) {
            filteredHTML += `<h4>FILE: ${fileBlock.fileName}</h4>`;
            filteredHTML += '<table class="widefat striped plugin-check__results-table">';
            filteredHTML += `
                <thead>
                    <tr>
                        <td>Line</td>
                        <td>Column</td>
                        <td>Type</td>
                        <td>Code</td>
                        <td>Message</td>
                    </tr>
                </thead>
                <tbody>
            `;

            fileBlock.rows.forEach(function(row) {
                filteredHTML += `
                    <tr class="plugin-check__results-row">
                        <td data-label="Line">${row.line}</td>
                        <td data-label="Column">${row.column}</td>
                        <td data-label="Type">${row.type}</td>
                        <td data-label="Code">${row.code}</td>
                        <td data-label="Message">${row.message}</td>
                    </tr>
                `;
            });

            filteredHTML += '</tbody></table><br>';
        });

        filteredHTML += '</div>';

        $('#ee-filter-results').html(filteredHTML);
    }

    /**
     * Highlight matching text in results
     */
    function highlightMatch(text, query) {
        if (!query || query.length < 2) return text;

        const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
        return text.replace(regex, '<mark class="ee-highlight">$1</mark>');
    }

    /**
     * Show all results
     */
    function showAllResults() {
        $('#plugin-check__results').show();
        $('#ee-filter-results').empty();
        // Reset radio button to "all"
        $('input[name="ee-filter-type"][value="all"]').prop('checked', true);
    }

    /**
     * Export results in various formats
     */
    function exportResults(format) {
        debugLog('Exporting results in format:', format);

        // Get currently filtered results or all results if no filter applied
        let dataToExport = getCurrentlyDisplayedResults();

        if (dataToExport.length === 0) {
            alert('No results to export. Please run a plugin check first.');
            return;
        }

        // Generate filename with timestamp
        const now = new Date();
        const timestamp = now.getFullYear() + '-' +
                         String(now.getMonth() + 1).padStart(2, '0') + '-' +
                         String(now.getDate()).padStart(2, '0') + '_' +
                         String(now.getHours()).padStart(2, '0') + '-' +
                         String(now.getMinutes()).padStart(2, '0');

        let filename, content, mimeType;

        switch (format.toLowerCase()) {
            case 'csv':
                filename = `plugin-check-results_${timestamp}.csv`;
                content = generateCSV(dataToExport);
                mimeType = 'text/csv';
                break;
            case 'json':
                filename = `plugin-check-results_${timestamp}.json`;
                content = generateJSON(dataToExport);
                mimeType = 'application/json';
                break;
            case 'txt':
                filename = `plugin-check-results_${timestamp}.txt`;
                content = generateTXT(dataToExport);
                mimeType = 'text/plain';
                break;
            default:
                alert('Unknown export format: ' + format);
                return;
        }

        // Create and trigger download
        downloadFile(content, filename, mimeType);

        debugLog('Export completed:', filename);
    }

    /**
     * Get currently displayed results (filtered or all)
     */
    function getCurrentlyDisplayedResults() {
        const selectedFile = $('#ee-file-filter').val();
        const selectedErrorType = $('#ee-error-type-filter').val();
        const selectedErrorCode = $('#ee-error-code-filter').val();

        let results;

        // If no filters applied, return all results
        if ((selectedFile === 'all' || !selectedFile) &&
            (selectedErrorType === 'all' || !selectedErrorType) &&
            (selectedErrorCode === 'all' || !selectedErrorCode)) {
            results = originalResults;
        } else {
            // Apply filters to get current results
            results = originalResults.filter(function(issue) {
                let includeIssue = true;

                // File filter
                if (selectedFile && selectedFile !== 'all') {
                    includeIssue = includeIssue && (issue.fileName === selectedFile);
                }

                // Error type filter
                if (selectedErrorType && selectedErrorType !== 'all') {
                    includeIssue = includeIssue && (issue.type === selectedErrorType);
                }

                // Error code filter
                if (selectedErrorCode && selectedErrorCode !== 'all') {
                    // Match the main error code (first 3 parts) like we do in the dropdown
                    const mainCode = issue.code.split('.').slice(0, 3).join('.');
                    includeIssue = includeIssue && (mainCode === selectedErrorCode);
                }

                return includeIssue;
            });
        }

        // Apply sorting if active
        if (currentSort.field) {
            results = applySorting(results, currentSort.field, currentSort.direction);
        }

        return results;
    }

    /**
     * Generate CSV format
     */
    function generateCSV(data) {
        let csv = 'File,Line,Column,Type,Code,Message\n';

        data.forEach(function(issue) {
            // Escape CSV fields that contain commas or quotes
            const fields = [
                escapeCSVField(issue.fileName),
                escapeCSVField(issue.line),
                escapeCSVField(issue.column),
                escapeCSVField(issue.type),
                escapeCSVField(issue.code),
                escapeCSVField(issue.message)
            ];
            csv += fields.join(',') + '\n';
        });

        return csv;
    }

    /**
     * Generate JSON format
     */
    function generateJSON(data) {
        const exportData = {
            exportedAt: new Date().toISOString(),
            totalIssues: data.length,
            filters: {
                file: $('#ee-file-filter').val() || 'all',
                errorType: $('#ee-error-type-filter').val() || 'all',
                errorCode: $('#ee-error-code-filter').val() || 'all'
            },
            issues: data.map(function(issue) {
                return {
                    id: issue.id,
                    fileName: issue.fileName,
                    line: parseInt(issue.line) || 0,
                    column: parseInt(issue.column) || 0,
                    type: issue.type,
                    code: issue.code,
                    message: issue.message
                };
            })
        };

        return JSON.stringify(exportData, null, 2);
    }

    /**
     * Generate TXT format
     */
    function generateTXT(data) {
        let txt = 'WordPress Plugin Check Results Export\n';
        txt += '=====================================\n\n';
        txt += `Exported: ${new Date().toLocaleString()}\n`;
        txt += `Total Issues: ${data.length}\n\n`;

        // Group by file
        const fileGroups = {};
        data.forEach(function(issue) {
            if (!fileGroups[issue.fileName]) {
                fileGroups[issue.fileName] = [];
            }
            fileGroups[issue.fileName].push(issue);
        });

        Object.keys(fileGroups).forEach(function(fileName) {
            txt += `FILE: ${fileName}\n`;
            txt += ''.padEnd(fileName.length + 6, '-') + '\n';

            fileGroups[fileName].forEach(function(issue) {
                txt += `Line ${issue.line}, Column ${issue.column}: [${issue.type}] ${issue.code}\n`;
                txt += `  ${issue.message}\n\n`;
            });
            txt += '\n';
        });

        return txt;
    }

    /**
     * Escape CSV field
     */
    function escapeCSVField(field) {
        if (typeof field !== 'string') {
            field = String(field);
        }

        // If field contains comma, quote, or newline, wrap in quotes and escape internal quotes
        if (field.includes(',') || field.includes('"') || field.includes('\n')) {
            return '"' + field.replace(/"/g, '""') + '"';
        }
        return field;
    }

    /**
     * Download file to user's computer
     */
    function downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up the blob URL
        window.URL.revokeObjectURL(url);
    }

})(jQuery);