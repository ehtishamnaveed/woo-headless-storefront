import axios, { AxiosInstance, AxiosResponse } from 'axios';

/**
 * Professional CoCart & WooCommerce Headless SDK
 * Designed for high performance and ease of use.
 */

// --- Types & Interfaces ---

export interface SDKConfig {
    siteURL: string;
    timeout?: number;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export interface Product {
    id: number;
    name: string;
    slug: string;
    price: string;
    regularPrice: string;
    salePrice: string;
    onSale: boolean;
    description: string;
    shortDescription: string;
    images: Array<{ id: number; src: string; alt: string }>;
    categories: Array<{ id: number; name: string; slug: string }>;
    stockStatus: string;
    stockQuantity: number | null;
}

export interface CartData {
    items: any[];
    totals: {
        total: string;
        currency: string;
    };
    itemCount: number;
}

// --- SDK Implementation ---

export class CoCartSDK {
    private api: AxiosInstance;
    private siteURL: string;

    constructor(config: SDKConfig) {
        this.siteURL = config.siteURL.replace(/\/$/, '');
        this.api = axios.create({
            baseURL: `${this.siteURL}/wp-json/cocart/v2`,
            timeout: config.timeout || 10000,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });
    }

    // --- Authentication ---

    /**
     * Authenticate a user and store the token.
     */
    async login(username: string, password: string): Promise<ApiResponse<any>> {
        try {
            const response = await axios.post(`${this.siteURL}/wp-json/jwt-auth/v1/token`, {
                username,
                password
            });
            if (response.data.token) {
                localStorage.setItem('wc_user_token', response.data.token);
                localStorage.setItem('wc_user_data', JSON.stringify(response.data));
                return { success: true, data: response.data };
            }
            return { success: false, error: 'Authentication failed: No token received.' };
        } catch (error: any) {
            return this.handleError(error);
        }
    }

    /**
     * Log out and clear session data.
     */
    logout(): void {
        localStorage.removeItem('wc_user_token');
        localStorage.removeItem('wc_user_data');
    }

    /**
     * Get the currently logged-in user data.
     */
    getAuthenticatedUser(): any {
        const data = localStorage.getItem('wc_user_data');
        return data ? JSON.parse(data) : null;
    }

    // --- Products ---

    /**
     * Fetch all products (supports the Products Cache plugin).
     */
    async getProducts(params: any = {}): Promise<ApiResponse<Product[]>> {
        try {
            const response = await this.api.get('/products', { params });
            return { success: true, data: response.data };
        } catch (error: any) {
            return this.handleError(error);
        }
    }

    /**
     * Fetch a single product by ID.
     */
    async getProduct(id: number): Promise<ApiResponse<Product>> {
        try {
            const response = await this.api.get(`/products/${id}`);
            return { success: true, data: response.data };
        } catch (error: any) {
            return this.handleError(error);
        }
    }

    // --- Cart Management ---

    private getCartKey(): string {
        return localStorage.getItem('cocart_cart_key') || '';
    }

    private saveCartKey(key: string): void {
        localStorage.setItem('cocart_cart_key', key);
    }

    /**
     * Fetch current cart data.
     */
    async getCart(): Promise<ApiResponse<CartData>> {
        try {
            const cartKey = this.getCartKey();
            if (!cartKey) {
                return { success: true, data: { items: [], totals: { total: '0', currency: '' }, itemCount: 0 } };
            }
            const response = await this.api.get('/cart', { params: { cart_key: cartKey } });
            return { success: true, data: response.data };
        } catch (error: any) {
            return this.handleError(error);
        }
    }

    /**
     * Add an item to the cart.
     */
    async addToCart(productId: string, quantity: string = '1'): Promise<ApiResponse<any>> {
        try {
            const cartKey = this.getCartKey();
            const response = await this.api.post('/cart/add-item', {
                id: productId,
                quantity
            }, {
                params: { cart_key: cartKey }
            });

            if (response.data.cart_key) {
                this.saveCartKey(response.data.cart_key);
            }

            return { success: true, data: response.data };
        } catch (error: any) {
            return this.handleError(error);
        }
    }

    /**
     * Update item quantity in cart.
     */
    async updateCartItem(itemKey: string, quantity: string): Promise<ApiResponse<any>> {
        try {
            const cartKey = this.getCartKey();
            const response = await this.api.post(`/cart/item/${itemKey}`, {
                quantity
            }, {
                params: { cart_key: cartKey }
            });
            return { success: true, data: response.data };
        } catch (error: any) {
            return this.handleError(error);
        }
    }

    /**
     * Remove an item from the cart.
     */
    async removeCartItem(itemKey: string): Promise<ApiResponse<any>> {
        try {
            const cartKey = this.getCartKey();
            const response = await this.api.delete(`/cart/item/${itemKey}`, {
                params: { cart_key: cartKey }
            });
            return { success: true, data: response.data };
        } catch (error: any) {
            return this.handleError(error);
        }
    }

    /**
     * Clear the entire cart.
     */
    async clearCart(): Promise<ApiResponse<any>> {
        try {
            const cartKey = this.getCartKey();
            await this.api.delete('/cart/clear', { params: { cart_key: cartKey } });
            return { success: true };
        } catch (error: any) {
            return this.handleError(error);
        }
    }

    // --- Checkout ---

    /**
     * Get the checkout redirect URL.
     */
    getCheckoutUrl(): string {
        const cartKey = this.getCartKey();
        return `${this.siteURL}/checkout/?cocart-load-cart=${cartKey}`;
    }

    // --- Internal Helpers ---

    private handleError(error: any): ApiResponse<any> {
        const message = error.response?.data?.message || error.message || 'An unknown error occurred.';
        console.error('CoCart SDK Error:', message);
        return { success: false, error: message };
    }
}
