import axios, { AxiosResponse, AxiosError } from 'axios';
import { getSession } from 'next-auth/react';

const fetcherWithAuth = async (url: string) => {
  const session = await getSession();
  const token = session?.accessToken;
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  try {
    const response: AxiosResponse = await axios.get(url, { headers, withCredentials: true });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError;
  }
};

export default fetcherWithAuth;
