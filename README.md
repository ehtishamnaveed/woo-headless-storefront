# CoCart API SDK

A professional, single-file TypeScript SDK library for CoCart and WooCommerce Headless. Designed for simplicity, performance, and modern development workflows.

## Features

- **Class-based API**: Clean, intuitive interface for all CoCart operations.
- **Zero Configuration**: Just provide your site URL.
- **Persistent Sessions**: Automatic handling of cart keys and JWT authentication tokens.
- **Fully Typed**: Comprehensive TypeScript interfaces for products, cart data, and responses.
- **Cache Ready**: Fully compatible with the CoCart Products Cache plugin for <10ms response times.

## Performance Optimization

For maximum performance, it is highly recommended to use this SDK alongside the [CoCart Products Cache](https://github.com/ehtishamnaveed/cocart-products-cache) plugin.

- **Fastest Responses**: Reduces product fetch times from ~500ms to **<10ms**.
- **Zero DB Queries**: Serves products directly from a static JSON file.
- **Improved UX**: Instant product loading for your headless storefront.

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
```

## API Documentation

### Authentication

#### `login(username, password)`
Authenticate and store JWT token locally.
```typescript
const response = await sdk.login('john_doe', 'secret123');
if (response.success) {
    console.log('User logged in:', response.data);
}
```

#### `logout()`
Clear the authenticated user session and token.
```typescript
sdk.logout();
```

#### `getAuthenticatedUser()`
Retrieve the currently stored user data.
```typescript
const user = sdk.getAuthenticatedUser();
```

### Products

#### `getProducts(params?)`
Get all products with optional filters (like category). Compatible with the Products Cache plugin.
```typescript
const response = await sdk.getProducts({ category: 'shoes' });
if (response.success) {
    console.log('Products:', response.data);
}
```

#### `getProduct(id)`
Get detailed data for a specific product by its ID.
```typescript
const response = await sdk.getProduct(42);
```

### Cart Management

#### `getCart()`
Retrieve current cart contents, totals, and item counts.
```typescript
const response = await sdk.getCart();
```

#### `addToCart(productId, quantity)`
Add a product to the cart. Automatically handles cart keys.
```typescript
await sdk.addToCart('123', '1');
```

#### `updateCartItem(itemKey, quantity)`
Update the quantity for a specific item already in the cart.
```typescript
await sdk.updateCartItem('cart_item_key_string', '5');
```

#### `removeCartItem(itemKey)`
Delete a specific item from the cart.
```typescript
await sdk.removeCartItem('cart_item_key_string');
```

#### `clearCart()`
Remove all items from the current cart.
```typescript
await sdk.clearCart();
```

### Checkout

#### `getCheckoutUrl()`
Generate a direct redirect link to the WooCommerce checkout page with the cart pre-loaded.
```typescript
const url = sdk.getCheckoutUrl();
window.location.href = url;
```

## License

MIT
