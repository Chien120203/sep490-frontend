import axios from "@/plugins/axios";
import { initializeService } from "@/services/BaseService";
import { AuthenticationAPI } from "@/services/AuthenticationAPI";
import {CustomerAPI} from "@/services/CustomerAPI.js";
import {UserAPI} from "@/services/UserAPI.js";
import {ProjectAPI} from "@/services/ProjectAPI.js";
import {ContractAPI} from "@/services/ContractAPI.js";
import {SiteSurveyAPI} from "@/services/SiteSurveyAPI.js";
import {PlanningAPI} from "@/services/PlanningAPI.js";
import {MobilizationAPI} from "@/services/MobilizationAPI.js";
import router from "@/router";
import {MachineResourcesAPI} from "@/services/MachineResourcesAPI.js";
// Initialize the BaseService with the axios instance and API prefix
(function() {
  initializeService(axios, "/sep490", router);
})();

const services = {
  AuthenticationAPI,
  PlanningAPI,
  CustomerAPI,
  ContractAPI,
  ProjectAPI,
  MobilizationAPI,
  UserAPI,
  SiteSurveyAPI,
  MachineResourcesAPI
};

export default services;
