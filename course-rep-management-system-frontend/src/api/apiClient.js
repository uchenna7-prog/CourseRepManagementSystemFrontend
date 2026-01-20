import { refreshToken } from "../auth/authService";

let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const apiFetch = async (url, options = {}) => {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: accessToken ? `Bearer ${accessToken}` : "",
    },
  });

  if (res.status === 401) {
    const data = await refreshToken();
    accessToken = data.accessToken;

    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  return res;
};
