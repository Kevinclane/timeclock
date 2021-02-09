import { dbContext } from "../db/DbContext";

// Private Methods

/**
 * Creates userData if one does not exist
 * @param {any} userData
 * @param {any} user
 */
async function createProfileIfNeeded(userData, user) {
  if (!userData) {
    userData = await dbContext.Profile.create({
      ...user,
      subs: [user.sub]
    });
  }
  return userData;
}

/**
 * Adds sub to userData if not already on userData
 * @param {any} userData
 * @param {any} user
 */
async function mergeSubsIfNeeded(userData, user) {
  if (!userData.subs.includes(user.sub)) {
    // @ts-ignore
    userData.subs.push(user.sub);
    await userData.save();
  }
}
/**
 * Restricts changes to the body of the profile object
 * @param {any} body
 */
function sanitizeBody(body) {
  let writable = {
    name: body.name,
    phones: body.phones,
    addresses: body.addresses,
    notes: body.notes,
    picture: body.picture,
    clockIn: body.clockIn,
    clockOut: body.clockOut,
    projectName: body.projectName
  };
  return writable;
}

class TimeTracksService {
  /**
   * Returns a user profile from the Auth0 user object
   *
   * Creates user if none exists
   *
   * Adds sub of Auth0 account to profile if not currently on profile
   * @param {any} user
   */
  async getUserInfo(user) {
    let userInfo = await dbContext.TimeTrack.findOne({
      email: user.email
    });
    userInfo = await createProfileIfNeeded(userInfo, user);
    await mergeSubsIfNeeded(userInfo, user);
    return userInfo;
  }
  /**
     * Updates profile with the request body, will only allow changes to editable fields
     * @param {any} user Auth0 user object
     * @param {any} body Updates to apply to user object
     */
  async updateUserData(user, body) {
    let update = sanitizeBody(body);
    let userData = await dbContext.TimeTrack.findOneAndUpdate(
      { email: user.email },
      { $set: update },
      { runValidators: true, setDefaultsOnInsert: true, new: true }
    );
    return userData;
  }
}
export const timeTracksService = new TimeTracksService();
