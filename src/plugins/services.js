import axios from "@/plugins/axios";
import { initializeService } from "@/services/BaseService";
import { AuthenticationAPI } from "@/services/AuthenticationAPI";
import {CustomerAPI} from "@/services/CustomerAPI.js";
import {UserAPI} from "@/services/UserAPI.js";
import {ProjectAPI} from "@/services/ProjectAPI.js";
import {ContractAPI} from "@/services/ContractAPI.js";
import {SiteSurveyAPI} from "@/services/SiteSurveyAPI.js";
import {ConstructLogAPI} from "@/services/ConstructLogAPI.js";

import {PlanningAPI} from "@/services/PlanningAPI.js";
import {MobilizationAPI} from "@/services/MobilizationAPI.js";
import router from "@/router";
import {MachineResourceAPI} from "@/services/MachineResourceAPI.js";
import {MaterialResourceAPI} from "@/services/MaterialResourceAPI.js";
import {HumanResourceAPI} from "@/services/HumanResourceAPI.js";
import {AllocationAPI} from "@/services/AllocationAPI.js";
import {InventoryAPI} from "@/services/InventoryAPI.js";
// Initialize the BaseService with the axios instance and API prefix
(function() {
  initializeService(axios, "/sep490", router);
})();

const services = {
  AuthenticationAPI,
  AllocationAPI,
  PlanningAPI,
  CustomerAPI,
  InventoryAPI,
  ContractAPI,
  ConstructLogAPI,
  ProjectAPI,
  MobilizationAPI,
  UserAPI,
  SiteSurveyAPI,
  MachineResourceAPI,
  MaterialResourceAPI,
  HumanResourceAPI,
};

export default services;
