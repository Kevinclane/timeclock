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

  caluclateHHMM(time) {
    let timeObj = this.splitTime(time)
    if (timeObj.hasSplit) {
      timeObj.Minutes = (Math.round(timeObj.Minutes * 60)).toString();
      if (timeObj.Minutes.length == 1) {
        timeObj.Minutes = "0" + timeObj.Minutes
      }
    }
    let output = timeObj.Hours.toString() + ":" + timeObj.Minutes
    return output
  }

  roundTime(time, roundTo) {
    let timeObj = this.splitTime(time)
    timeObj.Minutes = Math.round((timeObj.Minutes * 60) / roundTo) * roundTo
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

  calculateTimeDiff(tc) {
    let timeDiff = moment.duration(moment(tc.EndTime).diff(moment(tc.StartTime)))
    let hours = parseFloat(timeDiff.asHours().toFixed(2))
    return hours
  }


}
export const timeCalculator = new TimeCalculator();
