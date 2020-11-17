import axios, { AxiosResponse } from "axios";
import { ApiResponse } from "../types/ApiResponse";


export default function api(path: string, method: "get" | "post", body?: any) {
  return new Promise<ApiResponse>((resolve) => {
    axios({
      method: method,
      url: path,
      //baseURL: ApiConfig.API_URL,
      data: JSON.stringify(body),

    })
      .then((res) => responseHandler(res, resolve))
      .catch((err) => {

        const apiResponse: ApiResponse = {
          status: "error",
          data: {}
        };
        resolve(apiResponse);
      });
  });
}

function responseHandler(
  res: AxiosResponse<any>,
  resolve: (value?: ApiResponse) => void
): void {

  const apiResponse: ApiResponse = {
    status: "success",
    data: res.data
  };
  return resolve(apiResponse);
}
