export const getCurrentTimeAdjusted = (): Date => {
    const currentTime = new Date();
    const offsetInMinutes = currentTime.getTimezoneOffset();
    const currentTimeAdjusted = new Date(currentTime.getTime() - offsetInMinutes * 60 * 1000);

    return currentTimeAdjusted;
};
