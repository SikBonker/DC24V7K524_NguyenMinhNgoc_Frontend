import createApiClient from "./api.service";
class ContactService {
  constructor(baseUrl = "/api/contacts") {
    this.api = createApiClient(baseUrl);
  }
  async getAll(name = "") {
    return (
      await this.api.get("/", {
        params: name ? { name } : {},
      })
    ).data;
  }
  async create(data) {
    return (await this.api.post("/", data)).data;
  }
  async deleteAll() {
    return (await this.api.delete("/")).data;
  }
  async get(id) {
    return (await this.api.get(`/${id}`)).data;
  }
  async update(id, data) {
    return (await this.api.put(`/${id}`, data)).data;
  }
  async delete(id) {
    return (await this.api.delete(`/${id}`)).data;
  }
  async getFavorite() {
    return (await this.api.get("/favorite")).data;
  }
}
export default new ContactService();
