# Woo Headless Storefront

A complete headless WooCommerce storefront built with **React + Vite + Tailwind CSS**. Connects to WooCommerce via [CoCart](https://cocartapi.com/) and the [@ehtisham/headless-api-sdk](https://github.com/ehtishamnaveed/Headless-Api-SDK).

Designed to pair with [cocart-products-cache](https://github.com/ehtishamnaveed/cocart-products-cache) — a WordPress plugin that makes product API calls respond in under 10 ms.

## Pages & Features

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero carousel + featured products |
| Shop | `/shop` | Full product grid with search and category filtering |
| Product Detail | `/product/:id` | Images, pricing, quantity selector, related products |
| Cart | `/cart` | Cart items, quantities, totals |
| Login | `/login` | Basic auth login (stored in localStorage) |
| Register | `/register` | Customer registration via custom WP endpoint |
| Account | `/account` | Logged-in user info + logout |

**UI highlights:**
- Skeleton loading states on every page
- Slide-in cart drawer accessible from the navbar
- In-memory category filtering (instant, no API call)
- Sale badge, stock status badge, out-of-stock disabled buttons
- Responsive grid — 2 / 3 / 4 columns at sm / md / lg

## Tech Stack

- [React 18](https://react.dev/)
- [Vite 5](https://vite.dev/)
- [Tailwind CSS 3](https://tailwindcss.com/)
- [React Router 6](https://reactrouter.com/)
- [@ehtisham/headless-api-sdk](https://github.com/ehtishamnaveed/Headless-Api-SDK)

## Prerequisites

- Node.js 18+
- A live WordPress site with:
  - [WooCommerce](https://woocommerce.com/)
  - [CoCart](https://wordpress.org/plugins/cart-rest-api-for-woocommerce/) (free tier works)
  - *(Recommended)* [cocart-products-cache](https://github.com/ehtishamnaveed/cocart-products-cache) plugin for fast product endpoints

## Quick Start

```bash
git clone https://github.com/ehtishamnaveed/woo-headless-storefront.git
cd woo-headless-storefront
npm install
```

Open `src/api.js` and set your WordPress site URL:

```js
// src/api.js
const SITE_URL = "https://your-wordpress-site.com";
```

Then start the dev server:

```bash
npm run dev
```

## Configuration

All configuration lives in **`src/api.js`**:

```js
const SITE_URL = "https://your-wordpress-site.com"; // no trailing slash
```

If `SITE_URL` is left as the placeholder, a red banner appears across the top of the app telling you to configure it — no silent failures.

## Build & Deploy

```bash
npm run build   # outputs to dist/
npm run preview # preview the production build locally
```

Deploy the `dist/` folder to any static host (Netlify, Vercel, Cloudflare Pages, etc.) or serve it from your WordPress theme/child theme directory.

### Deploying inside WordPress

1. Run `npm run build`
2. Upload the `dist/` folder contents to your server (e.g. `wp-content/uploads/store/`)
3. Visit `your-site.com/wp-content/uploads/store/`

Or use a static hosting service and point your domain/subdomain at the `dist/` output.

## Project Structure

```
woo-headless-storefront/
├── src/
│   ├── api.js                  # ← configure SITE_URL here
│   ├── App.jsx                 # Router + providers
│   ├── main.jsx
│   ├── index.css               # Tailwind base styles
│   ├── components/
│   │   ├── Navbar.jsx          # Top nav + cart icon
│   │   ├── CartDrawer.jsx      # Slide-in cart sidebar
│   │   ├── ProductCard.jsx     # Reusable product tile
│   │   ├── HeroCarousel.jsx    # Homepage banner
│   │   └── SiteErrorBanner.jsx # Config error banner
│   ├── context/
│   │   ├── AuthContext.jsx     # Login / logout state
│   │   └── CartContext.jsx     # Cart state + actions
│   └── pages/
│       ├── Home.jsx
│       ├── Shop.jsx
│       ├── ProductDetail.jsx
│       ├── CartPage.jsx
│       ├── Login.jsx
│       ├── Register.jsx
│       └── Account.jsx
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## How Cart Works

- **Guest carts** — CoCart creates a cart key automatically and stores it in `localStorage`. The cart persists across page reloads without login.
- **Login** — on login, any items in the guest cart are transferred to the user's cart automatically.
- **Checkout** — the checkout button redirects to `your-wordpress-site.com/checkout/?cocart-load-cart={cart_key}`, loading the cart into WooCommerce's standard checkout page.

## Authentication

Uses CoCart's built-in Basic Auth:
- Credentials are base64-encoded and stored in `localStorage`
- All cart requests use the stored token automatically
- Logout clears the token and cart key from localStorage

> For production, consider switching to JWT authentication. The SDK's `login()` method and `Authorization` header injection can be adapted for any auth scheme.

## WordPress Setup

### Required Plugins

1. **WooCommerce** — your product catalog and checkout
2. **CoCart** — the REST API layer (`/cocart/v2/` endpoints)
3. **cocart-products-cache** *(recommended)* — makes product endpoints ~50× faster

### Optional: Customer Registration Endpoint

The Register page calls `POST /wp-json/headless/v1/register`. You can add this endpoint to your theme's `functions.php` or a custom plugin:

```php
add_action( 'rest_api_init', function () {
    register_rest_route( 'headless/v1', '/register', [
        'methods'             => 'POST',
        'callback'            => function ( WP_REST_Request $request ) {
            $username = sanitize_user( $request->get_param( 'username' ) );
            $email    = sanitize_email( $request->get_param( 'email' ) );
            $password = $request->get_param( 'password' );

            if ( ! $username || ! $email || ! $password ) {
                return new WP_Error( 'missing_fields', 'All fields are required.', [ 'status' => 400 ] );
            }

            $user_id = wp_create_user( $username, $password, $email );
            if ( is_wp_error( $user_id ) ) {
                return new WP_Error( 'registration_failed', $user_id->get_error_message(), [ 'status' => 400 ] );
            }

            return [ 'success' => true ];
        },
        'permission_callback' => '__return_true',
    ] );
} );
```

### CORS

If your frontend is on a different domain from WordPress, add CORS headers. The easiest way is to let CoCart handle it (it has a CORS setting in its options), or add to your theme's `functions.php`:

```php
add_action( 'init', function () {
    header( 'Access-Control-Allow-Origin: https://your-frontend-domain.com' );
    header( 'Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS' );
    header( 'Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce' );
} );
```

## Related Repositories

| Repo | Description |
|------|-------------|
| [cocart-products-cache](https://github.com/ehtishamnaveed/cocart-products-cache) | WordPress plugin — makes product endpoints ~50× faster |
| [Headless-Api-SDK](https://github.com/ehtishamnaveed/Headless-Api-SDK) | TypeScript SDK used by this storefront |

## License

MIT
