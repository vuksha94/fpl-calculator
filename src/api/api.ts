import axios, { AxiosResponse } from "axios";
import { ApiResponse } from "../types/ApiResponse";
import { ApiConfig } from "../config/api.config";
import { User } from "../types/User";


export default function api(path: string, method: "get" | "post", body?: any) {
  return new Promise<ApiResponse>((resolve) => {
    axios({
      method: method,
      url: path,
      baseURL: ApiConfig.API_URL,
      data: JSON.stringify(body),
      headers: {
        "Content-type": "application/json",
        Authorization: getToken(),
      }

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
    status: String(res.data.status).toLowerCase(), // SUCCESS | ERROR -> success | error
    data: res.data.data // hacky but good for now
  };
  return resolve(apiResponse);
}


function getToken(): string {
  const token = localStorage.getItem("AUTH_TOKEN");
  return "Bearer " + token;
}

export function saveToken(token: string): void {
  localStorage.setItem("AUTH_TOKEN", token);
}
export function saveUser(user: User): void {
  localStorage.setItem("USER", JSON.stringify(user));
}
export function getUser(): User | null {
  const user = localStorage.getItem("USER");
  return user ? JSON.parse(user) as User : null;
}

export function isLoggedIn() {
  console.log('api.ts -> islogged')
  if (localStorage.getItem("AUTH_TOKEN")) return true;
  return false;
}

export function logOut() {
  localStorage.removeItem("AUTH_TOKEN");
}
