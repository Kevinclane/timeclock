import { dbContext } from "../db/DbContext";
import { BadRequest } from "../utils/Errors";
import moment from "moment"

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
    })
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
  async createFirstPayPeriod(email, project) {
    let payPeriodObject = {
      ProjectId: project._id,
      CreatorEmail: email,
      InvoiceNumber: 1
    }

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
    let data = await dbContext.PayPeriod.create(payPeriodObject)
    return data
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