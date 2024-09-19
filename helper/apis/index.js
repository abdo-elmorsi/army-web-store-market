import axiosInstance from "./axiosInstance";

export class Logic {
  static cache = {};

  static getCachedData(key) {
    const cachedData = this.cache[key]?.data;
    return cachedData ? JSON.parse(cachedData) : null;
  }

  static setCachedData(key, data = null, params = null) {
    this.cache[key] = { data: JSON.stringify(data), params: JSON.stringify(params) };
  }

  static isCached(key, params) {
    const stringifiedParams = JSON.stringify(params);
    return this.cache[key]?.params === stringifiedParams && this.cache[key]?.data;
  }

  static async getResource(resource, params) {

    if (this.isCached(resource, params)) {
      return this.getCachedData(resource);
    }

    const { data } = await axiosInstance.get(`/${resource}`, { params });
    this.setCachedData(resource, data, params);
    return data;
  }

  static async request(resource, operation, id, payload) {
    let request;
    switch (operation) {
      case "get":
        request = axiosInstance.get(`/${resource}`, { params: { id } });
        break;
      case "post":
        this.setCachedData(resource);
        request = axiosInstance.post(`/${resource}`, payload);
        break;
      case "update":
        this.setCachedData(resource);
        request = axiosInstance.put(`/${resource}?id=${id}`, payload);
        break;
      case "delete":
        this.setCachedData(resource);
        request = axiosInstance.delete(`/${resource}?id=${id}`);
        break;
      default:
        throw new Error(`Invalid operation: ${operation}`);
    }

    const { data } = await request;
    return data;
  }
}

class API {
  // -------------------------------- dashboard --------------------------------
  static async getTotals(params) {
    return Logic.getResource("dashboard", params);
  }

  // -------------------------------- Auth --------------------------------

  static async login(data) {
    return Logic.request("users/signIn", "post", null, data);
  }
  static async verifyCode(data) {
    return Logic.request("users/verify", "post", null, data);
  }
  static async updatePassword(data) {
    return Logic.request("users/update-password", "post", null, data);
  }
  static async changePassword(data) {
    return Logic.request("users/change-password", "update", null, data);
  }
  static async forgetPassword(data) {
    return Logic.request("users/forget-password", "post", null, data);
  }

  // -------------------------------- towers --------------------------------
  static async getAllTowers(params) {
    return Logic.getResource("towers", params);
  }

  static async getOneTower(id) {
    return Logic.request("towers", "get", id);
  }

  static async createTower(tower) {
    return Logic.request("towers", "post", null, tower);
  }

  static async deleteTower(id) {
    return Logic.request("towers", "delete", id);
  }

  static async updateTower(tower, id) {
    return Logic.request("towers", "update", id, tower);
  }

  // -------------------------------- users --------------------------------
  static async getAllTenants(params) {
    return Logic.getResource("users", params);
  }

  static async getOneTenant(id) {
    return Logic.request("users", "get", id);
  }

  static async createTenant(user) {
    return Logic.request("users", "post", null, user);
  }

  static async deleteTenant(id) {
    return Logic.request("users", "delete", id);
  }

  static async updateTenant(user, id) {
    return Logic.request("users", "update", id, user);
  }

  // -------------------------------- message --------------------------------
  static async getAllMessages(params) {
    return Logic.getResource("message", params);
  }


  static async createMessage(message) {
    return Logic.request("message", "post", null, message);
  }

  static async deleteMessage(id) {
    return Logic.request("message", "delete", id);
  }



  // -------------------------------- apartments --------------------------------
  static async getAllApartments(params) {
    return Logic.getResource("apartments", params);
  }

  static async getOneApartment(id) {
    return Logic.request("apartments", "get", id);
  }

  static async createApartment(apartment) {
    return Logic.request("apartments", "post", null, apartment);
  }

  static async deleteApartment(id) {
    return Logic.request("apartments", "delete", id);
  }

  static async updateApartment(apartment, id) {
    return Logic.request("apartments", "update", id, apartment);
  }

  // -------------------------------- actions/rental --------------------------------
  static async getAllRentals(params) {
    return Logic.getResource("actions/rental", params);
  }

  static async getOneRental(id) {
    return Logic.request("actions/rental", "get", id);
  }

  static async createRental(rental) {
    return Logic.request("actions/rental", "post", null, rental);
  }

  static async deleteRental(id) {
    return Logic.request("actions/rental", "delete", id);
  }

  static async updateRental(rental, id) {
    return Logic.request("actions/rental", "update", id, rental);
  }



  // -------------------------------- request-join --------------------------------
  static async getAllRequestJoin(params) {
    return Logic.getResource("request-join", params);
  }


  static async completeForm(user) {
    return Logic.request("users/complete-form", "post", null, user);
  }

  static async createRequestJoin(user) {
    return Logic.request("request-join", "post", null, user);
  }

  static async deleteRequestJoin(id) {
    return Logic.request("request-join", "delete", id);
  }

  static async acceptRequestJoin(id, requestJoin = {}) {
    return Logic.request("request-join", "update", `${id}/accept`, requestJoin);
  }
  static async rejectRequestJoin(id, requestJoin = {}) {
    return Logic.request("request-join", "update", `${id}/reject`, requestJoin);
  }
  static async markAsReadRequestJoin(id, requestJoin = {}) {
    return Logic.request("request-join", "update", `${id}/mark-as-read`, requestJoin);
  }

}
export default API;
