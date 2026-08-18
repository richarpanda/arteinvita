# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Arte Invita is a digital invitation generation platform that creates custom event invitations (bodas/weddings, bautizos/baptisms, XV anos quinceaeras) with personalized templates and styling. The site is hosted as a static HTML/CSS/JavaScript application with minimal backend integration.

Repository: https://github.com/richarpanda/arteinvita

## Architecture & Codebase Structure

### Core Stack
- Frontend Framework: jQuery-based static HTML5 (Polo template v5.9.9 by Inspiro Themes)
- CSS: Custom CSS + Bootstrap + vendor plugins (6750 LOC in style.css)
- Build System: None - plain static files (no build step required)
- Backend Integration: Minimal - only Meta Conversions API for Facebook pixel tracking (Node.js handler)
- Package Management: No npm/yarn; only one nested package (zoom-master jQuery plugin)

### Project Structure

Root: Landing pages and homepage
- index.html: Main homepage (1918 lines)
- home-blog.html: Blog homepage variant
- bautizo_nina.html, bautizo_nino.html
- boda_clasica.html, boda_mexicana.html, boda_playa.html
- xv_flores.html, enlaces_nuevas.html

Core Assets:
- css/: Stylesheets
  - style.css: Main theme (6750 lines)
  - plugins.css: Plugin styles
  - theme.css, fonts.css, rtl.css
  - custom.css: Custom overrides
- js/: JavaScript
  - functions.js: Main jQuery logic (3433 lines)
  - plugins.js: jQuery plugins bundle
  - jquery.js: jQuery library
  - custom.js: Empty placeholder for custom code
- images/: Static images, logos, icons
- public/fonts/: System fonts
- webfonts/: Web-hosted fonts
- plugins/: 30+ vendor libraries (bootstrap, jquery, fontawesome, slider-revolution, datatables, fullcalendar, zoom-master, etc.)

Templates & Invitations:
- demo_invitaciones/: Demo templates (organized by type)
  - Bautizos/: 8 baptism themes
  - Bodas/: 10+ wedding themes
  - XV/: 20+ quinceaera themes
  - baby_shower/: Baby shower templates
  - Each has: invitacion.html, sobre.html, img/, fonts/, music/
- invi/: Active invitations
  - full_web/, full_web_XV/, invitacion_xv/
- invi_[month]/: Monthly archives (10 folders)
  - Full_arte_*, Full_royal_*, etc. - personalized invitations

Utilities:
- api/: meta-capi.js (Meta Conversions API handler - Node.js)
- include/: php-mailer/ (email library), mailchimp/, twitter/
- homepages/: Alternative homepage variants
- PANELES/, jkl/, save_the_date/: Support folders
- index/: Index management

### Invitation Template Structure

Each invitation (demo and active) follows this pattern:

Template Folder/
- invitacion.html: Main invitation page
- sobre.html: Envelope/cover page variant
- README.md: Template description
- img/: Custom images, backgrounds
- fonts/: Custom fonts (Nova Quinta, Gabriola)
- music/: Background music files
- intersection-observer.js: Performance utility

Template files use:
- Inline CSS (style tags) for custom styling
- Custom fonts (Nova Quinta cursive, Gabriola serif)
- Full-screen responsive design (mobile-first, max 450px width)
- Animations (CSS keyframes slideIn, timeline effects)
- Facebook pixel tracking (fbq) embedded in HTML

## Build & Development Commands

No build step required - this is a static site.

### Development Server
```
# Option 1: Python HTTP server (built-in)
python -m http.server 8000

# Option 2: Node.js (if available)
npx http-server

# Option 3: PHP (if available)
php -S localhost:8000
```

Then visit: http://localhost:8000

### Key Files to Edit
- Homepage styling: css/style.css (theme color #2250fc, responsive breakpoints at 576/768/1025/1200px)
- Homepage logic: js/functions.js (jQuery event handlers, slider, grid layout, responsive menu)
- Landing page HTML: index.html, home-blog.html
- Invitation templates: demo_invitaciones/[Type]/[Template]/invitacion.html
- Custom CSS: css/custom.css (override theme defaults here)

### Testing/Preview
- Open any .html file directly in browser
- Inspect mobile responsiveness using browser DevTools
- Check Facebook pixel firing with Meta Pixel Helper browser extension
- Validate HTML: https://validator.w3.org/

## Meta Conversions API Integration

File: api/meta-capi.js (Node.js handler)

Handles Facebook pixel tracking via server-side API:
- Endpoint: POST to Meta Graph API v18.0
- Events: PageView, Contact, Purchase (mapped from type parameter)
- Required Environment Variables:
  - FB_ACCESS_TOKEN: Meta API access token
  - FB_PIXEL_ID: Facebook pixel ID (currently hardcoded as 1135224928176488 in HTML)
- Implementation: Axios-based, processes client IP, user agent, event IDs
- Note: Currently embedded pixel tracking in HTML files; this API provides server-side tracking

All invitation templates have Facebook pixel hardcoded:
```
fbq('init', '1135224928176488');
fbq('track', 'PageView');
```

## Git Workflow

Current State:
- Branch: main_2 (default)
- Remote: origin (https://github.com/richarpanda/arteinvita.git)
- Commits marked with dates: "LUNES_17", "Deploy-[DDMMYY]"

No special CI/CD - changes pushed directly to main branches.

## Important Notes

### Invitation Template Customization
When working with invitation templates in demo_invitaciones/ or invi_*/:
1. Each template is self-contained (no external CSS dependencies except shared fonts)
2. Images are background-image CSS properties pointing to local img/ folders
3. Fonts must be preloaded before text renders (check <style> section)
4. Width typically constrained to 450px max for mobile-first design
5. Background sizes often set to exact pixels (e.g., 450px x 7218px for full scroll)

### Performance Considerations
- intersection-observer.js used in templates for lazy-loading images
- Large SVG/PNG backgrounds in invitations can slow initial load
- jQuery v1.11.1 loaded from Google CDN (upgrade considered risky without testing all templates)
- 30+ vendor plugins in /plugins/ - many unused; audit before removal

### No Build Tooling
- No minification or bundling
- No transpilation (jQuery 1.11 supports ES5 only)
- No package.json at root (only nested in plugins/zoom-master/)
- CSS/JS included via direct <link> and <script> tags

### File Size Notes
- js/functions.js: 171 KB (minified could be ~60 KB)
- css/style.css: 433 KB (minified could be ~250 KB)
- css/plugins.css: 354 KB
- Consider gzip compression on server for production

## Common Tasks

### Add a New Invitation Template
1. Create folder in demo_invitaciones/[Type]/[TemplateName]/
2. Copy structure from similar template (invitacion.html, sobre.html, img/, fonts/)
3. Customize inline CSS and HTML
4. Test in browser at multiple viewport sizes
5. Add Facebook pixel to HTML <head> if not present
6. Commit and push to main_2

### Update Homepage
1. Edit index.html or home-blog.html
2. Modify css/style.css for theme changes (primary color is #2250fc)
3. Update js/functions.js for interactivity changes
4. Test responsive behavior (breakpoints: 576/768/1025/1200px)
5. Commit and deploy

### Fix Styling Issues
1. Check css/custom.css first (highest specificity)
2. If needed, override in css/style.css or template inline styles
3. Use browser DevTools Inspector to verify CSS cascade
4. Avoid modifying css/plugins.css (third-party styles)

### Deploy
- Push to main_2 branch
- Repository mirrors to production via webhook/CI (assumed; verify with maintainer)
