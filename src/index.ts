import axios, { AxiosInstance } from "axios";

export interface ApiClient {
    getProducts(): Promise<any>;
    getCart(): Promise<any>;
    addToCart(id: string, quantity?: string): Promise<any>;
    updateItem(item_key: string, quantity: string): Promise<any>;
    removeItem(item_key: string): Promise<any>;
    clearCart(): Promise<any>;
    registerCustomer(data: any): Promise<any>;
    login(username: string, password: string): Promise<any>;
    logout(): Promise<void>;
    getStoredUser(): any;
    getCheckoutUrl(): string;
}

export default function createApiClient(siteURL: string): ApiClient {
    const baseURL = `${siteURL}/wp-json/cocart/v2`;
    const API: AxiosInstance = axios.create({
        baseURL,
        headers: { 'Accept': 'application/json' }
    });

    const getCartKey = (): string => {
        return localStorage.getItem("cart_key") || "";
    };

    const setCartKey = (cartValue: string) => {
        localStorage.setItem("cart_key", cartValue);
    };

    const formatCartData = (response: any) => {
        const minor_unit = response.currency.currency_minor_unit;
        const total_amount = response.totals.total / Math.pow(10, minor_unit);

        return {
            total_amount,
            total_items: response.item_count,
            currency_symbol: response.currency.currency_symbol,
            cart_items: response.items
        };
    };

    const formatProductsData = (response: any) => {
        return response.map((product: any) => ({
            id: String(product.id),
            name: product.name,
            slug: product.slug,
            summary: product.short_description,
            description: product.description,
            regular_price: product.prices.regular_price / Math.pow(10, product.prices.currency.currency_minor_unit),
            sale_price: product.prices.sale_price / Math.pow(10, product.prices.currency.currency_minor_unit),
            on_sale: product.prices.on_sale,
            featured_image: product.images[0]?.src || "",
            gallery: product.images.slice(1).map((img: any) => img.src),
            categories: product.categories.map((category: any) => ({
                id: String(category.id),
                name: category.name,
                slug: category.slug,
            })),
            variations: product.variations.map((variation: any) => ({
                id: String(variation.id),
                sku: variation.sku,
                regular_price: variation.prices.regular_price / Math.pow(10, variation.prices.currency.currency_minor_unit),
                sale_price: variation.prices.sale_price / Math.pow(10, variation.prices.currency.currency_minor_unit),
                on_sale: variation.prices.on_sale,
                attributes: variation.attributes,
                stock: variation.stock,
            })),
            stock: product.stock,
            weight: product.weight,
            dimensions: product.dimensions,
        }));
    };

    return {
        async getProducts() {
            try {
                const response = await API.get(`/products`);
                return { success: true, data: formatProductsData(response.data) };
            } catch (error: any) {
                return { success: false, error: error.response?.data?.message || error.message };
            }
        },

        async getCart() {
            try {
                const cart_key = getCartKey();
                if (!cart_key) return { success: true, data: { total_amount: 0, total_items: 0, currency_symbol: "$", cart_items: [] } };

                const response = await API.get(`/cart`, { params: { cart_key } });
                return { success: true, data: formatCartData(response.data) };
            } catch (error: any) {
                return { success: false, error: error.response?.data?.message || error.message };
            }
        },

        async addToCart(id: string, quantity: string = "1") {
            try {
                const cart_key = getCartKey();
                const response = await API.post(`/cart/add-item`, { id, quantity }, { params: { cart_key } });
                setCartKey(response.data.cart_key);
                return { success: true, data: response.data };
            } catch (error: any) {
                return { success: false, error: error.response?.data?.message || error.message };
            }
        },

        async updateItem(item_key: string, quantity: string) {
            try {
                const cart_key = getCartKey();
                const response = await API.post(`/cart/item/${item_key}`, { quantity }, { params: { cart_key } });
                return { success: true, data: response.data };
            } catch (error: any) {
                return { success: false, error: error.response?.data?.message || error.message };
            }
        },

        async removeItem(item_key: string) {
            try {
                const cart_key = getCartKey();
                const response = await API.delete(`/cart/item/${item_key}`, { params: { cart_key } });
                return { success: true, data: response.data };
            } catch (error: any) {
                return { success: false, error: error.response?.data?.message || error.message };
            }
        },

        async clearCart() {
            try {
                const cart_key = getCartKey();
                await API.delete(`/cart/clear`, { params: { cart_key } });
                return { success: true };
            } catch (error: any) {
                return { success: false, error: error.response?.data?.message || error.message };
            }
        },

        async registerCustomer(data: any) {
            try {
                const response = await axios.post(`${siteURL}/wp-json/headless/v1/register`, data);
                return { success: true, data: response.data };
            } catch (error: any) {
                return { success: false, error: error.response?.data?.message || error.message };
            }
        },

        async login(username: string, password: string) {
            try {
                const response = await axios.post(`${siteURL}/wp-json/jwt-auth/v1/token`, { username, password });
                if (response.data.token) {
                    localStorage.setItem("user", JSON.stringify(response.data));
                    return { success: true, data: response.data };
                }
                return { success: false, error: "Invalid login response." };
            } catch (error: any) {
                return { success: false, error: error.response?.data?.message || error.message };
            }
        },

        async logout() {
            localStorage.removeItem("user");
        },

        getStoredUser() {
            const user = localStorage.getItem("user");
            return user ? JSON.parse(user) : null;
        },

        getCheckoutUrl() {
            const cart_key = getCartKey();
            return `${siteURL}/checkout/?cocart-load-cart=${cart_key}`;
        }
    };
}
