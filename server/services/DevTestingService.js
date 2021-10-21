import { dbContext } from "../db/DbContext";
import moment from 'moment';

class DevTestingService {

  async testGetTCsByDay() {

    let start = moment().startOf('day');
    let end = moment().add(1, "day");

    let res = await dbContext.TimeClock.find({
      StartTime: {
        $gte: start,
        $lt: end
      }
    });

    return res;

  }

  async testCreateTCs() {

    let project = await dbContext.Project.findOne();

    if (!project) {
      project = await dbContext.Project.create({
        CreatorEmail: "Test",
        Payee: "Tester",
        PayPeriod: "Bi-Weekly",
        Rate: 15,
        Start: moment()
      });
    }

    await dbContext.TimeClock.create({
      ProjectId: project._id,
      CreatorEmail: "Test",
      StartTime: moment().subtract(3, 'hours'),
      EndTime: moment()
    })

    return project;

  }

}

export const devtestingService = new DevTestingService();