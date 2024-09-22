const THRESHOLDS = {
    ec: { min: 1.0, max: 2.5 },
    ph: { min: 6.0, max: 8.0 },
    do: { min: 4.0, max: 10.0 },
    temperature: { min: 15.0, max: 30.0 }
};

export const checkThresholds = (data) => {
    let notifications = [];
    if (data.ec < THRESHOLDS.ec.min || data.ec > THRESHOLDS.ec.max) {
        notifications.push(`EC value (${data.ec}) out of range.`);
    }
    if (data.ph < THRESHOLDS.ph.min || data.ph > THRESHOLDS.ph.max) {
        notifications.push(`pH value (${data.ph}) out of range.`);
    }
    if (data.do < THRESHOLDS.do.min || data.do > THRESHOLDS.do.max) {
        notifications.push(`DO value (${data.do}) out of range.`);
    }
    if (data.temperature < THRESHOLDS.temperature.min || data.temperature > THRESHOLDS.temperature.max) {
        notifications.push(`Temperature value (${data.temperature}) out of range.`);
    }
    return notifications;
};

export const createNotification = (notifications) => {
    // Implement notification creation logic, e.g., API call to create a notification
};
