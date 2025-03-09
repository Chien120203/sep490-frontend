import axios from "@/plugins/axios";
import { initializeService } from "@/services/BaseService";
import { AuthenticationAPI } from "@/services/AuthenticationAPI";
import {CustomerAPI} from "@/services/CustomerAPI.js";
import {UserAPI} from "@/services/UserAPI.js";
import {ProjectAPI} from "@/services/ProjectAPI.js";
import {SiteSurveyAPI} from "@/services/SiteSurveyAPI.js";

// Initialize the BaseService with the axios instance and API prefix
(function() {
  initializeService(axios, "/sep490");
})();

const services = {
  AuthenticationAPI,
  CustomerAPI,
  ProjectAPI,
  UserAPI,
  SiteSurveyAPI,
};

export default services;
