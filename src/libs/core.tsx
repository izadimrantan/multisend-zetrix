export function setLocalStorageItem(key: string, value: string) {
    const now = new Date()
    const expiry = new Date(now.getTime() + (30 * 60 * 1000)) // Expiry in 30 minutes

    const data = {
        value: value,
        expiry: expiry.toISOString()
    }
    localStorage.setItem(key, JSON.stringify(data))
};

export function getLocalStorageItem(key: string, defaultValue: string): string {
    const result = localStorage.getItem(key);
    if (!result) {
        return defaultValue
    }

    // Check for expiry
    const data = JSON.parse(result);
    const now = new Date()
    const expiry = new Date(data.expiry)
    if (now >= expiry) {
        // Data is expired
        localStorage.removeItem(key);
        return defaultValue
    }

    return data.value
};

export function removeLocalStorageItem(key: string) {
    localStorage.removeItem(key);
};