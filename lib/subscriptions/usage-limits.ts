import Redis from 'ioredis';

const redis = new Redis();

const TIER_LIMITS = {
    free: 100,
    basic: 1000,
    premium: 10000,
};

const USAGE_KEY_PREFIX = 'usage:';

export async function checkDailyLimit(userId, tier) {
    const usageKey = `${USAGE_KEY_PREFIX}${userId}`;
    const dailyLimit = TIER_LIMITS[tier];
    const currentUsage = await redis.get(usageKey) || 0;
    return currentUsage < dailyLimit;
}

export async function incrementRequestCounter(userId) {
    const usageKey = `${USAGE_KEY_PREFIX}${userId}`;
    await redis.incr(usageKey);
}

export async function resetDailyCounters() {
    const keys = await redis.keys('${USAGE_KEY_PREFIX}*');
    const pipeline = redis.pipeline();
    keys.forEach(key => pipeline.del(key));
    await pipeline.exec();
}

// Set a daily reset (using cron jobs or similar mechanism) to call resetDailyCounters function.  
