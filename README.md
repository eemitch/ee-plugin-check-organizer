# EE Plugin Check (PCP) Organizer

[![WordPress Plugin](https://img.shields.io/badge/WordPress-Plugin-blue.svg)](https://wordpress.org)
[![License: GPL v2](https://img.shields.io/badge/License-GPL%20v2-blue.svg)](https://www.gnu.org/licenses/gpl-2.0)
[![Version](https://img.shields.io/badge/Version-1.0.0-green.svg)]()

**Enhance the WordPress Plugin Check tool with powerful filtering, sorting, and export capabilities.**

Transform your WordPress Plugin Check experience from overwhelming lists to organized, actionable insights. This plugin adds a sophisticated filtering interface that makes it easy to focus on what matters most in your plugin compliance review.

## 📸 Screenshots

### Interface Overview
![Clean Interface](screenshots/Screenshot-1.jpg)
*Clean, professional interface that integrates seamlessly with WordPress Plugin Check*

### Add Filter, Sorting Options and Export Features to PCP
![Results with Stats](screenshots/Screenshot-2.jpg)
*Live statistics display showing issues found, files affected, and error breakdown*

### Advanced Dynamic Filtering
![Dynamic Filtering](screenshots/Screenshot-3.jpg)
*Smart cascading filters - file and error type selections automatically update available options*

### Export Functionality
![Export Options](screenshots/Screenshot-4.jpg)
*Export filtered results in CSV, JSON, or TXT formats for team collaboration and analysis*

## � Features

- Optionally exclude system files (`.DS_Store`, `.gitignore`) from file dropdown

- Optional toggle to show/hide hidden file issues in results

### 🎯 **Non-Invasive DOM-Only Approach**

- Keeps your interface clean and focused on actual code files

- **Admin-only scope** - no frontend impact

- **Pure DOM manipulation** - works entirely with existing Plugin Check interface elements

- **No database changes** - zero impact on your WordPress database

- **No core modifications** - doesn't alter Plugin Check plugin files

- **Core styling integration** - leverages WordPress admin CSS classes (`widefat`, `striped`)

### 📈 **Advanced Sorting Options**

- **Line Number** - Default numeric sorting for logical code review flow

- **Error Type** - Group by severity (ERROR → WARNING → INFO)

### 🔍 **Smart Triple Filtering System**
- **File Filter** - Focus on specific plugin files
- **Error Type Filter** - Filter by ERROR, WARNING, or INFO severity
- **Error Code Filter** - Target specific WordPress coding standards violations

### 📊 **Dynamic Cascading Filters**
- Error code dropdown automatically updates based on your file and error type selections
- Only shows error codes that actually exist in your current filtered results
- Eliminates confusion from irrelevant options

### 🙈 **Hidden Files Management**
- Optionally exclude system files (`.DS_Store`, `.gitignore`) from file dropdown
- Optional toggle to show/hide hidden file issues in results
- Keeps your interface clean and focused on actual code files

### � **Advanced Sorting Options**
- **Line Number** - Default numeric sorting for logical code review flow
- **Error Type** - Group by severity (ERROR → WARNING → INFO)
- **Error Code** - Alphabetical sorting by WordPress coding standards
- **File Name** - Alphabetical file organization

### 📤 **Comprehensive Export System**
Export your filtered results in multiple formats:
- **CSV** - Perfect for spreadsheet analysis and sharing with teams
- **JSON** - Structured data for programmatic analysis and AI tools
- **TXT** - Human-readable format for documentation and reports

All exports include timestamps and active filter information.

### ⚡ **Performance & User Experience**
- **Real-time filtering** - Instant results as you change filters
- **Responsive design** - Works perfectly on desktop, tablet, and mobile
- **Non-invasive enhancement** - Never interferes with original Plugin Check functionality
- **Progressive enhancement** - Graceful degradation if JavaScript fails
- **Multi-check support** - Handles multiple Plugin Check runs in the same session

## 📋 Requirements

- **WordPress** 5.0 or higher
- **PHP** 7.4 or higher
- **Plugin Check Plugin** (official WordPress plugin)

## 🛠 Installation

### From GitHub Release

1. Download the latest release ZIP file from the [Releases page](../../releases)
2. In your WordPress admin, go to **Plugins → Add New → Upload Plugin**
3. Choose the downloaded ZIP file and click **Install Now**
4. Click **Activate Plugin**

### Manual Installation

1. Download or clone this repository
2. Upload the `ee-plugin-check-organizer` folder to `/wp-content/plugins/`
3. Activate the plugin through the **Plugins** menu in WordPress

## 🎯 Usage

1. **Install and activate** the Plugin Check plugin if you haven't already
2. **Navigate** to **Tools → Plugin Check** in your WordPress admin
3. **Run a plugin check** as you normally would
4. **Wait for completion** - the organizer interface will automatically appear
5. **Use the filters** to focus on specific issues:
   - Select a specific file to review
   - Choose error types (ERROR, WARNING, INFO)
   - Pick specific error codes from the dynamic dropdown
   - Toggle hidden files visibility as needed
6. **Sort results** using the sorting dropdown for your preferred review order
7. **Export results** in your preferred format for further analysis

## 🔧 Technical Architecture

This plugin follows WordPress best practices and modern web development standards:

- **Client-side DOM manipulation** for optimal performance
- **MutationObserver pattern** for dynamic content detection
- **Progressive enhancement** architecture
- **No database dependencies** - all functionality is ephemeral
- **WordPress coding standards** compliant
- **jQuery-based** for maximum WordPress compatibility

For detailed technical documentation, see [TECHNICAL-DOCS.md](TECHNICAL-DOCS.md).

## 🔧 Current Development Status & Todo List

We're actively improving the plugin! Here's our current development roadmap:

### 🔥 **High Priority Issues**
- [ ] **Fix JavaScript initialization timing issues** - Race conditions preventing proper startup
- [ ] **Prevent MutationObserver memory leaks** - Memory accumulation over time
- [ ] **Implement filter state persistence** - Filters resetting between plugin checks

### 🛠️ **Medium Priority Improvements**
- [ ] **Fix CSS specificity conflicts** - Theme/plugin style interference
- [ ] **Add robust export error handling** - Failures with special characters or large data
- [ ] **Implement comprehensive error handling** - Safe parsing and graceful degradation

### ⚡ **Performance & Accessibility Enhancements**
- [ ] **Add performance optimization with debouncing** - Better UX during rapid interactions
- [ ] **Improve accessibility compliance** - ARIA labels and screen reader support

### 📝 **Documentation & Maintenance**
- [x] **Fix README.md formatting issues** - Clean up corrupted sections
- [ ] **Validate Plugin Check DOM selectors** - Ensure compatibility with current versions

## 🤝 Contributing

We welcome contributions from the WordPress community! Here's how you can help:

- 🐛 **Report bugs** via [GitHub Issues](../../issues)
- 💡 **Suggest features** through [GitHub Issues](../../issues)
- 🔧 **Submit pull requests** following our [Contributing Guidelines](CONTRIBUTING.md)
- 📖 **Improve documentation**
- 🧪 **Help with testing** across different WordPress setups

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and release notes.

## 📄 License

This project is licensed under the GPL v2 or later - see the [LICENSE](LICENSE) file for details.

## 💡 Why This Plugin?

The WordPress Plugin Check tool is invaluable for ensuring compliance with WordPress.org standards, but the default output can be overwhelming. This organizer transforms that experience by:

1. **Reducing cognitive load** with smart filtering
2. **Enabling focused reviews** of specific issue types
3. **Streamlining team collaboration** with export capabilities
4. **Maintaining workflow efficiency** with real-time filtering
5. **Supporting systematic fixes** through organized presentation

Perfect for:
- **Plugin developers** preparing for WordPress.org submission
- **Development teams** conducting code reviews
- **Quality assurance** professionals managing compliance
- **WordPress agencies** maintaining plugin portfolios

## 🆘 Support

- 📖 **Documentation**: [TECHNICAL-DOCS.md](TECHNICAL-DOCS.md)
- 🐛 **Bug Reports**: [GitHub Issues](../../issues)
- 💬 **Questions**: [GitHub Discussions](../../discussions)

## 🙏 Acknowledgments

- WordPress Plugin Check team for the excellent foundation tool
- WordPress community for coding standards and best practices
- ElementEngage team for development and maintenance

---

**Developed by [ElementEngage](https://elementengage.com)** | **Maintained by [@eemitch](https://github.com/eemitch)**
```

