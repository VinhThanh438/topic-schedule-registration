import { IGenerateTime } from './generate-time.interface';

export class GenerateTime {
    private static modId: string;
    private static type: string;
    private static date: Date;

    constructor(modId: string, type: string, date: Date) {
        GenerateTime.modId = modId;
        GenerateTime.type = type;
        GenerateTime.date = date;
    }

    public static getEndTime(startTime: string) {
        const [hours, minutes] = startTime.split(':').map(Number);
        let endTime = new Date();
        endTime.setHours(hours);
        endTime.setMinutes(minutes + 30);
        endTime.setSeconds(0);
        endTime.setMilliseconds(0);

        return endTime;
    }

    static generate(): IGenerateTime[] {
        const dateString = GenerateTime.date.toISOString().slice(0, 10);
        switch (GenerateTime.type) {
            case 'M': {
                const result: IGenerateTime[] = [];
                for (let hour = 8; hour <= 11; hour++) {
                    for (let minute = 0; minute < 60; minute += 30) {
                        const startTime = `${dateString}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00.000+00:00`;
                        const endTime = this.getEndTime(startTime);
                        result.push({
                            mod_id: GenerateTime.modId,
                            start_time: new Date(startTime),
                            end_time: endTime,
                        });
                    }
                }
                return result;
            }

            case 'A': {
                const result: IGenerateTime[] = [];
                for (let hour = 14; hour <= 17; hour++) {
                    for (let minute = 0; minute < 60; minute += 30) {
                        const startTime = `${dateString}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00.000+00:00`;
                        const endTime = this.getEndTime(startTime);
                        result.push({
                            mod_id: GenerateTime.modId,
                            start_time: new Date(startTime),
                            end_time: endTime,
                        });
                    }
                }
                return result;
            }

            case 'E': {
                const result: IGenerateTime[] = [];
                for (let hour = 19; hour <= 22; hour++) {
                    for (let minute = 0; minute < 60; minute += 30) {
                        const startTime = `${dateString}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00.000+00:00`;
                        const endTime = this.getEndTime(startTime);
                        result.push({
                            mod_id: GenerateTime.modId,
                            start_time: new Date(startTime),
                            end_time: endTime,
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
