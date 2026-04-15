# TODO - Sell Category + Product Detail Store Data

- [x] Add categories API endpoint (`app/api/categories/route.ts`) to serve category options from DB.
- [x] Update sell form (`app/store-panel/sell/page.tsx`) to load categories, add category dropdown, improve UI, and submit `categoryId`.
- [x] Update create product API (`app/api/products/create/route.ts`) to accept and persist `categoryId`.
- [x] Update product detail API (`app/api/products/[id]/route.ts`) to return category name and store name/location from joined tables.
- [ ] Final check for consistency and no regressions in sell flow and product detail display.
