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

class PayPeriodViewModelBuilder {
  async generatePayPeriod(PP) {

    let currentWeekStart = moment(PP.StartDay);
    let currentWeekEnd = moment(PP.StartDay).add(6, "days");

    //"Total" will include rounded amounts as well. Just the added up amount of everything
    let payPeriod = {
      weeks: [],
      totalTime: 0,
      readableTime: "0:00",
      totalPay: 0
    };


    //this loop will create week objects from the start of the Pay Period to the end
    while (currentWeekEnd.isSameOrBefore(moment(PP.EndDay))) {

      //days = array of "MM/DD/YYYY" days
      let days = _createDayRange(currentWeekStart, currentWeekEnd);

      let week = await this.generateWeek(PP.ProjectId, currentWeekStart, currentWeekEnd, days);

      payPeriod.weeks.push(week);

      payPeriod.totalTime += week.totalTime;

      //this just sets up the next week. The loop will check if this is within the bounds of the Pay Period
      currentWeekStart = currentWeekStart.add(7, "days");
      currentWeekEnd = currentWeekEnd.add(7, "days");
    }

    if (payPeriod.totalTime > 0) {
      payPeriod.readableTime = await timeCalculator.caluclateHHMM(payPeriod.totalTime);
    }

    // !TODO need to build a calculator to handle this due to hourly/salary pay types
    // payPeriod.TotalPay = 

    return payPeriod;

  }

  async generateWeek(id, weeksStart, weeksEnd, days) {

    let week = {
      readableDate: weeksStart.format("MM/DD/YYYY") + " - " + weeksEnd.format("MM/DD/YYYY"),
      startDay: weeksStart,
      endDay: weeksEnd,
      days: [],
      readableTime: "0:00",
      totalTime: 0
    };

    let PS = await dbContext.ProjectSettings.findOne({ ProjectId: id });

    let i = 0;
    while (i < days.length) {

      let day = await this.generateDay(days[i], PS);
      week.days.push(day);
      week.totalTime += day.totalTime;

      i++
    }

    if (week.totalTime > 0) {
      week.TotalHHMM = await timeCalculator.caluclateHHMM();
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
    let i = 0;
    while (i < TCs.length) {
      totalTime += TCs[i].TCTotalHours
      i++
    };

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
      totalTime: totalTime
    };

    return dayObj;
  }






}
export const payPeriodViewModelBuilder = new PayPeriodViewModelBuilder();
