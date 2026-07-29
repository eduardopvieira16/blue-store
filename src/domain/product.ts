export interface Product {
    id: string;
    slug: string;
    name: string;
    category: string;
    description: string;
    details: string[];
    priceCents: number;
    previousPriceCents?: number;
    stock: number;
    rating: number;
    reviews: number;
    image: string;
    badge?: string;
}
export interface CartItem {
    productId: string;
    quantity: number;
}
export interface Order {
    id: string;
    createdAt: string;
    totalCents: number;
    items: Array<{
        productId: string;
        quantity: number;
        priceCents: number;
    }>;
    customer: {
        name: string;
        email: string;
        city: string;
    };
    status: 'confirmado';
}
