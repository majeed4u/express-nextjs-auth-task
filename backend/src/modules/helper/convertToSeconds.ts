export function convertToSeconds(expiration: string): number {
    const match = expiration.match(/^(\d+)([smhd])$/)
    if (!match) return 900;
    const value = parseInt(match[1], 10)
    const unit = match[2]
    switch (unit) {
        case "s": return value;
        case "m": return value * 60;
        case "h": return value * 60 * 60;
        case "d": return value * 60 * 60 * 24;
        default: return 900;
    }
}
