import axios from "@/plugins/axios";
import { initializeService } from "@/services/BaseService";
import { AuthenticationAPI } from "@/services/AuthenticationAPI";
import {CustomerAPI} from "@/services/CustomerAPI.js";
import {UserAPI} from "@/services/UserAPI.js";

// Initialize the BaseService with the axios instance and API prefix
(function() {
  initializeService(axios, "/sep490");
})();

const services = {
  AuthenticationAPI,
  CustomerAPI,
  UserAPI
};

export default services;
