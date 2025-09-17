/**
 * EE Plugin Check Organizer
 * JavaScript functionality for filtering Plugin Check results
 */

(function($) {
    'use strict';

    let filterInterface = null;
    let originalResults = [];
    let allFileBlocks = [];

    /**
     * Initialize the Plugin Check Organizer
     */
    window.eePluginCheckOrganizerInit = function() {
        console.log('EE Plugin Check Organizer: Init function called');

        // Check if we're on a Plugin Check page
        const categoriesTable = $('#plugin-check__categories');
        console.log('EE Plugin Check Organizer: Categories table found:', categoriesTable.length > 0);

        if (categoriesTable.length === 0) {
            console.log('EE Plugin Check Organizer: No categories table found, exiting');
            return;
        }

        // Create and insert filter interface
        createFilterInterface();

        // Bind events
        bindFilterEvents();

        // Watch for the "Checks complete" notice to appear
        watchForCheckComplete();

        // Add utility functions to the global scope
        window.eePluginCheckOrganizer = {
            refreshResults: refreshResults,
            testScan: function() {
                console.log('Manual test scan triggered');
                storeOriginalResults();
            }
        };

        console.log('EE Plugin Check Organizer: Initialization complete');
    };

    /**
     * Watch for the "Checks complete" notice to appear
     */
    function watchForCheckComplete() {
        console.log('EE Plugin Check Organizer: Setting up check complete watcher');

        // Use MutationObserver to watch for the completion notice
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) {
                        // Check if this node or any of its children contains the completion notice
                        const $node = $(node);
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

                            // Stop watching once we've detected completion
                            observer.disconnect();
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
                        line: row.find('td[data-label="Line"]').text().trim(),
                        column: row.find('td[data-label="Column"]').text().trim(),
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

        console.log('EE Plugin Check Organizer: Stored', originalResults.length, 'issues from', allFileBlocks.length, 'files');

        // Create debug output
        createDebugOutput();
    }

    /**
     * Create debug output showing what data we found
     */
    function createDebugOutput() {
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

        console.log('EE Plugin Check Organizer: Creating filter interface');

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
                    <h3>🔍 Plugin Check Organizer</h3>
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

        // Get unique filenames from our organized data
        const uniqueFiles = [...new Set(originalResults.map(issue => issue.fileName))];
        console.log('EE Plugin Check Organizer: Unique files found:', uniqueFiles);

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

})(jQuery);