import { dbContext } from "../db/DbContext";
import { BadRequest } from "../utils/Errors";
import moment from "moment"


function splitTime(time) {
  time = time.toString()
  let Hours
  let Minutes
  let hasSplit = false
  if (time.includes(".")) {
    hasSplit = true
    let split = time.split(".")
    Hours = parseInt(split[0])
    Minutes = parseFloat("." + split[1])
  } else {
    Hours = parseInt(time)
    Minutes = 0
  }
  let res = {
    time: time,
    Hours: Hours,
    Minutes: Minutes,
    hasSplit: hasSplit
  }
  return res
}

function caluclateHHMM(time, roundTo) {
  let timeObj = splitTime(time)
  if (timeObj.hasSplit) {
    timeObj.Minutes = (Math.round(timeObj.Minutes * 60)).toString();
    if (timeObj.Minutes.length == 1) {
      timeObj.Minutes = "0" + timeObj.Minutes
    }
  }
  if (roundTo) {
    timeObj.Minutes = Math.round(timeObj.Minutes / roundTo) * roundTo
    // timeObj.Minutes = timeObj.Minutes * roundTo
    if (timeObj.Minutes == 60) {
      timeObj.Minutes = 0
      timeObj.Hours++
    }
    timeObj.Minutes = timeObj.Minutes.toString()
    if (timeObj.Minutes.length == 1) {
      timeObj.Minutes = "0" + timeObj.Minutes;
    }
  }
  let output = timeObj.Hours.toString() + ":" + timeObj.Minutes
  return output
}

function roundFromHoursHH(time, roundTo) {
  let timeObj = splitTime(time)
  // Minutes = (Minutes * 60).toFixed(2);
  timeObj.Minutes = Math.round((timeObj.Minutes * 60) / roundTo) * roundTo
  // timeObj.Minutes = timeObj.Minutes * roundTo
  if (timeObj.Minutes == 60) {
    timeObj.Minutes = 0
    timeObj.Hours++
  }
  timeObj.Hours = timeObj.Hours.toString();
  timeObj.Minutes = (Math.round((timeObj.Minutes / 60) * 100)).toString();
  if (timeObj.Minutes.length == 1) {
    timeObj.Minutes = timeObj.Minutes + "0";
  }
  time = parseFloat(timeObj.Hours + "." + timeObj.Minutes);
  return time;
}

async function generateDay(currentDay, project) {
  let allTCs = await dbContext.TimeClock.find({ ProjectId: project._id })
  let i = 0
  let TCs = []
  while (i < allTCs.length) {
    if (moment(currentDay).isSame(allTCs[i].StartTime, "day")) {
      TCs.push(allTCs[i])
    }
    i++
  }

  i = 0
  let DayHours = 0
  while (i < TCs.length) {
    DayHours += TCs[i].TCTotalHours
    i++
  }

  let DayHHMM

  if (project.ProjectSettings.RoundTime) {
    DayHours = await roundFromHoursHH(DayHours, project.ProjectSettings.RoundTo)
    DayHHMM = await caluclateHHMM(DayHours, project.ProjectSettings.RoundTo)
  } else {
    DayHHMM = await caluclateHHMM(DayHours)
  }

  let DayPay = null
  if (project.PayType == "Hourly") {
    DayPay = DayHours * project.Rate
  } else if (project.PayType == "Salary") {
    //!NOTE add functionality for Salary
  }

  let Day = {
    ReadableDate: moment(currentDay).format("MM/DD/YYYY"),
    Date: currentDay,
    TimeClocks: TCs,
    DayHours: DayHours,
    DayHHMM: DayHHMM,
    DayPay: DayPay,
  }
  return Day
}

async function setDays(weekStart, weekEnd, PPEnd, project) {
  let Days = []
  let currentDay = moment(weekStart)
  while (currentDay.isSameOrBefore(moment(weekEnd)) && currentDay.isSameOrBefore(moment(PPEnd))) {
    let Day = await generateDay(currentDay, project)
    Days.push(Day)
    currentDay = moment(currentDay).add(1, "days")
  }
  return Days
}

async function generateWeek(weekStart, weekEnd, PPEnd, project) {
  let ReadableDates = moment(weekStart).format("MM/DD/YYYY") + " - " + moment(weekEnd).format("MM/DD/YYYY");
  let Days = await setDays(weekStart, weekEnd, PPEnd, project)
  let WeekHours = 0
  let i = 0
  while (i < Days.length) {
    WeekHours += Days[i].DayHours
    i++
  }
  let WeekHHMM = await caluclateHHMM(WeekHours)

  let WeekPay = 0
  i = 0
  while (i < Days.length) {
    WeekPay += Days[i].DayPay
    i++
  }

  let Week = {
    ReadableDates: ReadableDates,
    WeekStart: weekStart,
    WeekEnd: weekEnd,
    Days: Days,
    WeekHours: WeekHours,
    WeekHHMM: WeekHHMM,
    WeekPay: WeekPay
  }

  return Week
}

async function setWeeks(project, StartDay, EndDay) {
  let Weeks = []
  let weekStart = moment(StartDay)
  let PPEnd = moment(EndDay)
  //this loop should go until all of the weeks have been created
  while (moment(weekStart).isSameOrBefore(PPEnd)) {
    let weekEnd = moment(weekStart).add(6, "days")
    let Week = await generateWeek(weekStart, weekEnd, PPEnd, project)
    Weeks.push(Week)
    weekStart = moment(weekStart).add(7, "days")
  }
  return Weeks
}


async function updatePayPeriodRouter(ppObj, type) {
  let data
  if (type == "Weekly") {
    data = await updateWeeklyPayPeriod(ppObj, 7)
  } else if (type == "Bi-Weekly") {
    data = await updateWeeklyPayPeriod(ppObj, 14)
  } else if (type == "FirstAndFive") {
    data = await updateFirstAndFivePayPeriod(ppObj)
  } else if (type == "Monthly") {
    data = await updateMonthlyPayPeriod(ppObj)
  }
  return data
}

async function updateWeeklyPayPeriod(ppObj, x) {
  let today = moment()
  let currentPP = { ...ppObj }
  let currentInvoiceNumber = ppObj.InvoiceNumber + 1
  let newPPs = []
  while (today.isAfter(moment(currentPP.EndDay))) {
    let rawObj = {
      ProjectId: ppObj.ProjectId,
      CreatorEmail: ppObj.CreatorEmail,
      StartDay: moment(currentPP.StartDay).add(x, "days"),
      EndDay: moment(currentPP.EndDay).add(x, "days"),
      InvoiceNumber: currentInvoiceNumber
    }
    currentInvoiceNumber++
    let newPP = await dbContext.PayPeriod.create(rawObj)
    currentPP = newPP
    newPPs.push(newPP)
  }
  return newPPs
}

async function updateFirstAndFivePayPeriod(ppObj) {
  let today = moment()
  let currentPP = { ...ppObj }
  let currentInvoiceNumber = ppObj.InvoiceNumber + 1
  let newPPs = []
  while (today.isAfter(moment(currentPP.EndDay))) {
    let rawObj = {
      ProjectId: ppObj.ProjectId,
      CreatorEmail: ppObj.CreatorEmail,
      InvoiceNumber: currentInvoiceNumber
    }
    currentInvoiceNumber++
    let e = parseInt(moment(currentPP.EndDay).format("DD"))
    if (e >= 28) {
      let nextYearMo = moment(ppObj.EndDay).add(1, "month").format("YYYY-MM")
      rawObj.EndDay = moment(nextYearMo + "14")
      rawObj.StartDay = moment(nextYearMo + "1")
    } else {
      let thisYearMo = moment(ppObj.EndDay).format("YYYY-MM")
      let lastDay = moment(ppObj.EndDay).endOf("month").format("DD")
      rawObj.EndDay = moment(thisYearMo + "-" + lastDay)
      rawObj.StartDay = moment(thisYearMo + "14")
    }

    let newPP = await dbContext.PayPeriod.create(rawObj)
    currentPP = newPP
    newPPs.push(newPP)
  }
  return newPPs
}

async function updateMonthlyPayPeriod(ppObj) {
  let today = moment()
  let currentPP = { ...ppObj }
  let currentInvoiceNumber = ppObj.InvoiceNumber + 1
  let newPPs = []
  while (today.isAfter(moment(currentPP.EndDay))) {
    let rawObj = {
      ProjectId: ppObj.ProjectId,
      CreatorEmail: ppObj.CreatorEmail,
      StartDay: moment(currentPP.StartDay).add(1, "month"),
      EndDay: moment(currentPP.EndDay).add(1, "month"),
      InvoiceNumber: currentInvoiceNumber
    }
    currentInvoiceNumber++
    let newPP = await dbContext.PayPeriod.create(rawObj)
    currentPP = newPP
    newPPs.push(newPP)
  }
  return newPPs
}

class PayPeriodsService {
  async getPayPeriods(email, project) {
    let data = await dbContext.PayPeriod.find({
      CreatorEmail: email,
      ProjectId: project._id
    }).lean()
    let currentCheck = moment().isAfter(moment(data[data.length - 1].EndDay))
    if (currentCheck) {
      let newPPs = await updatePayPeriodRouter(data[data.length - 1], project.PayPeriod)
      let i = 0
      while (i < newPPs.length) {
        data.push(newPPs[i])
        i++
      }
    }
    data[data.length - 1].Current = true
    return data
  }
  async initializePayPeriods(project) {
    let payPeriodObject = {
      ProjectId: project._id,
      CreatorEmail: project.CreatorEmail,
      InvoiceNumber: 1,
      Weeks: [],
      ReadableDates: "",
      PPHours: 0,
      PPPay: 0,
      PPHHMM: ""
    }

    let formattedStart = moment(project.StartDay).format("MM/DD/YYYY")
    let formattedEnd = moment(project.EndDay).format("MM/DD/YYYY")
    payPeriodOBject.ReadableDates = formattedStart + " - " + formattedEnd

    if (project.PayPeriod == "Weekly" || project.PayPeriod == "Bi-Weekly" || project.PayPeriod == "FirstAndFive") {
      payPeriodObject.StartDay = project.Start
      payPeriodObject.EndDay = project.End

    } else if (project.PayPeriod == "Monthly") {

      if (project.InvoiceDay == "Last") {
        let yearMo = moment().format("YYYY-MM")
        let lastDay = moment().daysInMonth()
        payPeriodObject.StartDay = moment(yearMo + '-01')
        payPeriodObject.EndDay = moment(yearMo + "-" + lastDay)

      } else {
        let today = moment().format("DD")
        if (parseInt(today) <= parseInt(project.InvoiceDay)) {
          let day = parseInt(project.InvoiceDay)
          if (day < 10) {
            day = '0' + day.toString()
          } else day = day.toString()
          let nowYearMo = moment().format('YYYY-MM')
          payPeriodObject.EndDay = moment(nowYearMo + "-" + day)
          let startYearMo = moment().subtract(1, "month").format('YYYY-MM')
          let day2 = parseInt(day) + 1
          if (day2 < 10) {
            day2 = "0" + day2.toString()
          } else day2 = day2.toString()
          payPeriodObject.StartDay = moment(startYearMo + "-" + day2)
        } else {
          let day = parseInt(project.InvoiceDay) + 1
          if (day < 10) {
            day = '0' + day.toString()
          } else day = day.toString()
          let nowYearMo = moment().format('YYYY-MM')
          payPeriodObject.StartDay = moment(nowYearMo + "-" + day)

          let day2 = parseInt(project.InvoiceDay)
          if (day2 < 10) {
            day2 = "0" + day2.toString()
          } else day2 = day2.toString()
          let endYearMo = moment().add(1, "month").format('YYYY-MM')
          payPeriodObject.EndDay = moment(endYearMo + "-" + day2)
        }
      }
    }

    payPeriodObject.Weeks = await setWeeks(project, payPeriodOBject.StartDay, payPeriodOBject.EndDay)
    let x = 0

    while (x < Weeks.length) {
      payPeriodObject.PPHours += Weeks[x].WeekHours
      payPeriodObject.PPPay += Weeks[x].WeekPay
      x++
    }
    payPeriodObject.PPHHMM = await caluclateHHMM(PPHours)

    let data = await dbContext.PayPeriod.create(payPeriodObject)
    return data
  }
  // async createFirstPayPeriod(email, project) {
  //   let payPeriodObject = {
  //     ProjectId: project._id,
  //     CreatorEmail: email,
  //     InvoiceNumber: 1
  //   }

  //   if (project.PayPeriod == "Weekly" || project.PayPeriod == "Bi-Weekly" || project.PayPeriod == "FirstAndFive") {
  //     payPeriodObject.StartDay = project.Start
  //     payPeriodObject.EndDay = project.End

  //   } else if (project.PayPeriod == "Monthly") {

  //     if (project.InvoiceDay == "Last") {
  //       let yearMo = moment().format("YYYY-MM")
  //       let lastDay = moment().daysInMonth()
  //       payPeriodObject.StartDay = moment(yearMo + '-01')
  //       payPeriodObject.EndDay = moment(yearMo + "-" + lastDay)

  //     } else {
  //       let today = moment().format("DD")
  //       if (parseInt(today) <= parseInt(project.InvoiceDay)) {
  //         let day = parseInt(project.InvoiceDay)
  //         if (day < 10) {
  //           day = '0' + day.toString()
  //         } else day = day.toString()
  //         let nowYearMo = moment().format('YYYY-MM')
  //         payPeriodObject.EndDay = moment(nowYearMo + "-" + day)
  //         let startYearMo = moment().subtract(1, "month").format('YYYY-MM')
  //         let day2 = parseInt(day) + 1
  //         if (day2 < 10) {
  //           day2 = "0" + day2.toString()
  //         } else day2 = day2.toString()
  //         payPeriodObject.StartDay = moment(startYearMo + "-" + day2)
  //       } else {
  //         let day = parseInt(project.InvoiceDay) + 1
  //         if (day < 10) {
  //           day = '0' + day.toString()
  //         } else day = day.toString()
  //         let nowYearMo = moment().format('YYYY-MM')
  //         payPeriodObject.StartDay = moment(nowYearMo + "-" + day)

  //         let day2 = parseInt(project.InvoiceDay)
  //         if (day2 < 10) {
  //           day2 = "0" + day2.toString()
  //         } else day2 = day2.toString()
  //         let endYearMo = moment().add(1, "month").format('YYYY-MM')
  //         payPeriodObject.EndDay = moment(endYearMo + "-" + day2)
  //       }
  //     }
  //   }
  //   let data = await dbContext.PayPeriod.create(payPeriodObject)
  //   return data
  // }

  async createPayPeriod() {

  }

  async deletePayPeriods(email, id) {
    let pps = await dbContext.PayPeriod.find({
      CreatorEmail: email,
      ProjectId: id
    })
    let delCount = 0
    let i = 0
    while (i < pps.length) {
      let data = await dbContext.PayPeriod.findOneAndDelete({
        CreatorEmail: email,
        _id: pps[i].id
      })
      if (data) {
        delCount++
      }
      i++
    }
    return delCount
  }

  async updateInvoiceGroups(IGs) {
    let updatedIGs = []
    let i = 0
    while (i < IGs.length) {
      let data = await dbContext.PayPeriod.findOneAndUpdate(
        { _id: IGs[i]._id },
        IGs[i],
        { new: true }
      )
      updatedIGs.push(data)
      i++
    }
    return updatedIGs
  }

}

export const payPeriodsService = new PayPeriodsService()