import { dbContext } from "../db/DbContext";

async function createProfileIfNeeded(profile, user) {
  if (!profile) {
    profile = await dbContext.Profile.create({
      Email: user.email,
      Name: user.name,
      Picture: user.picture,
      Subs: [user.sub],
      ContactInfo: [{ Email: user.email }]
    });
  }
  return profile;
}

async function createSubscriptionIfNeeded(profile) {
  if (!profile.Subscription) {
    profile.Subscription = await dbContext.Subscription.create({
      UserId: profile._id,
    })
    await dbContext.Profile.findByIdAndUpdate(
      { _id: profile._id },
      { Subscription: profile.Subscription._id }
    )
  }
  if (profile.Subscription.SubStatus != "Free") {
    profile.Subscription.PayPalData = {
      billingToken: profile.Subscription.PayPalData.billingToken,
      orderID: profile.Subscription.PayPalData.orderID,
      plan_id: profile.Subscription.PayPalData.plan_id,
      subscriptionID: profile.Subscription.PayPalData.subscriptionID
    }
  }
  return profile
}

async function createUserSettingsIfNeeded(profile) {
  if (!profile.UserSettings) {
    profile.UserSettings = await dbContext.UserSettings.create({
      UserId: profile._id,
    })
    await dbContext.Profile.findByIdAndUpdate(
      { _id: profile._id },
      { UserSettings: profile.UserSettings._id }
    )
  }
  return profile
}

async function mergeSubsIfNeeded(profile, user) {
  if (!profile.Subs.includes(user.sub)) {
    profile.Subs.push(user.sub);
    await profile.save();
  }
}

function sanitizeBody(body) {
  let writable = {
    Name: body.Name,
    Picture: body.Picture
  };
  return writable;
}

class ProfileService {
  async getProfiles(emails = []) {
    let profiles = await dbContext.Profile.find({
      Email: { $in: emails }
    }).select("Email Picture Name");
    return profiles;
  }
  async getProfile(user) {
    let profile = await dbContext.Profile.findOne({
      Email: user.email
    }).populate("Subscription").populate("UserSettings");
    profile = await createProfileIfNeeded(profile, user);
    profile = await createSubscriptionIfNeeded(profile)
    profile = await createUserSettingsIfNeeded(profile)
    await mergeSubsIfNeeded(profile, user);
    return profile;
  }
  // async updateProfile(user, body) {
  //   let update = sanitizeBody(body);
  //   let profile = await dbContext.Profile.findOneAndUpdate(
  //     { Email: user.email },
  //     { $set: update },
  //     { runValidators: true, setDefaultsOnInsert: true, new: true }
  //   );
  //   return profile;
  // }
  async updateProfilePic(body, user) {
    let data = await dbContext.Profile.findOneAndUpdate(
      { Email: user.email },
      { Picture: body.picString },
      { runValidators: true, setDefaultsOnInsert: true, new: true }
    )
    return data.Picture
  }
  async updateContactInfo(body, user) {
    await dbContext.Profile.findOneAndUpdate(
      { Email: user.email },
      {
        FirstName: body.FirstName,
        LastName: body.LastName,
        Phone: body.Phone,
        Website: body.Website,
        LinkedIn: body.LinkedIn,
      },
      { runValidators: true, setDefaultsOnInsert: true, new: true }
    )
    let data = await dbContext.Profile.findOne({ Email: user.email })
    return data.ContactInfo
  }
}
export const profilesService = new ProfileService();
