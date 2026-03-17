=== EE Plugin Check Organizer ===
Contributors: eemitch
Tags: plugin-check, development, debugging, organization, filtering, export
Requires at least: 5.0
Tested up to: 6.3
Requires PHP: 7.4
Stable tag: 1.2.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Enhance the WordPress Plugin Check tool with powerful filtering, sorting, and export capabilities.

== Description ==

**EE Plugin Check Organizer** is a developer-focused plugin that enhances the native WordPress Plugin Check tool by adding advanced filtering and organization capabilities to the results page.

= Key Features =

* **Triple Dropdown Filtering** - File, Error Type, and Error Code filters
* **Folder Exclusion** - Checkbox list to exclude all issues from one or more folders simultaneously
* **Error Code Exclusion** - Checkbox list to exclude all issues matching one or more error codes simultaneously
* **JSON Export** - Export filtered and excluded results as a clean, annotated JSON file
* **Event-Driven Architecture** - Reliable jQuery polling for Plugin Check completion detection
* **Real-time Statistics** - Live stats panel showing "X of Y issues shown" with error/warning breakdown
* **File-Based Filtering** - Filter results by specific files in your plugin
* **Error Type Filtering** - Filter by error severity (ERROR, WARNING, INFO)
* **Error Code Filtering** - Filter by specific WordPress coding standard error codes
* **Dynamic Cascading Filters** - Smart filter updates based on available data
* **Real-time Results** - Instant filtering as you select different options
* **WordPress Admin Integration** - Seamlessly integrates with existing Plugin Check interface
* **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices

= How It Works =

This plugin works by enhancing the existing Plugin Check tool results page with a powerful triple dropdown filtering interface. It doesn't modify the Plugin Check tool itself, but rather adds a layer of organization on top of the results.

When you run a plugin check, you'll see three dropdown filters above the results that allow you to:

1. **Filter by File** - Select a specific file from the dropdown to see only results from that file
2. **Filter by Error Type** - Choose ERROR, WARNING, or INFO to see only that severity level
3. **Filter by Error Code** - Select specific WordPress coding standard error codes
4. **Exclude Folders** - Check one or more folders to remove all their issues from results
5. **Exclude Error Codes** - Check one or more error codes to suppress them across all files
6. **Combine Filters** - Use multiple dropdowns and exclusions together for precise filtering
7. **Clear Filters** - Select "All Files", "All Types", or "All Codes" to reset individual filters

The filters work independently and in combination, so you can filter by a specific file AND error type AND error code simultaneously for maximum precision.

= Use Cases =

* **Large Plugin Analysis** - Quickly isolate issues in specific files within complex plugins
* **Error Severity Review** - Focus on critical ERRORs vs. minor WARNINGs or INFO messages
* **Code Standard Compliance** - Filter by specific WordPress coding standard error codes
* **File-Specific Debugging** - Examine all issues within a particular file
* **Progressive Issue Resolution** - Work through errors systematically by type and severity
* **Development Workflow** - Efficiently organize and prioritize plugin check results

= Technical Details =

* Works entirely with JavaScript DOM manipulation using jQuery
* Event-driven jQuery polling for reliable Plugin Check completion detection
* No server-side processing or database storage
* Compatible with all Plugin Check tool versions
* Preserves original Plugin Check functionality
* Lightweight and performance-optimized
* Uses WordPress core admin table styling (widefat, striped classes)

== Installation ==

1. Upload the `ee-plugin-check-organizer` folder to the `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Navigate to Tools > Plugin Check to use the enhanced interface
4. Run a plugin check to see the three dropdown filters above the results

= Manual Installation =

1. Download the plugin files
2. Extract the files to your `/wp-content/plugins/ee-plugin-check-organizer/` directory
3. Activate the plugin in your WordPress admin panel
4. The triple dropdown filtering interface will automatically appear when using Plugin Check

== Frequently Asked Questions ==

= Does this plugin require the Plugin Check tool? =

Yes, this plugin enhances the WordPress Plugin Check tool. You need to have the Plugin Check plugin installed and activated for this organizer to work.

= Will this plugin slow down my site? =

No. The plugin only loads its scripts on Plugin Check pages and uses lightweight JavaScript for filtering. It has no impact on your site's front-end performance.

= Does this plugin store any data? =

No. This plugin works entirely with the DOM structure created by Plugin Check. It doesn't store any data in your database or create any additional database tables.

= Can I customize the filter interface? =

The plugin uses WordPress core admin styling (widefat and striped table classes) by default. You can add custom CSS to your admin theme to modify the appearance if needed.

= Is this plugin compatible with other Plugin Check extensions? =

Yes. This plugin works with the standard Plugin Check DOM structure and doesn't interfere with other extensions or modifications.

= What happens if Plugin Check updates and changes its structure? =

The plugin is designed to gracefully handle DOM changes. If the structure changes significantly, the filtering may not work, but it won't break Plugin Check functionality. The debug mode can be enabled for troubleshooting if needed.

== Screenshots ==

1. Standard Plugin Check interface before enhancement
2. Plugin selection dropdown in action
3. Enhanced interface with organizer panel and real-time statistics
4. Organized and filtered results view with export options

== Changelog ==

= 1.2.0 =
* Added folder exclusion - scrollable checkbox list to exclude all issues from one or more folders
* Added error code exclusion - scrollable checkbox list to suppress one or more error codes across all files
* Summary banner now shows "X of Y issues shown" in real time when exclusions reduce the result count
* Simplified export to a single "Export JSON" button (removed CSV and TXT formats)
* JSON export now opens with a human-readable _summary field describing active filters and exclusions
* JSON export file now correctly excludes items that were excluded in the UI (bug fix)
* Issue messages in JSON export are now sanitized: HTML stripped, whitespace collapsed, sentence spacing corrected

= 1.1.2 =
* Replaced MutationObserver with event-driven jQuery polling for more reliable detection
* Improved Plugin Check completion detection accuracy
* Enhanced error handling and graceful degradation
* Optimized performance with targeted polling approach
* Added comprehensive debug logging with eePCP: prefix for easy console filtering
* Better state management for multiple Plugin Check runs
* Improved compatibility across different WordPress environments

= 1.0.0 =
* Initial release
* Triple dropdown filtering system (File, Error Type, Error Code)
* WordPress core admin table styling integration
* Responsive design implementation
* Independent and combinable filter functionality
* Debug mode for development and troubleshooting
* Mobile optimization

== Upgrade Notice ==

= 1.2.0 =
New folder and error code exclusion checkboxes let you suppress entire categories of issues. Export simplified to JSON-only with a human-readable summary header. Bug fix: exported files now correctly reflect all active exclusions.

= 1.1.2 =
Major architecture improvement: Replaced MutationObserver with more reliable jQuery polling for better Plugin Check completion detection. Enhanced performance and compatibility.

= 1.0.0 =
Initial release of EE Plugin Check Organizer. Adds powerful triple dropdown filtering capabilities to the WordPress Plugin Check tool.

== Developer Notes ==

= Hooks and Filters =

This plugin uses standard WordPress hooks for admin-only loading:
* `admin_enqueue_scripts` - To load JavaScript and CSS on Plugin Check pages only
* `admin_footer` - To initialize the filtering interface

= CSS Classes =

Key CSS classes for customization:
* `.ee-filter-container` - Main filter interface container
* `.ee-filter-dropdown-group` - Individual dropdown filter groups
* `.ee-filter-label` - Dropdown labels
* `.ee-filter-dropdown` - Dropdown select elements
* `.ee-filtered-results` - Filtered results container

= Contributing =

This plugin is developed by Element Engage. For feature requests, bug reports, or contributions, please contact us through our website.

== Privacy ==

This plugin does not collect, store, or transmit any user data. All filtering operations happen locally in the browser using JavaScript.