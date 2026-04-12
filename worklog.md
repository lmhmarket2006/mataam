---
Task ID: 1
Agent: Main Agent
Task: Fix all scrolling issues across the site - page scrolling, cart drawer scrolling, and horizontal overflow

Work Log:
- Read and analyzed all key files: page.tsx, globals.css, CartDrawer.tsx, HomePage.tsx, Header.tsx, MobileNav.tsx, ItemCustomizer.tsx, MenuPage.tsx, sheet.tsx
- Diagnosed root cause: `overflow-x-clip` on the wrapper div in page.tsx was falling back to `overflow-x: hidden` in the sandbox browser, creating a scroll container on the wrapper div. Since the wrapper had `min-h-screen` (not fixed height), it grew with content and never became scrollable.
- Fixed globals.css: Added `overflow-x: clip` and `overflow-y: auto` on `html` element for viewport-level overflow control. This ensures horizontal overflow is clipped while vertical scrolling is explicitly allowed.
- Fixed page.tsx: Removed `overflow-x-clip` from wrapper div since it's now handled at the html level.
- Fixed CartDrawer.tsx: Added `overscroll-contain` and `-webkit-overflow-scrolling: touch` to the scroll body div to prevent scroll chaining on touch devices and ensure smooth mobile scrolling.
- Fixed HomePage.tsx: Added `overflow-x-clip` to reviews section parent to contain the `-mx-4` negative margins that could cause horizontal overflow.
- Ran lint - all checks pass.

Stage Summary:
- Scrolling should now work correctly: page-level vertical scrolling, cart drawer internal scrolling, and no horizontal overflow.
- Key insight: `overflow-x: clip` on a non-viewport element (like a div wrapper) can fall back to `overflow-x: hidden` in some browsers, which creates a scroll container and breaks vertical scrolling if the element doesn't have a fixed height.
