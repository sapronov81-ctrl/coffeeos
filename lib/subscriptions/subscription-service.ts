// subscription-service.ts

class SubscriptionService {
    private subscriptionsDB: { [userId: string]: Subscription } = {};

    constructor() {}

    getUserSubscription(userId: string): Subscription | null {
        return this.subscriptionsDB[userId] || null;
    }

    createSubscription(userId: string, profileCount: number, pricePerProfile: number): Subscription {
        const subscription: Subscription = {
            userId,
            profileCount,
            status: 'active',
            totalPrice: this.calculateSubscriptionPricing(profileCount, pricePerProfile)
        };
        this.subscriptionsDB[userId] = subscription;
        return subscription;
    }

    updateSubscriptionStatus(userId: string, newStatus: string): Subscription | null {
        const subscription = this.getUserSubscription(userId);
        if (subscription) {
            subscription.status = newStatus;
        }
        return subscription;
    }

    calculateSubscriptionPricing(profileCount: number, pricePerProfile: number): number {
        return profileCount * pricePerProfile;
    }
}

interface Subscription {
    userId: string;
    profileCount: number;
    status: 'active' | 'inactive';
    totalPrice: number;
}

export default SubscriptionService;