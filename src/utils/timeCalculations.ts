import { DailySettings, WorkSession } from '../types';

const MINUTES_IN_DAY = 1440;

export const getDailyTimeStats = (date: string, dailySettings: DailySettings, workSessions: WorkSession[]) => {
    const sessionsToday = workSessions.filter(ws => ws.date === date);
    const plannedWorkMinutes = sessionsToday.reduce((acc, curr) => acc + curr.plannedMinutes, 0);
    const actualWorkMinutes = sessionsToday.reduce((acc, curr) => acc + curr.actualMinutes, 0);

    const fixedMinutes = dailySettings.sleepMinutes + dailySettings.fixedRoutineMinutes;
    const availableMinutes = Math.max(0, MINUTES_IN_DAY - fixedMinutes);
    const remainingActionableMinutes = Math.max(0, availableMinutes - plannedWorkMinutes);

    return {
        total1440: MINUTES_IN_DAY,
        fixed: fixedMinutes,
        available: availableMinutes,
        plannedWork: plannedWorkMinutes,
        actualWork: actualWorkMinutes,
        remainingActionable: remainingActionableMinutes,
        isSaturated: plannedWorkMinutes > availableMinutes
    };
};

export const canScheduleActivity = (date: string, requestedMinutes: number, dailySettings: DailySettings, workSessions: WorkSession[]): boolean => {
    const stats = getDailyTimeStats(date, dailySettings, workSessions);
    return stats.remainingActionable >= requestedMinutes;
};
