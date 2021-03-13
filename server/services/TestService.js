import { dbContext } from "../db/DbContext";
import { BadRequest } from "../utils/Errors";
import moment from "moment"

class TestsService {
  async getDates(user) {
    let data = await dbContext.DateTest.find({
      CreatorEmail: "test"
    });
    // let i = 0
    // while (i < data.length) {
    //   data[i].DateDate = data[i].DateDate.slice(0, data[i].DateDate.length - 1)
    //   data[i].DateDate = moment(data[i].DateDate)
    //   data[i].StringDate = moment(data[i].StringDate)
    //   data[i].NewDateDate = moment(data[i].NewDateDate)
    //   data[i].NewDateString = moment(data[i].NewDateString)
    //   data[i].MomentDate = moment(data[i].MomentDate)
    //   data[i].MomentString = moment(data[i].MomentString)
    //   data[i].MomentConvertDate = moment(data[i].MomentDate)
    //   data[i].MomentConvertString = moment(data[i].MomentConvertString)
    //   i++
    // }
    return data;
  }
  async createDate(dateData) {
    let data = await dbContext.DateTest.create(dateData)
    return data
  }
}
export const testsService = new TestsService();
