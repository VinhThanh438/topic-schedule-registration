import { ModScheduleTypes } from '@common/constants/mod-schedule-types';
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

    public static getEndTime(startTime: string): string {
        const startDate = new Date(startTime);
        const endDate = new Date(startDate.getTime() + 30 * 60 * 1000); // Add 30 minutes
        return endDate.toISOString();
    }

    static generate(): IGenerateTime[] {
        const dateString = GenerateTime.date.toISOString().slice(0, 10);
        switch (GenerateTime.type) {
            case ModScheduleTypes.MORNING: {
                const result: IGenerateTime[] = [];
                for (let hour = 8; hour <= 11; hour++) {
                    for (let minute = 0; minute < 60; minute += 30) {
                        const startTime = `${dateString}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00.000+00:00`;
                        const endTime = this.getEndTime(startTime);
                        result.push({
                            mod_id: GenerateTime.modId,
                            start_time: new Date(startTime),
                            end_time: new Date(endTime),
                        });
                    }
                }
                return result;
            }

            case ModScheduleTypes.AFTERNOON: {
                const result: IGenerateTime[] = [];
                for (let hour = 14; hour <= 17; hour++) {
                    for (let minute = 0; minute < 60; minute += 30) {
                        const startTime = `${dateString}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00.000+00:00`;
                        const endTime = this.getEndTime(startTime);
                        result.push({
                            mod_id: GenerateTime.modId,
                            start_time: new Date(startTime),
                            end_time: new Date(endTime),
                        });
                    }
                }
                return result;
            }

            case ModScheduleTypes.EVENING: {
                const result: IGenerateTime[] = [];
                for (let hour = 19; hour <= 22; hour++) {
                    for (let minute = 0; minute < 60; minute += 30) {
                        const startTime = `${dateString}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00.000+00:00`;
                        const endTime = this.getEndTime(startTime);
                        result.push({
                            mod_id: GenerateTime.modId,
                            start_time: new Date(startTime),
                            end_time: new Date(endTime),
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
