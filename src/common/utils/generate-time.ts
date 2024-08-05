export class GenerateTime {
    private static type: string;
    private static date: Date;

    constructor(type: string, date: Date) {
        GenerateTime.type = type;
        GenerateTime.date = date;
    }

    static generate(): { time: Date }[] {
        const dateString = GenerateTime.date.toISOString().slice(0, 10);
        switch (GenerateTime.type) {
            case 'M': {
                const result: { time: Date }[] = [];
                for (let hour = 8; hour <= 11; hour++) {
                    for (let minute = 0; minute < 60; minute += 30) {
                        const time = `${dateString}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00.000+00:00`;
                        result.push({ time: new Date(time) });
                    }
                }
                return result;
            }

            case 'A': {
                const result: { time: Date }[] = [];
                for (let hour = 14; hour <= 17; hour++) {
                    for (let minute = 0; minute < 60; minute += 30) {
                        const time = `${dateString}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00.000+00:00`;
                        result.push({ time: new Date(time) });
                    }
                }
                return result;
            }

            case 'E': {
                const result: { time: Date }[] = [];
                for (let hour = 19; hour <= 22; hour++) {
                    for (let minute = 0; minute < 60; minute += 30) {
                        const time = `${dateString}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00.000+00:00`;
                        result.push({ time: new Date(time) });
                    }
                }
                return result;
            }
            default:
                return [];
        }
    }
}
