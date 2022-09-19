import axios from 'axios';
import { apiUrl } from './constants';

export default class SessionManager {
  private client = axios.create({ baseURL: `${apiUrl}/auth` });

  private async post<T>(url: string) {
    return this.client.post<T>(url);
  }

  public async verifySession(sessionToken: string) {
    const response = await this.post<{ valid: boolean }>(`/verify/${sessionToken}`);
    return response.data.valid;
  }
}
