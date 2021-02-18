import { dbContext } from "../db/DbContext";
import { BadRequest } from "../utils/Errors";

class TimeClocksService {
  async getTimeClocks(user, id) {
    let data = await dbContext.TimeClock.find({
      CreatorEmail = user.email,
      ProjectId = id
    })
    return data
  }
  async createTimeClock(rawData) {
    let data = await dbContext.TimeClock.create(rawData)
    return data
  }
  async updateTimeClock(rawData, id) {
    let data = await dbContext.TimeClock.findOneAndUpdate(
      {
        _id = id,
        CreatorEmail = rawData.email
      },
      {
        EndTime: rawData.EndTime
      },
      {
        new: true
      }
    )
    if (!data) {
      throw new BadRequest("Invalid Id")
    } else return data
  }
}

export const timeClocksService = new TimeClocksService()