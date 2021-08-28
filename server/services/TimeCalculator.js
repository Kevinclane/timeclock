import { dbContext } from "../db/DbContext";
import moment from "moment"

class TimeCalculator {
  splitTime(time) {
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

  caluclateHHMM(time, roundTo) {
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

  roundFromHoursHH(time, roundTo) {
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

  clearExcessData(projectData) {
    if (projectData.PayPeriod == "Weekly" || projectData.PayPeriod == "Bi-Weekly" || projectData.PayPeriod == "FirstAndFive") {
      projectData.InvoiceDay = ""
    } else if (projectData.PayPeriod == "Monthly") {
      projectData.Start = ""
      projectData.End = ""
    }
    return projectData
  }

  async createProjectSettingsIfNeeded(project) {
    if (!project.ProjectSettings) {
      let newSettings = await dbContext.ProjectSettings.create(
        {
          CreatorEmail: project.CreatorEmail
        }
      )
      project.ProjectSettings = newSettings._id
      project = await dbContext.Project.findOneAndUpdate({
        _id: project.id,
        CreatorEmail: project.CreatorEmail
      },
        project,
        {
          new: true
        }
      ).populate("ProjectSettings")
    }
    return project
  }

}
export const timeCalculator = new TimeCalculator();
