/**
 * EE Plugin Check Organizer - Export System
 * Export functionality for filtered results in multiple formats
 */

(function($) {
    'use strict';

    // Create namespace if it doesn't exist
    window.EEPluginCheckOrganizer = window.EEPluginCheckOrganizer || {};

    /**
     * Export System
     */
    window.EEPluginCheckOrganizer.Export = {
        /**
         * Export results in various formats
         */
        exportResults: function(format) {
            const utils = window.EEPluginCheckOrganizer.Utils;
            const filters = window.EEPluginCheckOrganizer.Filters;

            utils.debugLog('Exporting results in format:', format);

            // Get currently filtered results or all results if no filter applied
            let dataToExport = [];
            if (filters) {
                dataToExport = filters.getCurrentlyDisplayedResults();
            }

            if (dataToExport.length === 0) {
                alert('No results to export. Please run a plugin check first.');
                return;
            }

            // Generate filename with timestamp
            const timestamp = utils.generateTimestamp();
            let filename, content, mimeType;

            switch (format.toLowerCase()) {
                case 'csv':
                    content = this.generateCSV(dataToExport);
                    filename = `plugin-check-results_${timestamp}.csv`;
                    mimeType = 'text/csv';
                    break;
                case 'json':
                    content = this.generateJSON(dataToExport);
                    filename = `plugin-check-results_${timestamp}.json`;
                    mimeType = 'application/json';
                    break;
                case 'txt':
                    content = this.generateTXT(dataToExport);
                    filename = `plugin-check-results_${timestamp}.txt`;
                    mimeType = 'text/plain';
                    break;
                default:
                    alert('Unsupported export format: ' + format);
                    return;
            }

            // Create and trigger download
            utils.downloadFile(content, filename, mimeType);

            utils.debugLog('Export completed:', filename);
        },

        /**
         * Generate CSV format
         */
        generateCSV: function(data) {
            const utils = window.EEPluginCheckOrganizer.Utils;

            let csv = 'File,Line,Column,Type,Code,Message\\n';

            data.forEach(function(issue) {
                csv += [
                    utils.escapeCSVField(issue.fileName),
                    utils.escapeCSVField(issue.line),
                    utils.escapeCSVField(issue.column),
                    utils.escapeCSVField(issue.type),
                    utils.escapeCSVField(issue.code),
                    utils.escapeCSVField(issue.message)
                ].join(',') + '\\n';
            });

            return csv;
        },

        /**
         * Generate JSON format
         */
        generateJSON: function(data) {
            const exportData = {
                exportedAt: new Date().toISOString(),
                totalIssues: data.length,
                filters: {
                    file: $('#ee-file-filter').val() || 'all',
                    errorType: $('#ee-error-type-filter').val() || 'all',
                    errorCode: $('#ee-error-code-filter').val() || 'all',
                    hideHiddenFiles: $('#ee-hide-hidden-files').is(':checked')
                },
                issues: data.map(function(issue) {
                    return {
                        fileName: issue.fileName,
                        line: issue.line,
                        column: issue.column,
                        type: issue.type,
                        code: issue.code,
                        message: issue.message
                    };
                })
            };

            return JSON.stringify(exportData, null, 2);
        },

        /**
         * Generate TXT format
         */
        generateTXT: function(data) {
            const utils = window.EEPluginCheckOrganizer.Utils;

            let txt = 'Plugin Check Results Export\\n';
            txt += '=================================\\n';
            txt += `Exported: ${new Date().toLocaleString()}\\n`;
            txt += `Total Issues: ${data.length}\\n\\n`;

            // Group by file
            const fileGroups = {};
            data.forEach(function(issue) {
                if (!fileGroups[issue.fileName]) {
                    fileGroups[issue.fileName] = [];
                }
                fileGroups[issue.fileName].push(issue);
            });

            Object.keys(fileGroups).sort().forEach(function(fileName) {
                txt += `FILE: ${fileName}\\n`;
                txt += '-'.repeat(fileName.length + 6) + '\\n';

                fileGroups[fileName].forEach(function(issue) {
                    txt += `Line ${issue.line}, Column ${issue.column}: [${issue.type}] ${issue.code}\\n`;
                    txt += `  ${issue.message}\\n\\n`;
                });

                txt += '\\n';
            });

            return txt;
        }
    };

})(jQuery);