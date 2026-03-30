# @Ehtisham/headless-api-sdk

Plug and play SDK library for CoCart and WooCommerce Headless. 
This SDK provides a clean interface for interacting with your WooCommerce store's products, cart, and authentication.

## Installation

```bash
npm install @ehtisham/headless-api-sdk
```

## Usage

```javascript
import createApiClient from "@ehtisham/headless-api-sdk";

const api = createApiClient("https://your-wordpress-site.com");

// Get Products
const products = await api.getProducts();
if (products.success) {
  console.log(products.data);
}

// Add to Cart
await api.addToCart("123", "1");

// Get Cart
const cart = await api.getCart();

// Authentication
await api.login("username", "password");
const user = api.getStoredUser();
```

## API Reference

### `getProducts()`
Fetches all products from the cache or live CoCart API.

### `getCart()`
Fetches the current cart data.

### `addToCart(id, quantity)`
Adds a product to the cart.

### `updateItem(item_key, quantity)`
Updates the quantity of an item in the cart.

### `removeItem(item_key)`
Removes an item from the cart.

### `clearCart()`
Clears the entire cart.

### `registerCustomer(data)`
Registers a new customer.

### `login(username, password)`
Logs in a customer and stores the JWT token.

### `logout()`
Logs out the customer and clears the stored session.

### `getStoredUser()`
Returns the currently logged-in user data.

### `getCheckoutUrl()`
Returns the URL to the WooCommerce checkout page with the cart pre-loaded.
