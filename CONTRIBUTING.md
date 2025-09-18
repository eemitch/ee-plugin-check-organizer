# Contributing to EE Plugin Check Organizer

Thank you for your interest in contributing to EE Plugin Check Organizer! We welcome contributions from the WordPress community and appreciate your help in making this tool better for everyone.

## 🚀 Quick Start

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/eemitch/ee-plugin-check-organizer.git
   cd ee-plugin-check-organizer
   ```

2. **Set up WordPress development environment**
   - Install in a WordPress development site
   - Install the Plugin Check plugin dependency
   - Place in `/wp-content/plugins/ee-plugin-check-organizer/`

3. **Enable development mode**
   - Set `DEBUG_MODE = true` in `main.js` for development
   - This enables console logging and debug functions

4. **Test with Plugin Check**
   - Navigate to Tools → Plugin Check in WordPress admin
   - Test filtering functionality with various plugins

## 📋 Code Standards

### WordPress Standards
- Follow [WordPress PHP Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/php/)
- Follow [WordPress JavaScript Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/javascript/)
- Use WordPress hooks and filters appropriately
- Maintain backward compatibility with WordPress 5.0+

### JavaScript Standards
- Use JSDoc comments for all functions
- Follow existing code architecture patterns
- Use jQuery for WordPress compatibility
- Implement progressive enhancement
- Maintain responsive design principles

### CSS Standards
- Extend WordPress core admin styles where possible
- Use minimal custom CSS
- Ensure compatibility with all WordPress admin themes
- Test responsive behavior across devices

## 🔧 Development Guidelines

### Architecture Principles
1. **Non-invasive enhancement** - Never break Plugin Check functionality
2. **Progressive enhancement** - Work gracefully when JavaScript fails
3. **Client-side only** - No database dependencies
4. **WordPress integration** - Follow WordPress plugin standards

### Code Organization
- **`functions.php`** - WordPress integration and hooks
- **`main.js`** - Core JavaScript functionality
- **`style.css`** - WordPress admin styling extensions

### Debug Mode Features
When `DEBUG_MODE = true`, the following features are available:
- Enhanced console logging with `debugLog()`
- Manual testing with `testScan()` function
- Raw data output display for development
- Global API exposure for testing

## 🐛 Bug Reports

When reporting bugs, please include:

### Environment Information
- WordPress version
- Plugin Check plugin version
- Browser and version
- PHP version
- Any other active plugins that might conflict

### Bug Description
- Clear steps to reproduce the issue
- Expected behavior vs. actual behavior
- Screenshots or screen recordings if applicable
- Browser console errors (if any)

### Example Bug Report
```markdown
**Environment:**
- WordPress: 6.3.1
- Plugin Check: 1.0.2
- Browser: Chrome 115.0.5790.170
- PHP: 8.1.12

**Steps to Reproduce:**
1. Run Plugin Check on [specific plugin]
2. Apply [specific filter combination]
3. Click [specific button]

**Expected:** Should show filtered results
**Actual:** No results displayed, console shows error

**Console Error:** [paste error message]

**Screenshot:** [attach image]
```

## 💡 Feature Requests

We welcome feature suggestions! Please use GitHub Issues with:

1. **Clear description** of the proposed feature
2. **Use case explanation** - why would this be useful?
3. **Implementation ideas** - any thoughts on how it might work?
4. **WordPress compatibility** - how does it fit with WordPress standards?

### Feature Request Template
```markdown
**Feature Summary:** Brief description

**Problem it Solves:** What user need does this address?

**Proposed Solution:** How should it work?

**Alternative Solutions:** Other approaches considered?

**WordPress Integration:** How does it fit with WordPress patterns?
```

## 🔄 Pull Request Process

### Before You Start
1. **Check existing issues** - someone might already be working on it
2. **Open an issue first** for major changes to discuss approach
3. **Fork the repository** and create a feature branch

### Development Workflow
1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clear, commented code
   - Follow existing patterns and architecture
   - Test thoroughly in WordPress environment

3. **Test your changes**
   - Set `DEBUG_MODE = true` for testing
   - Test with multiple plugins and scenarios
   - Verify responsive behavior
   - Check browser console for errors
   - Test with Plugin Check in various states

4. **Document your changes**
   - Update relevant documentation
   - Add JSDoc comments for new functions
   - Update CHANGELOG.md if needed

5. **Commit with clear messages**
   ```bash
   git commit -m "Add feature: brief description"
   ```

6. **Push and create Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

### Pull Request Requirements
- **Clear title** describing the change
- **Detailed description** of what was changed and why
- **Testing information** - how was it tested?
- **Screenshots** for UI changes
- **Reference any related issues**

### Pull Request Template
```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Tested in WordPress development environment
- [ ] Tested with multiple plugins
- [ ] Tested responsive behavior
- [ ] Verified no console errors
- [ ] Tested with DEBUG_MODE enabled and disabled

## Checklist
- [ ] Code follows WordPress coding standards
- [ ] Self-review of code completed
- [ ] Code is commented, particularly hard-to-understand areas
- [ ] Documentation updated as needed
- [ ] No breaking changes to existing functionality
```

## 🧪 Testing Guidelines

### Manual Testing Checklist
- [ ] Install and activate in WordPress development site
- [ ] Test with Plugin Check plugin active
- [ ] Run checks on various plugin types (simple, complex, multi-file)
- [ ] Test all filter combinations
- [ ] Test sorting functionality
- [ ] Test export features (CSV, JSON, TXT)
- [ ] Test responsive behavior on mobile/tablet
- [ ] Test with different WordPress admin themes
- [ ] Verify graceful degradation with JavaScript disabled

### Browser Testing
Test in major browsers:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### WordPress Compatibility Testing
- [ ] WordPress 5.0+ compatibility
- [ ] Test with different PHP versions (7.4+)
- [ ] Test with various WordPress admin themes
- [ ] Test with other common plugins active

## 📚 Development Resources

### Documentation
- [WordPress Plugin Developer Handbook](https://developer.wordpress.org/plugins/)
- [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/)
- [Plugin Check Plugin Documentation](https://wordpress.org/plugins/plugin-check/)

### Architecture Documentation
- [TECHNICAL-DOCS.md](TECHNICAL-DOCS.md) - Comprehensive technical documentation
- Inline code comments and JSDoc documentation
- WordPress action and filter references

## 🤝 Community Guidelines

### Code of Conduct
- Be respectful and constructive in all interactions
- Welcome newcomers and help them learn
- Focus on what's best for the community and WordPress ecosystem
- Give credit where credit is due

### Communication
- Use clear, professional language in issues and pull requests
- Provide helpful, detailed feedback on pull requests
- Ask questions if something is unclear
- Share knowledge and help others learn

## 🎯 Release Process

### Version Management
- Follow [Semantic Versioning](https://semver.org/)
- Update version numbers in multiple files:
  - `functions.php` (plugin header)
  - `readme.txt` (WordPress.org format)
  - `CHANGELOG.md`

### Production Releases
1. Set `DEBUG_MODE = false` in `main.js`
2. Update version numbers
3. Update CHANGELOG.md
4. Test thoroughly
5. Create GitHub release with release notes
6. Submit to WordPress.org (if applicable)

## 🙏 Recognition

Contributors will be:
- Listed in CHANGELOG.md for their contributions
- Mentioned in release notes
- Added to the contributors section (for significant contributions)

Thank you for helping make EE Plugin Check Organizer better for the WordPress community!

---

**Questions?** Feel free to [open an issue](../../issues) or start a [discussion](../../discussions).