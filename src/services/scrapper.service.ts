import axios from 'axios';
import { environment } from '../utils/loadEnvironment';




export const  getScrapperStatusService = async () => {
  try {
    const result = await axios.get(`${environment.SCRAPPER_API_URL}/status`);
    if (!result.data) {
      throw new Error("Axios Error! No data found!");
    }
    return result.data;
  } catch (error: any) {
    throw new Error(`Axios request failed: ${error.message}`);
  }
};