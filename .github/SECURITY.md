# Security Policy

## Supported Versions

We actively support the following versions of EE Plugin Check Organizer with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## WordPress and PHP Compatibility

This plugin requires:
- WordPress 5.0 or higher
- PHP 7.4 or higher
- Plugin Check plugin (official WordPress plugin)

## Reporting a Vulnerability

We take security seriously and appreciate your help in keeping EE Plugin Check Organizer secure.

### How to Report

**For security vulnerabilities, please do NOT open a public GitHub issue.**

Instead, please report security vulnerabilities by:

1. **Email**: Send details to [security@elementengage.com](mailto:security@elementengage.com)
2. **Subject Line**: Include "SECURITY: EE Plugin Check Organizer" in the subject
3. **Encrypted Communication**: If you prefer, you can request our PGP key for encrypted communication

### What to Include

Please include the following information in your report:

- **Description** of the vulnerability
- **Steps to reproduce** the issue
- **Potential impact** and severity assessment
- **Affected versions** (if known)
- **Suggested fix** (if you have one)
- **Your contact information** for follow-up questions

### What to Expect

When you report a security vulnerability, here's what you can expect:

1. **Acknowledgment**: We'll acknowledge receipt of your report within 48 hours
2. **Assessment**: We'll assess the vulnerability and determine its validity and severity
3. **Timeline**: We'll provide an estimated timeline for addressing the issue
4. **Updates**: We'll keep you informed of our progress
5. **Resolution**: We'll notify you when the issue is resolved
6. **Credit**: With your permission, we'll credit you in our security advisory

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Resolution Timeline**: Varies based on severity
  - Critical: Within 7 days
  - High: Within 14 days
  - Medium: Within 30 days
  - Low: Within 60 days

## Security Considerations

### Plugin Architecture

EE Plugin Check Organizer is designed with security in mind:

- **Client-side only**: All functionality is performed in the browser
- **No database operations**: The plugin doesn't store or modify any data
- **WordPress admin only**: Only loads in WordPress admin area
- **No user input processing**: Doesn't process or store user-submitted data
- **DOM manipulation only**: Only modifies display of existing Plugin Check results

### WordPress Security Best Practices

This plugin follows WordPress security best practices:

- **Nonce verification**: Uses WordPress nonces where applicable
- **Capability checks**: Respects WordPress user permissions
- **Data escaping**: Properly escapes all output
- **Direct access prevention**: Prevents direct file access
- **No SQL queries**: No database operations eliminate SQL injection risks

### Known Limitations

- **JavaScript dependency**: Core functionality requires JavaScript to be enabled
- **Admin access required**: Only functions for users with WordPress admin access
- **Plugin Check dependency**: Requires the official Plugin Check plugin to be active

## Security Updates

Security updates will be:

1. **Released promptly** based on severity
2. **Announced** through GitHub releases and security advisories
3. **Documented** in the changelog
4. **Communicated** to users through appropriate channels

## Bug Bounty

Currently, we do not offer a formal bug bounty program. However, we greatly appreciate security research and will:

- Provide public recognition (with your permission)
- Credit you in our security advisories
- Consider your contributions for future bug bounty programs

## Contact Information

For security-related inquiries:

- **Email**: [security@elementengage.com](mailto:security@elementengage.com)
- **General Issues**: [GitHub Issues](https://github.com/eemitch/ee-plugin-check-organizer/issues) (for non-security issues only)
- **Maintainer**: [@eemitch](https://github.com/eemitch)

## Responsible Disclosure

We follow responsible disclosure practices:

1. **Private reporting** of vulnerabilities
2. **Coordinated disclosure** with appropriate timelines
3. **Public disclosure** only after fixes are available
4. **Credit** to security researchers (with permission)

Thank you for helping keep EE Plugin Check Organizer and the WordPress community secure!