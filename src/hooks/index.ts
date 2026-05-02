class ApiService {
  baseUrl: string;
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  async get(endpoint: string) {
    const response = await fetch(`${this.baseUrl}/${endpoint}`);
    return response.json();
  }

async post(endpoint: string, data: any) {
    const response = await fetch(`${this.baseUrl}/${endpoint}`, {
      method: 'POST',

      body: JSON.stringify(data)
    });
    return response.json();
  }

  async deleteTask(endpoint: string) {
    await fetch(`${this.baseUrl}/${endpoint}`, {
      method: 'DELETE',
    });
  }

  async updateTask(endpoint: string, data: any) {
     await fetch(`${this.baseUrl}/${endpoint}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }
}


export const apiService = new ApiService('http://localhost:3000');