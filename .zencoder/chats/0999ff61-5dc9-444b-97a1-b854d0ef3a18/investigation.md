# Bug Investigation - UI Overlap

## Bug Summary
The current UI has a fixed Navbar at the top and a fixed Footer at the bottom. The main content in `App.jsx` is not wrapped in a container with sufficient padding, causing the page content to be hidden behind these fixed elements.

## Root Cause Analysis
The `Navbar` component uses `fixed top-0` and the `Footer` component uses `fixed bottom-0`. In `App.jsx`, the `<Routes>` component is placed directly between them without any spacing or wrapper that accounts for the height of these fixed elements.

## Affected Components
- `frontend/src/App.jsx`
- `frontend/src/components/Navbar.jsx` (height reference)
- `frontend/src/components/Footer.jsx` (height reference)

## Proposed Solution
1. Wrap the `<Routes>` component in `App.jsx` with a `div` that has top and bottom padding (`pt-16 pb-10`) as requested by the user.
2. Improve the overall UI of the project by enhancing the styling of various components (Home, Login, Signup, etc.).
