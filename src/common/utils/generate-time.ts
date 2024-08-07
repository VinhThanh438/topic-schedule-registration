import { IGenerateTime } from "./generate-time.interface";

export class GenerateTime {
    private static modId: string;
    private static type: string;
    private static date: string;

    constructor(modId: string, type: string, date: string) {
        GenerateTime.modId = modId
        GenerateTime.type = type;
        GenerateTime.date = date;
    }

    public static formatTime(hour: number, minute: number) {
        return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    }

    public static generate(): IGenerateTime[] {
        const parseString = this.date.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1')
        switch (this.type) {
            case 'M': { // Morning
                const result: IGenerateTime[] = [];
                for (let hour = 8; hour <= 11; hour++) {
                    for (let minute = 0; minute < 60; minute += 30) {
                        const dateString:string = parseString + `T${this.formatTime(hour, minute)}:00.000Z`
                        let startTime = Date.parse(dateString) // Unix timestamp
                        let endTime = startTime + 1800000;
                        result.push({
                            mod_id: this.modId,
                            start_time: startTime,
                            end_time: endTime
                        });
                    }
                }
                return result;
            }

            case 'A': { // Afternoon
                const result: IGenerateTime[] = [];
                for (let hour = 14; hour <= 17; hour++) {
                    for (let minute = 0; minute < 60; minute += 30) {
                        const dateString:string = parseString + `T${this.formatTime(hour, minute)}:00.000Z`
                        let startTime = Date.parse(dateString) // Unix timestamp
                        let endTime = startTime + 1800000;
                        result.push({
                            mod_id: this.modId,
                            start_time: startTime,
                            end_time: endTime
                        });
                    }
                }
                return result;
            }

            case 'E': { // Evening
                const result: IGenerateTime[] = [];
                for (let hour = 19; hour <= 22; hour++) {
                    for (let minute = 0; minute < 60; minute += 30) {
                        const dateString:string = parseString + `T${this.formatTime(hour, minute)}:00.000Z`
                        let startTime = Date.parse(dateString) // Unix timestamp
                        let endTime = startTime + 1800000;
                        result.push({
                            mod_id: this.modId,
                            start_time: startTime,
                            end_time: endTime
                        });
                    }
                }
                return result;
            }
            default:
                return [];
        }
    }
}
