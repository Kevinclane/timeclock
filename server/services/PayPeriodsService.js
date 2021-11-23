import { dbContext } from "../db/DbContext";
import { BadRequest } from "../utils/Errors";
import moment from "moment"
import { payPeriodViewModelBuilder } from "./PayPeriodViewModelBuilder";

async function updatePayPeriodActive(project) {
  let PPs = project.InvoiceGroups;
  if (PPs[PPs.length - 1].Current) {
    return project;
  } else {
    let prevActive = PPs.find(p => p.Current);
    await dbContext.PayPeriod.findByIdAndUpdate(
      prevActive.id,
      { Current: false }
    );
    let nextActive = PPs[PPs.length - 1];
    await dbContext.PayPeriod.findByIdAndUpdate(
      nextActive.id,
      { Current: true }
    )

    project = await dbContext.Project.findById(project._id).populate("ProjectSettings").populate("InvoiceGroups");
    return project;
  }
}



class PayPeriodsService {
  async getPayPeriodById(id, email) {
    let data = await dbContext.PayPeriod.findById(id);

    if (data.CreatorEmail != email) {
      throw new BadRequest("This is not your data");
    } else {

      let PP = await payPeriodViewModelBuilder.generatePayPeriod(data);

      return PP;

    }
  }

  async createPayPeriod(project, StartDay, EndDay, newProject) {
    let payPeriodObject = {
      ProjectId: project._id,
      CreatorEmail: project.CreatorEmail,
      StartDay: StartDay,
      EndDay: EndDay,
      ReadableDates: ""
    }

    if (newProject) {
      payPeriodObject.Current = true;
    }

    let formattedStart = moment(StartDay).format("MM/DD/YYYY")
    let formattedEnd = moment(EndDay).format("MM/DD/YYYY")
    payPeriodObject.ReadableDates = formattedStart + " - " + formattedEnd

    let data = await dbContext.PayPeriod.create(payPeriodObject)
    return data
  }
  async createPayPeriodsIfNeeded(project) {

    if (!project.InvoiceGroups) {
      project = await this.initializePayPeriod(project);
    }

    if (moment().startOf("day").isAfter(moment(project.InvoiceGroups[project.InvoiceGroups.length - 1].EndDay))) {
      project = await this.updatePayPeriodRouter(project);
      project = await updatePayPeriodActive(project);
    }


    return project;

  }
  async initializePayPeriod(project) {

    let StartDay;
    let EndDay;

    if (project.PayPeriod == "Weekly" || project.PayPeriod == "Bi-Weekly" || project.PayPeriod == "FirstAndFive") {
      StartDay = moment(project.Start);
      EndDay = moment(project.End);

    } else if (project.PayPeriod == "Monthly") {

      if (project.InvoiceDay == "Last") {
        let yearMo = moment().format("YYYY-MM")
        let lastDay = moment().daysInMonth()
        StartDay = moment(yearMo + '-01')
        EndDay = moment(yearMo + "-" + lastDay)

      } else {
        let today = moment().format("DD")

        if (parseInt(today) <= parseInt(project.InvoiceDay)) {

          let day = parseInt(project.InvoiceDay)

          if (day < 10) {
            day = '0' + day.toString()
          } else day = day.toString()

          let nowYearMo = moment().format('YYYY-MM')
          EndDay = moment(nowYearMo + "-" + day)
          let startYearMo = moment().subtract(1, "month").format('YYYY-MM')
          let day2 = parseInt(day) + 1

          if (day2 < 10) {
            day2 = "0" + day2.toString()
          } else day2 = day2.toString()

          StartDay = moment(startYearMo + "-" + day2)
        } else {

          let day = parseInt(project.InvoiceDay) + 1
          if (day < 10) {
            day = '0' + day.toString()
          } else day = day.toString()

          let nowYearMo = moment().format('YYYY-MM')
          StartDay = moment(nowYearMo + "-" + day)
          let day2 = parseInt(project.InvoiceDay)

          if (day2 < 10) {
            day2 = "0" + day2.toString()
          } else day2 = day2.toString()

          let endYearMo = moment().add(1, "month").format('YYYY-MM')
          EndDay = moment(endYearMo + "-" + day2)
        }
      }
    }

    let data = await this.createPayPeriod(project, StartDay, EndDay, true)
    project = await dbContext.Project.findByIdAndUpdate(
      project.id,
      { $addToSet: { InvoiceGroups: data._id } },
      { new: true }
    ).populate("ProjectSettings").populate("InvoiceGroups")

    return project
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
  async updatePayPeriodRouter(project) {
    let data
    if (project.PayPeriod == "Weekly") {
      data = await this.updateWeeklyPayPeriod(7, project)
    } else if (project.PayPeriod == "Bi-Weekly") {
      data = await this.updateWeeklyPayPeriod(14, project)
    } else if (project.PayPeriod == "FirstAndFive") {
      data = await this.updateFirstAndFivePayPeriod(project)
    } else if (project.PayPeriod == "Monthly") {
      data = await this.updateMonthlyPayPeriod(project)
    }
    return data
  }
  async updateWeeklyPayPeriod(x, project) {
    let today = moment().startOf("day");
    let currentPPid = project.InvoiceGroups[project.InvoiceGroups.length - 1]._id
    let currentPP = await dbContext.PayPeriod.findById(currentPPid);
    while (today.isAfter(moment(currentPP.EndDay))) {
      let StartDay = moment(currentPP.StartDay).add(x, "days")
      let EndDay = moment(currentPP.EndDay).add(x, "days")
      let newPP = await this.createPayPeriod(project, StartDay, EndDay)
      currentPP = newPP
      project.InvoiceGroups.push(newPP._id)
    }
    project = await dbContext.Project.findOneAndUpdate(
      { _id: project._id },
      project,
      { new: true }
    ).populate("InvoiceGroups").populate("ProjectSettings")
    return project
  }
  async updateFirstAndFivePayPeriod(project) {
    let today = moment().startOf("day");
    let currentPPid = project.InvoiceGroups[project.InvoiceGroups.length - 1]._id
    let currentPP = await dbContext.PayPeriod.findById(currentPPid);
    while (today.isAfter(moment(currentPP.EndDay))) {
      let StartDay
      let EndDay
      let e = parseInt(moment(currentPP.EndDay).format("DD"))
      if (e >= 28) {
        let nextYearMo = moment(currentPP.EndDay).add(1, "month").format("YYYY-MM")
        EndDay = moment(nextYearMo + "14")
        StartDay = moment(nextYearMo + "1")
      } else {
        let thisYearMo = moment(currentPP.EndDay).format("YYYY-MM")
        let lastDay = moment(currentPP.EndDay).endOf("month").format("DD")
        EndDay = moment(thisYearMo + "-" + lastDay)
        StartDay = moment(thisYearMo + "14")
      }
      let newPP = await this.createPayPeriod(project, StartDay, EndDay)
      // let newPP = await dbContext.PayPeriod.create(rawObj)
      project.InvoiceGroups.push(newPP._id)
    }
    project = await dbContext.Project.findOneAndUpdate(
      { _id: project._id },
      project,
      { new: true }
    ).populate("InvoiceGroups").populate("ProjectSettings")
    return project
  }
  async updateMonthlyPayPeriod(project) {
    let today = moment().startOf("day");
    let currentPPid = project.InvoiceGroups[project.InvoiceGroups.length - 1]._id
    let currentPP = await dbContext.PayPeriod.findById(currentPPid);
    while (today.isAfter(moment(currentPP.EndDay))) {
      let StartDay = moment(currentPP.StartDay).add(1, "month")
      let EndDay = moment(currentPP.EndDay).add(1, "month")
      let newPP = await this.createPayPeriod(project, StartDay, EndDay)
      currentPP = newPP
      project.InvoiceGroups.push(newPP._id)
    }
    project = await dbContext.Project.findOneAndUpdate(
      { _id: project._id },
      project,
      { new: true }
    ).populate("InvoiceGroups").populate("ProjectSettings")
    return project
  }

  async updatePayPeriodTimes(payPeriod) {
    payPeriod = await dbContext.PayPeriod.findByIdAndUpdate(payPeriod.id, {
      TotalPay: payPeriod.TotalPay,
      TotalTime: payPeriod.TotalTime,
      ReadableTime: payPeriod.ReadableTime
    });
  }

}

export const payPeriodsService = new PayPeriodsService()