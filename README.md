# PEAK SHOP

Modern minimal e-commerce frontend built with Vue 3, TypeScript, Vite, Pinia, Tailwind CSS, and shadcn-style local UI primitives.

## Assignment Requirements

### API Integration

- Load product data from the provided JSON response shape.
- Fetch products once when the product page loads.
- Handle loading, error, retry, and empty states.

### Product List Page

- Display product image, title, price, and tags.
- Search products by title with debounced input.
- Filter by multiple tags and combine filters with search.
- Show product count and removable active-filter pills.
- Show a friendly empty state when no products match.

### Product Detail Page

- Show product description and all product photos.
- Provide a product gallery and back-to-list navigation.
- Provide quantity selection and Add to Cart action.

### Shopping Cart

- Show selected products, quantity, subtotal, and total price.
- Increment and decrement item quantity.
- Remove individual items and clear the entire cart.
- Confirm destructive cart actions.
- Persist cart data in localStorage.
- Show an empty-cart state.

### Advanced Features

- Infinite scroll with loading delay and loading skeletons.
- Lazy loading for product images.
- Toast notifications for add, remove, and clear-cart actions.
- Framer Motion-style micro-interactions via the project animation system.
- Responsive mobile-first layout with a two-column product grid on mobile.
- Accessibility labels, semantic HTML, keyboard-friendly controls, and focus states.

## Technology Stack

- Framework: Vue 3 + TypeScript
- State management: Pinia
- Routing: Vue Router
- Styling: Tailwind CSS
- UI primitives: shadcn-style local components
- HTTP client: Axios
- Testing: Vitest
- Code quality: ESLint, Oxlint, and Prettier

## Requirements

- Node.js `22.19.0` (see `.nvmrc`)
- npm

## Setup

```bash
nvm use
npm install
```

If Node.js is managed by the project helper:

```bash
source scripts/use-node.sh
```

## Development

```bash
npm run dev
```

The app runs with Vite. Product data is loaded directly from `[public/db.json](public/db.json)`, so no separate mock API server is required.

## Mock Data

Update `[public/db.json](public/db.json)` to change the product catalog. The frontend requests it through `/db.json` in `src/api/products.ts`.

The legacy Express mock server remains available under `../json-server` for API testing, but it is not required by the frontend.

## Validation

```bash
npm run type-check
npm run test:unit
npm run build
```

## Main Features

- Responsive product catalog with two-column mobile grid
- Search, tag filters, tag sorting, and infinite scroll
- Product detail gallery and quantity selector
- Cart drawer and full cart page
- Toast feedback for cart actions
- Confirm dialogs for clearing the cart and removing items
- Empty, loading, and error states
- SPA fallback configuration for Vercel deployment
