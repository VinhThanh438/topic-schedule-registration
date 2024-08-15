import moment from 'moment';

export default function generateDelayTime(startTime: string): string {
    const runTime = moment(startTime).add(28, 'minutes').toDate(); // 28 minutes

    const cronTime = `${runTime.getUTCMinutes()} ${runTime.getUTCHours()} ${runTime.getUTCDate()} ${runTime.getUTCMonth() + 1} 0`;

    return cronTime;
}
