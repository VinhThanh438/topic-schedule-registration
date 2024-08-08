const cron = require('cron');
const moment = require('moment');

const startTime = '2024-08-09T01:33:00.000+00:00';
const runTime = moment(startTime).add(1, 'minutes').toDate();
console.log(runTime);

const cronTime = `${runTime.getUTCMinutes()} ${runTime.getUTCHours()} ${runTime.getUTCDate()} ${runTime.getUTCMonth() + 1} 0`;
console.log(cronTime);
const job = new cron.CronJob(cronTime, () => {
    console.log('Cron job ran successfully!');
});

job.start();
