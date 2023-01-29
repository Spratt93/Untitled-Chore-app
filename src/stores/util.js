import { useUserStore } from "./user";
import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();

export function handleResponse(response, expectedStatus) {
  const user = useUserStore();

  if (response.status === 401) {
    user.accessToken = null;
    cookies.remove("access_token");
  }

  if (response.status === 422) {
    user.error = "Ooops! Error submitting request, this one's our fault";
    return null;
  }

  if (response.status !== expectedStatus) {
    user.error = response.data.detail;
    return null;
  }

  return response.data ? response.data : true;
}
