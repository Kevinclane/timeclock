import { dbContext } from "../db/DbContext";
import { BadRequest } from "../utils/Errors";
import moment from "moment"

async function updatePayPeriodRouter(ppObj, type) {
  let data
  if (type == "Weekly") {
    data = await updateWeeklyPayPeriod(ppObj)
  } else if (type == "Bi-Weekly") {
    data = await updateBiWeeklyPayPeriod(ppObj)
  } else if (type == "FirstAndFive") {
    data = await updateFirstAndFivePayPeriod(ppObj)
  } else if (type == "Monthly") {
    data = await updateMonthlyPayPeriod(ppObj)
  }
  return data
}

async function updateWeeklyPayPeriod(ppObj) {
  let today = moment()
  let currentPP = { ...ppObj }
  let newPPs = []
  while (today.isAfter(moment(currentPP.EndDay))) {
    let rawObj = {
      ProjectId: ppObj.ProjectId,
      CreatorEmail: ppObj.CreatorEmail,
      StartDay: new Date(moment(currentPP.StartDay).add(7, "days").format("YYYY-MM-DD")),
      EndDay: new Date(moment(currentPP.EndDay).add(7, "days").format("YYYY-MM-DD"))
    }
    let newPP = await dbContext.PayPeriod.create(rawObj)
    currentPP = newPP
    newPPs.push(newPP)
  }
  return newPPS
}

async function updateBiWeeklyPayPeriod(ppObj) {
  let today = moment()
  let currentPP = { ...ppObj }
  let newPPs = []
  while (today.isAfter(moment(currentPP.EndDay))) {
    let rawObj = {
      ProjectId: ppObj.ProjectId,
      CreatorEmail: ppObj.CreatorEmail,
      StartDay: new Date(moment(currentPP.StartDay).add(14, "days").format("YYYY-MM-DD")),
      EndDay: new Date(moment(currentPP.EndDay).add(14, "days").format("YYYY-MM-DD"))
    }
    let newPP = await dbContext.PayPeriod.create(rawObj)
    currentPP = newPP
    newPPs.push(newPP)
  }
  return newPPs
}

async function updateFirstAndFivePayPeriod(ppObj) {
  let today = moment()
  let currentPP = { ...ppObj }
  let newPPs = []
  while (today.isAfter(moment(currentPP.EndDay))) {
    let rawObj = {
      ProjectId: ppObj.ProjectId,
      CreatorEmail: ppObj.CreatorEmail,
    }
    let e = parseInt(moment(currentPP.EndDay).format("DD"))
    if (e >= 28) {
      let nextYearMo = moment(ppObj.EndDay).add(1, "month").format("YYYY-MM")
      rawObj.EndDay = new Date(nextYearMo + "14")
      rawObj.StartDay = new Date(nextYearMo + "1")
    } else {
      let thisYearMo = moment(ppObj.EndDay).format("YYYY-MM")
      let lastDay = moment(ppObj.EndDay).endOf("month").format("DD")
      rawObj.EndDay = new Date(thisYearMo + "-" + lastDay)
      rawObj.StartDay = new Date(thisYearMo + "14")
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
  let newPPs = []
  while (today.isAfter(moment(currentPP.EndDay))) {
    let rawObj = {
      ProjectId: ppObj.ProjectId,
      CreatorEmail: ppObj.CreatorEmail,
      StartDay: new Date(moment(currentPP.StartDay).add(1, "month").format("YYYY-MM-DD")),
      EndDay: new Date(moment(currentPP.EndDay).add(1, "month").format("YYYY-MM-DD"))
    }
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
    })
    let currentCheck = moment().isAfter(moment(data[data.length - 1].EndDay))
    if (currentCheck) {
      let newPPs = await updatePayPeriodRouter(data[data.length - 1], project.PayPeriod)
      data.push(newPPs)
    }

    return data
  }
  async createFirstPayPeriod(email, project) {
    let payPeriodObject = {
      ProjectId: project._id,
      CreatorEmail: email,
    }

    if (project.PayPeriod == "Weekly" || project.PayPeriod == "Bi-Weekly" || project.PayPeriod == "FirstAndFive") {
      payPeriodObject.StartDay = project.Start
      payPeriodObject.EndDay = project.End

    } else if (project.PayPeriod == "Monthly") {

      if (project.InvoiceDay == "Last") {
        let yearMo = moment().format("YYYY-MM")
        let lastDay = moment().daysInMonth()
        payPeriodObject.StartDay = new Date(yearMo + '-01')
        payPeriodObject.EndDay = new Date(yearMo + lastDay)

      } else {
        let today = moment().format("DD")
        if (parseInt(today) <= parseInt(project.InvoiceDay)) {
          let day = parseInt(project.InvoiceDay)
          if (day < 10) {
            day = '0' + day.toString()
          } else day = day.toString()
          let nowYearMo = moment().format('YYYY-MM')
          payPeriodObject.EndDay = new Date(nowYearMo + "-" + day)
          let startYearMo = moment().subtract(1, "month").format('YYYY-MM')
          let day2 = parseInt(day) + 1
          if (day2 < 10) {
            day2 = "0" + day2.toString()
          } else day2 = day2.toString()
          payPeriodObject.StartDay = new Date(startYearMo + "-" + day2)
        } else {
          let day = parseInt(project.InvoiceDay) + 1
          if (day < 10) {
            day = '0' + day.toString()
          } else day = day.toString()
          let nowYearMo = moment().format('YYYY-MM')
          payPeriodObject.StartDay = new Date(nowYearMo + "-" + day)

          let day2 = parseInt(project.InvoiceDay)
          if (day2 < 10) {
            day2 = "0" + day2.toString()
          } else day2 = day2.toString()
          let endYearMo = moment().add(1, "month").format('YYYY-MM')
          payPeriodObject.EndDay = new Date(endYearMo + "-" + day2)
        }
      }
    }
    let data = await dbContext.PayPeriod.create(payPeriodObject)
    return data
  }


  // async deletePayPeriods(email, id) {
  //   let clocks = await dbContext.PayPeriod.find({
  //     CreatorEmail: email,
  //     ProjectId: id
  //   })
  //   let delCount = 0
  //   let i = 0
  //   while (i < clocks.length) {
  //     let data = await dbContext.PayPeriod.findOneAndDelete({
  //       CreatorEmail: email,
  //       _id: clocks[i].id
  //     })
  //     if (data) {
  //       delCount++
  //     }
  //     i++
  //   }
  //   return delCount
  // }
}

export const payPeriodsService = new PayPeriodsService()