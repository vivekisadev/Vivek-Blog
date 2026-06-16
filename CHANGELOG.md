# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 2026-05-27

### Added
- **Popcard Interception for External Links:** Implemented an interception mechanism in `markdown-content.tsx` and `note-card.tsx` so that standard external anchor links (including YouTube URLs) open directly in the `MediaPopup` overlay instead of navigating away.

## [Unreleased] - 2026-05-24

### Added
- **Blog Post View Tracking:** Added a new `ViewCount` Prisma model and a dedicated API route (`/api/views/[slug]`) to track and display the number of times a blog post is viewed. The view count is displayed using a custom `ViewCounter` component.

### Changed
- **Markdown Processing Upgrades:** Upgraded the core markdown processor from `remark-html` to `remark-rehype` combined with `rehype-raw` to ensure that standard HTML video iframe tags embedded in posts are fully preserved and rendered accurately.

### Fixed
- **TextReveal Title Gaps:** Fixed a visual issue in the `<TextReveal />` component where words in blog post titles clumped together, by replacing the static `0.25rem` margin with a font-responsive `0.25em` margin.

## [Unreleased] - 2026-05-22

### Added
- **Interactive Media Embeds:** Added ability to embed videos, web pages, and images as interactive clickable popups in both posts and notes.
- **Editor Integration:** Added three new toolbar buttons (Video, Globe, Image) in the `/create` editor to easily insert media popups.
- **Global Media Popups:** Introduced `MediaPopupProvider` in `app/layout.tsx` to ensure popup overlays function globally across the site without requiring navigation.
- **Note Support:** Added DOM hydration to `NoteCard` component so media popups work identically in daily notes.

### Changed
- **Performance Optimization (ISR):** Changed `app/page.tsx` and `app/notes/page.tsx` from `force-dynamic` rendering to Incremental Static Regeneration (ISR) with a 60-second revalidation period to drastically improve load times.
- **Cache Optimization:** Updated the manual cache TTL in `lib/cache.ts` from `0` to `60000` (1 minute) to eliminate redundant filesystem reads and database queries on every page load.
- **Markdown Processing:** Refactored `MarkdownContent` to remove its local portal implementation in favor of the new global popup provider.

### Fixed
- **Database Connection Warning:** Explicitly configured `pg.Pool` SSL settings in `lib/prisma.ts` with `rejectUnauthorized: false` in production to silence Postgres driver deprecation warnings.
