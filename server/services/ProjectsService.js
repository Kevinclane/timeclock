import { dbContext } from "../db/DbContext";
import { BadRequest } from "../utils/Errors";
import moment from "moment"
import { payPeriodsService } from "./PayPeriodsService";
import { payPeriodViewModelBuilder } from "./PayPeriodViewModelBuilder";

async function findLastDay(project) {

  let latestTC = await dbContext.TimeClock.find({ ProjectId: project.id }).sort({ StartTime: -1 }).limit(1);

  if (latestTC.length == 1) {
    return moment(latestTC.StartTime).format("MM/DD/YYYY");
  } else {
    return "Not Started";
  }
}

function clearExcessData(projectData) {
  if (projectData.PayPeriod == "Weekly" || projectData.PayPeriod == "Bi-Weekly" || projectData.PayPeriod == "FirstAndFive") {
    projectData.InvoiceDay = ""
  } else if (projectData.PayPeriod == "Monthly") {
    projectData.Start = ""
    projectData.End = ""
  }
  return projectData
}

async function createProjectSettingsIfNeeded(project) {
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
    ).populate("ProjectSettings").populate("InvoiceGroups")
  }
  return project
}

class ProjectsService {
  async getProjects(user) {
    //just returns limited data of each project for dashboard view

    let projects = await dbContext.Project.find({
      CreatorEmail: user.email
    }).populate("InvoiceGroups");

    let reducedModels = [];
    let i = 0;
    while (i < projects.length) {

      let lastDay = await findLastDay(projects[i]);
      let lastPayPeriod = {};
      if (lastDay == "Not Started") {
        lastPayPeriod.TotalTime = 0;
      } else {

        //need to generate PP if today is within the 
        lastPayPeriod = projects[i].InvoiceGroups[projects[i].InvoiceGroups.length - 1];
        let today = moment();

        if (today.isAfter(moment(lastPayPeriod.StartTime)) && today.isBefore(moment(lastPayPeriod.EndTime))) {
          lastPayPeriod = await payPeriodViewModelBuilder.generatePayPeriod(lastPayPeriod);
        } else {
          lastPayPeriod.TotalTime = 0;
        }

      };

      reducedModels.push({
        id: projects[i].id,
        lastDayWorked: lastDay,
        payee: projects[i].Payee,
        currentHours: lastPayPeriod.TotalTime
      });

      i++;

    }

    return reducedModels;
  }
  async getProjectById(id, email) {

    let project = await dbContext.Project.findOne({
      CreatorEmail: email,
      _id: id
    }).populate("ProjectSettings").populate("InvoiceGroups");

    if (!project) {
      throw new BadRequest("Invalid Id");
    }
    project = await createProjectSettingsIfNeeded(project);
    project = await payPeriodsService.createPayPeriodsIfNeeded(project);

    return project;
  }
  async createProject(projectData) {

    let project = await clearExcessData(projectData);
    project = await dbContext.Project.create(projectData);
    project = await payPeriodsService.initializePayPeriod(project, true);

    let reducedModel = {
      id: project.id,
      lastDayWorked: "Not Started",
      payee: project.Payee,
      currentHours: 0
    };

    return reducedModel;
  }
  async editProject(projectData) {
    let project = await clearExcessData(projectData)
    project = await dbContext.Project.findOneAndUpdate({
      _id: projectData.id,
      CreatorEmail: projectData.CreatorEmail
    },
      projectData,
      {
        new: true
      }
    ).populate("ProjectSettings")
    return project
  }
  async deleteProject(email, id) {
    await dbContext.Project.findOneAndDelete({
      _id: id,
      CreatorEmail: email
    })
    await dbContext.ProjectSettings.findOneAndDelete({ ProjectId: id })
    let pps = await dbContext.PayPeriod.find({ ProjectId: id })
    let i = 0
    while (i < pps.length) {
      await dbContext.PayPeriod.findByIdAndDelete(pps[i]._id)
      i++
    }
    let tcs = await dbContext.TimeClock.find({ ProjectId: id })
    i = 0
    while (i < tcs.length) {
      await dbContext.TimeClock.findByIdAndDelete(tcs[i]._id)
      i++
    }
  }

  //this function can probably be reduced later. 
  async updateProjectSettings(settings, id) {
    settings.Completed = true
    settings.ProjectId = id
    let project = await dbContext.Project.findById(id)
    let data = await dbContext.ProjectSettings.findOneAndUpdate(
      { _id: project.ProjectSettings._id },
      settings,
      { new: true }
    )
    return data
  }

}
export const projectsService = new ProjectsService();
