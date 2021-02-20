import { dbContext } from "../db/DbContext";
import { BadRequest } from "../utils/Errors";

class TimeClocksService {
  async getTimeClocks(email, id) {
    let data = await dbContext.TimeClock.find({
      CreatorEmail: email,
      ProjectId: id
    })
    return data
  }
  async createTimeClock(rawData) {
    let data = await dbContext.TimeClock.create(rawData)
    return data
  }
  async updateTimeClock(rawData, id) {
    let data = await dbContext.TimeClock.findOneAndUpdate({
      _id: id,
      CreatorEmail: rawData.CreatorEmail
    },
      rawData,
      {
        new: true
      }
    )
    if (!data) {
      throw new BadRequest("Invalid Id")
    } else return data
  }
  async clockOut(updateInfo) {
    let data = await dbContext.TimeClock.findOneAndUpdate(
      {
        _id: updateInfo.id,
        CreatorEmail: updateInfo.email
      },
      {
        EndTime: updateInfo.end
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