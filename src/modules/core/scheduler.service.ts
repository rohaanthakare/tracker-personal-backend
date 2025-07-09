import moment from "moment";
import schedule from "node-schedule";
import FinanceWorkflow from "../finance/workflows/finance.workflow";
import { Logger } from "../../logger";
export default class SchedulerService {
    constructor() {
        this.setupSchedulerJobs();
    }

    setupSchedulerJobs() {
        Logger.INFO(
            SchedulerService.name,
            "setupSchedulerJobs",
            "Setting up scheduler jobs"
        );
        this.setupLoanInterestCalculatorJob();
    }

    isLastDayOfMonth(date: any) {
        const m = moment(date);
        return m.isSame(m.clone().endOf('month'), 'day');
    }
    setupLoanInterestCalculatorJob() {
        Logger.INFO(
            SchedulerService.name,
            "setupLoanInterestCalculatorJob",
            "Setting up loan interest calculator scheduler job"
        );
        // schedule.scheduleJob('MIN HR * * *', () => {
        schedule.scheduleJob('00 22 * * *', () => {
            const now = new Date();
            if (this.isLastDayOfMonth(now)) {
                Logger.TRACE(
                    SchedulerService.name,
                    "setupLoanInterestCalculatorJob",
                    `Running loan credit job on the last day of the month: ${now.toISOString()}`
                );
                FinanceWorkflow.creditLoanInterestWorkflow();
                // Add your job logic here
            }
        });
    }
}