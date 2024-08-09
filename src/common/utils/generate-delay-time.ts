import moment from 'moment';

export default function generateDelayTime(startTime: string): string {
    const runTime = moment(startTime).add(1, 'minutes').toDate(); // 1 minute

    const cronTime = `${runTime.getUTCMinutes()} ${runTime.getUTCHours()} ${runTime.getUTCDate()} ${runTime.getUTCMonth() + 1} 0`;

    return cronTime;
}
