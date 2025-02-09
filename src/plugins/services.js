import axios from "@/plugins/axios";
import { initializeService } from "@/services/BaseService";
import { AuthenticationAPI } from "@/services/AuthenticationAPI";
import {CustomerAPI} from "@/services/CustomerAPI.js";

// Initialize the BaseService with the axios instance and API prefix
(function() {
  initializeService(axios, "");
})();

const services = {
  AuthenticationAPI,
  CustomerAPI
};

export default services;
