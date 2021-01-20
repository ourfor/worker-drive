export class Format {
    static units = ['B','KB','MB','GB','TB','PB','EB','ZB','YB']
    static size(total: number): string {
        const bit = parseInt(`${Math.log2(total) / 10}`)
        const result = (total / Math.pow(1024,bit)).toFixed(2)
        return `${result} ${this.units[bit]}`
    }
}