import { dbContext } from "../db/DbContext";
import { BadRequest } from "../utils/Errors";
import moment from "moment";
import { timeCalculator } from "./TimeCalculator";

class ProjectViewModelBuilder {
  async generateViewModel(project) {
    project.TimeClocks = await dbContext.TimeClock.find({ ProjectId: project._id });


    let payPeriodGroups = await generatePayPeriods(project);
  }

  async generatePayPeriods(project) {
    let groupedTCs = await groupTimeClocks(project.TimeClocks)
    let i = 0;
    while (i < project.InvoiceGroups.length) {
      let payPeriod = await generatePayPeriod(project, i, groupedTCs);
      i++;
    }
  }

  async generatePayPeriod(project, index, groupedTCs) {
    let weeksStart = moment(project.InvoiceGroups[i].StartDay);
    let weeksEnd = moment(project.InvoiceGroups[index].StartDay).add(6, "days");

    //"Total" will include rounded amounts as well. Just the added up amount of everything
    let payPeriod = {
      Weeks: [],
      TotalHours: 0,
      TotalHHMM: "",
      TotalPay: 0
    };

    while (weeksEnd.isSameOrBefore(moment(project.InvoiceGroups[index].EndDay))) {
      let weeksTCs = await getDaysByRange(groupedTCs, weeksStart, weeksEnd)
      let week = generateWeek(project, weeksStart, weeksEnd);
      payPeriod.Weeks.push(week);
      TotalHours += week.TotalHours;
      weeksStart = weeksStart.add(7, "days");
      weeksEnd = weeksEnd.add(7, "days");
    }

    payPeriod.TotalHHMM = await timeCalculator.caluclateHHMM(payPeriod.TotalHours);

    // !TODO need to build a calculator to handle this due to hourly/salary pay types
    // payPeriod.TotalPay = 

    return payPeriod;

  }

  async generateWeek(project, weeksStart, weeksEnd) {
    let week = {
      readable: weeksStart.format("MM/DD/YYYY") + " - " + weeksEnd.format("MM/DD/YYYY"),
      StartDay: weeksStart,
      EndDay: weeksEnd,
      TotalHours: 0,
      TotalHHMM: 0
    }
    //build function to group tcs into days within the week's range
    let days = []
    let dayDate = moment(weeksStart)
    while (dayDate.isSameOrBefore(weeksEnd)) {
      let day = 
      
    }

  }



  //returns an array of timeClocks grouped into their days
  groupTimeClocks(timeClocks) {
    let finishedArr = [];
    while (timeClocks.length > 0) {
      let dayArr = [];
      let i = 0;
      dayArr.push(timeClocks[0]);
      timeClocks.splice(0, 1);
      while (i < timeClocks.length) {
        if (
          moment(dayArr[0].StartTime).isSame(timeClocks[i].StartTime, "day")
        ) {
          dayArr.push(timeClocks[i]);
          timeClocks.splice(i, 1);
        } else i++;
      }
      dayArr.sort((a, b) => moment(a.StartTime).format('HH') - moment(b.StartTime).format('HH'))
      finishedArr.push(dayArr);
    }
    finishedArr.sort((a, b) =>
      (moment(a[0].StartTime).format("MM")
        + moment(a[0].StartTime).format("DD"))
      - (moment(b[0].StartTime).format("MM")
        + moment(b[0].StartTime).format("DD")))

  }


  getDaysByRange(groupedTCs, weeksStart, weeksEnd) {
    let res = []
    let days = []
    let nextDay = weeksStart

    while (nextDay.isSameOrBefore(weeksEnd)) {
      let day = nextDay.format("DD")
      days.push(day)
      nextDay = nextDay.add(1, "day")
    }

    let i = 0
    while (i < days.length) {
      let foundDay = groupedTCs.find(tcs => moment(tcs[0].StartTime).format("DD") == days[i])
      if (foundDay) {
        res.push({})
      }
      i++
    }

    return res
  }

}
export const projectViewModelBuilder = new ProjectViewModelBuilder();
