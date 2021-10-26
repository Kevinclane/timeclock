import { dbContext } from "../db/DbContext";
import { BadRequest } from "../utils/Errors";
import moment from "moment";
import { timeCalculator } from "./TimeCalculator";

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
    week.OTTime = week.totalTime - 40;
    week.regPay = project.Rate * 40;
    week.OTPay = project.Rate * project.ProjectSettings.OTRate * week.OTTime;
    week.totalPay = week.regPay + week.OTPay;
  } else {
    week.totalPay = project.Rate * week.totalTime;
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
  async generatePayPeriod(PP) {

    let currentWeekStart = moment(PP.StartDay);
    let currentWeekEnd = moment(PP.StartDay).add(6, "days");

    //"Total" will include rounded amounts as well. Just the added up amount of everything
    let payPeriod = {
      weeks: [],
      totalTime: 0,
      readableTime: "0:00",
      totalPay: 0,
      id: PP.id,
      startDay: PP.StartDay,
      endDay: PP.EndDay,
      readableDates: moment(PP.StartDay).format("MM/DD/YYYY") + " : " + moment(PP.EndDay).format("MM/DD/YYYY")
    };


    //this loop will create week objects from the start of the Pay Period to the end
    while (currentWeekEnd.isSameOrBefore(moment(PP.EndDay))) {

      //days = array of "MM/DD/YYYY" days
      let days = _createDayRange(currentWeekStart, currentWeekEnd);

      let week = await this.generateWeek(PP.ProjectId, currentWeekStart, currentWeekEnd, days);

      payPeriod.weeks.push(week);

      payPeriod.totalTime += week.totalTime;
      payPeriod.totalPay += week.totalPay;

      //this just sets up the next week. The loop will check if this is within the bounds of the Pay Period
      currentWeekStart = currentWeekStart.add(7, "days");
      currentWeekEnd = currentWeekEnd.add(7, "days");
    }

    if (payPeriod.totalTime > 0) {
      payPeriod.readableTime = await timeCalculator.caluclateHHMM(payPeriod.totalTime);
    }


    return payPeriod;

  }

  async generateWeek(projectId, weeksStart, weeksEnd, days) {

    let week = {
      readableDate: weeksStart.format("MM/DD/YYYY") + " - " + weeksEnd.format("MM/DD/YYYY"),
      startDay: weeksStart,
      endDay: weeksEnd,
      days: [],
      readableTime: "0:00",
      totalTime: 0,
      regTime: 0,
      OTTime: 0,
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
      }
    });

    let totalTime = 0;
    let activeTC;
    let i = 0;
    while (i < TCs.length) {
      if (!TCs[i].EndTime) {
        activeTC = TCs[i];
      } else {
        totalTime += TCs[i].TCTotalHours;
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
      activeTC: activeTC
    };

    return dayObj;
  }






}
export const payPeriodViewModelBuilder = new PayPeriodViewModelBuilder();
