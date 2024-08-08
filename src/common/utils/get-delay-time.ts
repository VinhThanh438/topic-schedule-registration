export default function getDelayTime(startTime: number) {
    const currentTime = Date.now();
    const delayTime = startTime - currentTime;
    return delayTime;
}
