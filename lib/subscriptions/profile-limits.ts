export function getProfileLimit(
  subscriptionLevel: string | null
): number {
  if (!subscriptionLevel) return 1;

  switch (subscriptionLevel) {
    case "trial":
      return 1;
    case "basic":
      return 3;
    case "pro":
      return 10;
    case "premium":
      return Infinity;
    default:
      return 1;
  }
}