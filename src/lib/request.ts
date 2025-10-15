import Axios from "axios";
import { CacheRequestConfig, setupCache } from "axios-cache-interceptor";

const axiosInstance = Axios.create({});
const axios = setupCache(axiosInstance);

export interface Response<T> {
  data: T;
  status: number;
  statusText: string;
  headers: { [index: string]: any };
  cached: boolean;
}

export async function get<T = any, D = any>(
  url: string,
  onResponse?: (response: Response<T>) => void,
  config?: CacheRequestConfig<T, D>
): Promise<Response<T>> {
  const response = (await axios.get<T, D>(
    url,
    config
  )) as unknown as Response<T>;

  if (onResponse && response.cached) {
    Axios.get(url).then((response) =>
      onResponse(response as unknown as Response<T>)
    );
  }

  return response;
}
