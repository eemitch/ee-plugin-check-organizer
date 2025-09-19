/**
 * EE Plugin Check Organizer - Results Parser
 * Data parsing, storage, and management functionality
 */

(function($) {
    'use strict';

    // Create namespace if it doesn't exist
    window.EEPluginCheckOrganizer = window.EEPluginCheckOrganizer || {};

    /**
     * Results Parser and Data Manager
     */
    window.EEPluginCheckOrganizer.ResultsParser = {
        // Data storage
        originalResults: [],
        allFileBlocks: [],
        observer: null,

        /**
         * Initialize the results parser
         */
        init: function() {
            this.watchForCheckComplete();
        },

        /**
         * Watch for the "Checks complete" notice to appear
         */
        watchForCheckComplete: function() {
            const self = this;
            const utils = window.EEPluginCheckOrganizer.Utils;

            console.log('EE Plugin Check Organizer: Setting up check complete watcher');

            // Disconnect existing observer if present
            if (this.observer) {
                this.observer.disconnect();
            }

            // Use MutationObserver to watch for both start and completion
            this.observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) {
                            const $node = $(node);

                            // Check for Plugin Check starting
                            if ($node.find('#plugin-check__results').length > 0 || $node.attr('id') === 'plugin-check__results') {
                                console.log('EE Plugin Check Organizer: Plugin Check starting, resetting interface');
                                self.resetData();
                            }

                            // Check for completion notice
                            const completionNotice = $node.find('.notice p').filter(function() {
                                const text = $(this).text();
                                return text.includes('checks complete') || text.includes('Checks complete');
                            });

                            if (completionNotice.length > 0) {
                                console.log('EE Plugin Check Organizer: Checks complete notice found, refreshing results');
                                setTimeout(function() {
                                    self.refreshResults();
                                }, 500);
                            }
                        }
                    });
                });
            });

            // Watch the entire document for changes
            this.observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            console.log('EE Plugin Check Organizer: Check complete watcher active');
        },

        /**
         * Reset data when a new Plugin Check starts
         */
        resetData: function() {
            console.log('EE Plugin Check Organizer: Resetting data for new check');

            // Clear previous data
            this.originalResults = [];
            this.allFileBlocks = [];

            // Remove any debug output
            $('#ee-debug-output').remove();
        },

        /**
         * Refresh results data when new results are loaded
         */
        refreshResults: function() {
            const config = window.EEPluginCheckOrganizer.Config;
            const utils = window.EEPluginCheckOrganizer.Utils;

            console.log('EE Plugin Check Organizer: Refreshing results');

            // Check for results more thoroughly
            const resultsContainer = $(config.SELECTORS.RESULTS_CONTAINER);
            const hasResults = resultsContainer.length > 0 && resultsContainer.find('h4').length > 0;

            console.log('EE Plugin Check Organizer: Results container found:', resultsContainer.length > 0);
            console.log('EE Plugin Check Organizer: H4 elements found:', resultsContainer.find('h4').length);

            if (hasResults) {
                this.storeOriginalResults();

                // Notify other modules that results are available
                if (window.EEPluginCheckOrganizer.Interface) {
                    window.EEPluginCheckOrganizer.Interface.enableInterface();
                }
            } else {
                console.log('EE Plugin Check Organizer: No results found yet');
            }
        },

        /**
         * Store original results for filtering
         */
        storeOriginalResults: function() {
            const config = window.EEPluginCheckOrganizer.Config;
            const utils = window.EEPluginCheckOrganizer.Utils;
            const resultsContainer = $(config.SELECTORS.RESULTS_CONTAINER);

            // Clear previous data
            this.allFileBlocks = [];
            this.originalResults = [];

            let issueId = 1; // Counter for unique IDs

            // Find all file blocks (h4 + table + br combinations)
            resultsContainer.find('h4').each(function() {
                const $fileHeader = $(this);
                const fileName = $fileHeader.text().replace('FILE: ', '');

                utils.debugLog('Processing file:', fileName);

                const fileBlock = {
                    fileName: fileName,
                    header: $fileHeader,
                    table: null,
                    issues: []
                };

                // Find the table that follows this h4
                let $next = $fileHeader.next();
                while ($next.length > 0 && !$next.is('h4')) {
                    if ($next.is('table')) {
                        fileBlock.table = $next;

                        // Parse table rows
                        $next.find('tbody tr').each(function() {
                            const $row = $(this);
                            const cells = $row.find('td');

                            if (cells.length >= 5) {
                                const issue = {
                                    id: issueId++,
                                    fileName: fileName,
                                    line: parseInt($(cells[0]).text()) || 0,
                                    column: parseInt($(cells[1]).text()) || 0,
                                    type: $(cells[2]).text().trim(),
                                    code: $(cells[3]).text().trim(),
                                    message: $(cells[4]).text().trim(),
                                    element: $row
                                };

                                fileBlock.issues.push(issue);
                                this.originalResults.push(issue);
                            }
                        }.bind(this));
                        break;
                    }
                    $next = $next.next();
                }

                this.allFileBlocks.push(fileBlock);
            }.bind(this));

            utils.debugLog('Stored', this.originalResults.length, 'issues from', this.allFileBlocks.length, 'files');

            // Create debug output
            if (config.DEBUG_MODE) {
                this.createDebugOutput();
            }

            // Update scan summary
            if (window.EEPluginCheckOrganizer.Interface) {
                window.EEPluginCheckOrganizer.Interface.updateScanSummary();
            }
        },

        /**
         * Create debug output showing what data we found
         */
        createDebugOutput: function() {
            const config = window.EEPluginCheckOrganizer.Config;

            // Only run in debug mode
            if (!config.DEBUG_MODE) return;

            // Remove any existing debug output
            $('#ee-debug-output').remove();

            // Create simple raw output like print_r
            let debugHtml = '<div id="ee-debug-output" style="margin: 20px 0; padding: 15px; background: #f9f9f9; border: 1px solid #ddd; font-family: monospace; white-space: pre-wrap; font-size: 12px;">';
            debugHtml += 'originalResults Array (' + this.originalResults.length + ' items):\\n\\n';
            debugHtml += JSON.stringify(this.originalResults.map(function(issue) {
                return {
                    id: issue.id,
                    fileName: issue.fileName,
                    line: issue.line,
                    column: issue.column,
                    type: issue.type,
                    code: issue.code,
                    message: issue.message.substring(0, 50) + '...'
                };
            }), null, 2);
            debugHtml += '</div>';

            // Insert debug output after the results container
            const resultsContainer = $(config.SELECTORS.RESULTS_CONTAINER);
            if (resultsContainer.length > 0) {
                resultsContainer.after(debugHtml);
            } else {
                $('body').append(debugHtml);
            }

            console.log('originalResults:', this.originalResults);
        },

        /**
         * Get all results
         */
        getAllResults: function() {
            return this.originalResults;
        },

        /**
         * Get all file blocks
         */
        getAllFileBlocks: function() {
            return this.allFileBlocks;
        },

        /**
         * Cleanup observer
         */
        cleanup: function() {
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }
        }
    };

})(jQuery);