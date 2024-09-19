import React, { useCallback, useState } from 'react';
import useWatch from './useWatch';

export default function useSavedState(initValue, cacheKey, options = {}) {
    const { getCachedCallback = (v => v), expirationDays } = options;


    const [value, setValue] = useState(() => {
        const cachedItem = localStorage.getItem(cacheKey);
        if (cachedItem) {
            const parsedItem = JSON.parse(cachedItem);
            if (parsedItem.expiresAt > Date.now()) {
                return getCachedCallback(parsedItem.value);
            } else {
                localStorage.removeItem(cacheKey); // Remove expired data
            }
        }
        return getCachedCallback(initValue);
    });

    useWatch(() => {
        if (value === null || value === undefined) {
            localStorage.removeItem(cacheKey);
            return;
        }
        const expiresAt = Date.now() + (expirationDays || 7) * 24 * 60 * 60 * 1000; // 7 days in milliseconds
        const cachedValue = { value, expiresAt };
        localStorage.setItem(cacheKey, JSON.stringify(cachedValue));
    }, [value]);

    if (cacheKey === undefined || cacheKey === null) {
        throw new Error('Please insert cacheKey');
    }

    const clearCache = useCallback(() => localStorage.removeItem(cacheKey), []);

    return [
        value,
        setValue,
        clearCache,
    ];
}
