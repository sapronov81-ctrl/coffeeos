export interface SubscriptionLimits {
  maxRequestsPerDay: number;
}

export function getSubscriptionLimits(
  subscriptionLevel: string | null
): SubscriptionLimits {
  switch (subscriptionLevel) {
    case "trial":
      return { maxRequestsPerDay: 50 };

    case "basic":
      return { maxRequestsPerDay: 200 };

    case "pro":
      return { maxRequestsPerDay: 1000 };

    case "premium":
      return { maxRequestsPerDay: 10000 };

    default:
      return { maxRequestsPerDay: 0 };
  }
}
