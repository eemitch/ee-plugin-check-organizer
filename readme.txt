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

* **Real-time Search Filtering** - Filter Plugin Check results as you type
* **Multiple Filter Types** - Filter by file name, error type, or error code
* **Smart Highlighting** - Matching text is highlighted in filtered results
* **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
* **WordPress Admin Integration** - Seamlessly integrates with the existing Plugin Check interface
* **Accessibility Focused** - Built with accessibility best practices and keyboard navigation
* **No Database Changes** - Works entirely with the existing Plugin Check DOM structure

= How It Works =

This plugin works by enhancing the existing Plugin Check tool results page with a powerful filtering interface. It doesn't modify the Plugin Check tool itself, but rather adds a layer of organization on top of the results.

When you run a plugin check, you'll see a new filter interface above the results that allows you to:

1. **Search Everything** - Type in the main search box to filter across all result data
2. **Filter by File** - Click the "File Name" button to search only file names
3. **Filter by Error Type** - Click the "Error Type" button to search only error types (ERROR, WARNING, etc.)
4. **Filter by Error Code** - Click the "Error Code" button to search only error codes
5. **Clear Filters** - Use the "Show All" button or clear button to reset the view

= Use Cases =

* **Large Plugin Analysis** - Quickly find specific issues in plugins with many files
* **Error Type Focus** - Filter to see only ERRORs or only WARNINGs
* **Code Standard Review** - Search for specific error codes you want to address
* **File-Specific Issues** - Focus on problems in specific files or file types
* **Development Workflow** - Efficiently organize and prioritize plugin check results

= Technical Details =

* Works entirely with JavaScript DOM manipulation
* No server-side processing or database storage
* Compatible with all Plugin Check tool versions
* Preserves original Plugin Check functionality
* Lightweight and performance-optimized

== Installation ==

1. Upload the `ee-plugin-check-organizer` folder to the `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Navigate to Tools > Plugin Check to use the enhanced interface
4. Run a plugin check to see the new filtering capabilities

= Manual Installation =

1. Download the plugin files
2. Extract the files to your `/wp-content/plugins/ee-plugin-check-organizer/` directory
3. Activate the plugin in your WordPress admin panel
4. The filtering interface will automatically appear when using Plugin Check

== Frequently Asked Questions ==

= Does this plugin require the Plugin Check tool? =

Yes, this plugin enhances the WordPress Plugin Check tool. You need to have the Plugin Check plugin installed and activated for this organizer to work.

= Will this plugin slow down my site? =

No. The plugin only loads its scripts on Plugin Check pages and uses lightweight JavaScript for filtering. It has no impact on your site's front-end performance.

= Does this plugin store any data? =

No. This plugin works entirely with the DOM structure created by Plugin Check. It doesn't store any data in your database or create any additional database tables.

= Can I customize the filter interface? =

The plugin uses WordPress admin styling by default. You can add custom CSS to your admin theme to modify the appearance if needed.

= Is this plugin compatible with other Plugin Check extensions? =

Yes. This plugin works with the standard Plugin Check DOM structure and doesn't interfere with other extensions or modifications.

= What happens if Plugin Check updates and changes its structure? =

The plugin is designed to gracefully handle DOM changes. If the structure changes significantly, the filtering may not work, but it won't break Plugin Check functionality.

== Screenshots ==

1. The filter interface above Plugin Check results
2. Real-time filtering in action
3. Highlighted search results
4. Mobile-responsive filter controls
5. Different filter type buttons

== Changelog ==

= 1.0.0 =
* Initial release
* Real-time search filtering functionality
* Multiple filter types (file, error type, error code)
* Responsive design implementation
* WordPress admin styling integration
* Accessibility features
* Mobile optimization

== Upgrade Notice ==

= 1.0.0 =
Initial release of EE Plugin Check Organizer. Adds powerful filtering capabilities to the WordPress Plugin Check tool.

== Developer Notes ==

= Hooks and Filters =

This plugin uses the following WordPress hooks:
* `admin_enqueue_scripts` - To load JavaScript and CSS on Plugin Check pages
* `admin_footer` - To initialize the filtering interface

= JavaScript API =

The plugin exposes a global JavaScript object `window.eePluginCheckOrganizer` with the following methods:
* `clearFilter()` - Clears all active filters
* `filterByType(type)` - Filters results by error type
* `filterByCode(code)` - Filters results by error code
* `filterByFile(filename)` - Filters results by file name

= CSS Classes =

Key CSS classes for customization:
* `.ee-filter-container` - Main filter interface container
* `.ee-filter-input` - Search input field
* `.ee-filter-buttons` - Filter type buttons container
* `.ee-highlight` - Highlighted matching text
* `.ee-filtered-results` - Filtered results container

= Contributing =

This plugin is developed by Element Engage. For feature requests, bug reports, or contributions, please contact us through our website.

== Privacy ==

This plugin does not collect, store, or transmit any user data. All filtering operations happen locally in the browser using JavaScript.