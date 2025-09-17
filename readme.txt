=== EE Plugin Check Organizer ===
Contributors: elementengage
Tags: plugin-check, development, debugging, organization, filtering
Requires at least: 5.0
Tested up to: 6.3
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Enhance the WordPress Plugin Check tool with powerful filtering and organization capabilities.

== Description ==

**EE Plugin Check Organizer** is a developer-focused plugin that enhances the native WordPress Plugin Check tool by adding advanced filtering and organization capabilities to the results page.

= Key Features =

* **Triple Dropdown Filtering** - Three independent dropdown filters for precise result organization
* **File-Based Filtering** - Filter results by specific files in your plugin
* **Error Type Filtering** - Filter by error severity (ERROR, WARNING, INFO)
* **Error Code Filtering** - Filter by specific WordPress coding standard error codes
* **Real-time Results** - Instant filtering as you select different options
* **WordPress Admin Integration** - Seamlessly integrates with the existing Plugin Check interface
* **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
* **No Database Changes** - Works entirely with the existing Plugin Check DOM structure

= How It Works =

This plugin works by enhancing the existing Plugin Check tool results page with a powerful triple dropdown filtering interface. It doesn't modify the Plugin Check tool itself, but rather adds a layer of organization on top of the results.

When you run a plugin check, you'll see three dropdown filters above the results that allow you to:

1. **Filter by File** - Select a specific file from the dropdown to see only results from that file
2. **Filter by Error Type** - Choose ERROR, WARNING, or INFO to see only that severity level
3. **Filter by Error Code** - Select specific WordPress coding standard error codes
4. **Combine Filters** - Use multiple dropdowns together for precise filtering
5. **Clear Filters** - Select "All Files", "All Types", or "All Codes" to reset individual filters

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

1. The triple dropdown filter interface above Plugin Check results
2. File filter dropdown showing available files
3. Error type filter dropdown (ERROR, WARNING, INFO)
4. Error code filter dropdown with WordPress coding standards
5. Combined filtering in action showing filtered results
6. Mobile-responsive filter layout

== Changelog ==

= 1.0.0 =
* Initial release
* Triple dropdown filtering system (File, Error Type, Error Code)
* WordPress core admin table styling integration
* Responsive design implementation
* Independent and combinable filter functionality
* Debug mode for development and troubleshooting
* Mobile optimization

== Upgrade Notice ==

= 1.0.0 =
Initial release of EE Plugin Check Organizer. Adds powerful triple dropdown filtering capabilities to the WordPress Plugin Check tool.

== Developer Notes ==

= Hooks and Filters =

This plugin uses the following WordPress hooks:
* `admin_enqueue_scripts` - To load JavaScript and CSS on Plugin Check pages
* `admin_footer` - To initialize the filtering interface

= JavaScript API =

The plugin exposes a global JavaScript object `window.eePluginCheckOrganizer` with the following methods:
* `applyFilters()` - Applies current filter selections to results
* `resetFilters()` - Resets all filters to show all results
* `debugLog(message)` - Logs debug messages when debug mode is enabled

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