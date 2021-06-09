import { dbContext } from "../db/DbContext";
class FeedbacksService {
  async getFeedback() {
    let feedback = await dbContext.Feedback.find()
    return feedback
  }
  async getFeedbackById(id) {
    let feedback = await dbContext.Feedback.findById(id)
    return feedback
  }
  async createFeedback(rawData) {
    let feedback = await dbContext.Feedback.create(rawData)
    return feedback
  }
  async editFeedback(feedbackData, id) {
    let feedback = await dbContext.Feedback.findOneAndUpdate({
      _id: id
    },
      feedbackData,
      { new: true }
    )
    return feedback
  }

}
export const feedbacksService = new FeedbacksService();
