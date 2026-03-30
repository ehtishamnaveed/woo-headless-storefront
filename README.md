# CoCart API SDK

A professional, single-file TypeScript SDK library for CoCart and WooCommerce Headless. Designed for simplicity, performance, and modern development workflows.

## Features

- **Class-based API**: Clean, intuitive interface for all CoCart operations.
- **Zero Configuration**: Just provide your site URL.
- **Persistent Sessions**: Automatic handling of cart keys and JWT authentication tokens.
- **Fully Typed**: Comprehensive TypeScript interfaces for products, cart data, and responses.
- **Cache Ready**: Fully compatible with the CoCart Products Cache plugin for <10ms response times.

## Installation

Install directly from GitHub:

```bash
npm install https://github.com/ehtishamnaveed/woo-headless-storefront
```

## Quick Start

```typescript
import { CoCartSDK } from 'cocart-api-sdk';

const sdk = new CoCartSDK({
    siteURL: 'https://your-store.com'
});

// Fetch products (Instant with Products Cache plugin)
const response = await sdk.getProducts();
if (response.success) {
    console.log(response.data);
}

// Add to cart
await sdk.addToCart('123', '2');

// Get cart details
const cart = await sdk.getCart();

// Secure Checkout
const checkoutUrl = sdk.getCheckoutUrl();
window.location.href = checkoutUrl;
```

## API Documentation

### Authentication
- `login(username, password)`: Authenticate and store JWT token.
- `logout()`: Clear session and token.
- `getAuthenticatedUser()`: Retrieve stored user data.

### Products
- `getProducts(params?)`: Get all products with optional filters.
- `getProduct(id)`: Get detailed data for a specific product.

### Cart
- `getCart()`: Retrieve current cart contents and totals.
- `addToCart(productId, quantity)`: Add a new item to the cart.
- `updateCartItem(itemKey, quantity)`: Update quantity for an item.
- `removeCartItem(itemKey)`: Delete an item from the cart.
- `clearCart()`: Empty the entire cart.

### Checkout
- `getCheckoutUrl()`: Generate a direct link to the WooCommerce checkout with the cart pre-loaded.

## License

MIT
