import { dbContext } from "../db/DbContext";
import { BadRequest } from "../utils/Errors";
import moment from "moment";
import { timeCalculator } from "./TimeCalculator";
import { payPeriodsService } from "./PayPeriodsService";

function _createDayRange(weeksStart, weeksEnd) {
  let days = []
  let nextDay = weeksStart

  //sets up the number of days to create
  while (nextDay.isSameOrBefore(weeksEnd)) {
    let day = nextDay.format("MM/DD/YYYY")
    days.push(day)
    nextDay = nextDay.add(1, "day")
  }

  return days
}

function _calculateHourlyPay(week, project) {

  if (week.totalTime > 40 && project.ProjectSettings.OT) {
    week.regTime = 40;
    week.overTime = week.totalTime - 40;
    week.regPay = project.Rate * 40;
    week.OTPay = project.Rate * project.ProjectSettings.OTRate * week.overTime;
    week.totalPay = week.regPay + week.OTPay;
  } else {
    week.totalPay = project.Rate * week.totalTime;
    week.totalPay = Math.round((week.totalPay + Number.EPSILON) * 100) / 100;
  }

  return week;

}

function _calculateSalaryPay(week, project) {
  let fullDays = Math.floor(week.totalTime / 8);
  if (fullDays > 5) {
    fullDays = 5
  }
  //Rate = yearly pay. 261 is the number of weekdays in a (non-leap) year. Rate / 261 calculates the daily rate;
  week.totalPay = fullDays * (project.Rate / 261);
  week.totalPay = weeks.totalPay.toFixed(2);

  return week;
}

class PayPeriodViewModelBuilder {
  async generatePayPeriod(payPeriod) {

    //need to reset totals to 0 so the server can recalculate and update correctly
    payPeriod.TotalPay = 0;
    payPeriod.TotalTime = 0;
    payPeriod.ReadableTime = "0:00";

    let currentWeekStart = moment(payPeriod.StartDay);
    let currentWeekEnd = moment(payPeriod.StartDay).add(6, "days");

    //this loop will create week objects from the start of the Pay Period to the end
    while (currentWeekEnd.isSameOrBefore(moment(payPeriod.EndDay))) {

      //days = array of days formatted as "MM/DD/YYYY"
      let days = _createDayRange(currentWeekStart, currentWeekEnd);

      let week = await this.generateWeek(payPeriod.ProjectId, currentWeekStart, currentWeekEnd, days);

      payPeriod.Weeks.push(week);

      payPeriod.TotalTime += week.totalTime;
      payPeriod.TotalPay += week.totalPay;

      //this just sets up the next week. The loop will check if this is within the bounds of the Pay Period
      currentWeekStart = currentWeekStart.add(7, "days");
      currentWeekEnd = currentWeekEnd.add(7, "days");
    }

    if (payPeriod.TotalTime > 0) {
      payPeriod.ReadableTime = await timeCalculator.caluclateHHMM(payPeriod.TotalTime);
      await payPeriodsService.updatePayPeriodTimes(payPeriod);
    }

    return payPeriod;

  }

  async generateWeek(projectId, weeksStart, weeksEnd, days) {

    let week = {
      readableDates: days[0] + " - " + days[days.length - 1],
      startDay: weeksStart,
      endDay: weeksEnd,
      days: [],
      readableTime: "0:00",
      totalTime: 0,
      regTime: 0,
      overTime: 0,
      totalPay: 0,
      regPay: 0,
      OTPay: 0
    };

    let project = await dbContext.Project.findById(projectId).populate("ProjectSettings");

    let i = 0;
    while (i < days.length) {

      let day = await this.generateDay(days[i], project.ProjectSettings);
      week.days.push(day);
      week.totalTime += day.totalTime;

      i++
    }

    if (week.totalTime > 0) {
      week.readableTime = await timeCalculator.caluclateHHMM(week.totalTime);
    }

    if (project.PayType == "Hourly") {
      week = await _calculateHourlyPay(week, project);
    } else if (project.PayType == "Salary") {
      week = await _calculateSalaryPay(week, project);
    } else if (project.PayType == "Milestone") {

    }

    return week

  }

  async generateDay(day, PS) {
    let TCs = await dbContext.TimeClock.find({
      StartTime: {
        $gte: moment(day).startOf('day'),
        $lt: moment(day).startOf('day').add(1, 'day')
      },
      ProjectId: PS.ProjectId
    });

    let totalTime = 0;
    let activeTC;
    let service = "";
    let i = 0;
    while (i < TCs.length) {
      if (!TCs[i].EndTime) {
        activeTC = TCs[i];
      } else {
        totalTime += TCs[i].TCTotalHours;
      }

      if (!service.includes(TCs[i].Comment)) {
        if (service != "") {
          service += " / ";
        }
        service += TCs[i].Comment;
      }

      i++;
    };

    totalTime = Math.round((totalTime + Number.EPSILON) * 100) / 100;

    let readableTime = "0:00";
    if (totalTime > 0) {
      if (PS.RoundTime) {
        totalTime = await timeCalculator.roundTime(totalTime, PS.RoundTo);
      }
      readableTime = await timeCalculator.caluclateHHMM(totalTime);
    }

    let dayObj = {
      readableDate: day,
      tcs: TCs,
      readableTime: readableTime,
      totalTime: totalTime,
      activeTC: activeTC,
      service: service
    };

    return dayObj;
  }






}
export const payPeriodViewModelBuilder = new PayPeriodViewModelBuilder();
