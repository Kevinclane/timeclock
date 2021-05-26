import { dbContext } from "../db/DbContext";
import { BadRequest } from "../utils/Errors";


class UserSettingsService {
  async editSettings(reqData) {
    let newSettings = await dbContext.UserSettings.findOneAndUpdate({
      _id: reqData.id,
      UserId: reqData.UserId
    },
      reqData,
      {
        new: true
      }
    )
    return newSettings
  }
}

export const userSettingsService = new UserSettingsService()