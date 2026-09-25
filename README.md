# Product Admin Dashboard

A small admin dashboard built with React (Vite) that lets a logged-in user browse, search, filter, sort, and manage products using the [DummyJSON](https://dummyjson.com) API.

**Live Demo:** `https://product-admin-dashboard-weld-xi.vercel.app/login`
**Repository:** `https://github.com/surbhi-pandit/Product-Admin-Dashboard`

---

## Tech Stack

- React (Vite)
- React Router (client-side routing)
- Axios (API calls, with a shared instance + interceptors)
- Tailwind CSS

---

## Setup Steps

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd product-admin-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the project root (copy from `.env.example`):
   ```bash
   VITE_API_BASE_URL=https://dummyjson.com
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   The app will run at `http://localhost:5173`.

5. Login with the test credentials:
   - **Username:** `emilys`
   - **Password:** `emilyspass`

### Build for Production

```bash
npm run build
```
Output is generated in the `dist/` folder.

---

## Features Completed

- [x] Login with error handling for wrong credentials; logout button
- [x] Route protection — product pages are only accessible when logged in, and the login page redirects away if already logged in
- [x] Product list with image, title, category, price, rating, and stock
- [x] Responsive layout — table on desktop, cards on mobile
- [x] Pagination — page numbers, Previous/Next, page size selector (10/20/50), and a "Showing X–Y of Z" indicator
- [x] Debounced search (waits for typing to stop before calling the API)
- [x] Category filter and sort (by price, rating, title)
- [x] Product details page with images, description, price, and reviews
- [x] "Not Found" page for an invalid product id
- [x] Add, edit, and delete products with form validation and a delete confirmation modal
- [x] Loading, empty, and error states (with a Retry button) across all data-fetching views
- [x] All page/search/filter/sort state is kept in the URL, so refreshing or sharing a link preserves the exact view
- [x] Invalid URL values (e.g. `?page=abc`, `?page=999`) are handled gracefully instead of breaking the page
- [x] Old search responses can never overwrite newer ones (handled via request cancellation)
- [x] Login and Save buttons are protected against rapid multiple clicks/requests
- [x] Single shared Axios instance — attaches the auth token to every request and handles errors (like 401) in one place

---

## Design Decisions & Notes

**Search vs. Category filter:** DummyJSON doesn't support searching and category-filtering at the same time. This app prioritizes search — when a search term is active, the category filter is disabled (with a tooltip explaining why) and automatically cleared. This avoids the confusing behavior of a selected category silently having no effect.

**Add/Edit/Delete persistence:** DummyJSON's add/edit/delete endpoints return success responses but don't actually save anything server-side. To make the app feel real, a `localStorage`-based overlay tracks locally added, edited, and deleted product IDs. This overlay is merged on top of every API response, so changes appear immediately in the UI and persist across refreshes, despite the underlying API not persisting them.

**Deployment routing:** Since this is a single-page app, a `vercel.json` rewrite rule was added so that directly visiting or refreshing any route (e.g. `/products/5`) serves `index.html` and lets React Router handle it on the client, instead of returning a server-level 404.