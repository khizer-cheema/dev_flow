import { RequestError } from "../http-errors";
import logger from "../logger";
import handleError from "./error";

interface fetchOptions extends RequestInit {
  timeout?: number;
}

function isError(error: unknown): error is Error {
  return error instanceof Error;
}
export async function fetchHandler<T>(
  url: string,
  options: fetchOptions = {}
): Promise<ActionResponse<T>> {
  const {
    timeout = 5000,
    headers: customHeaders = {},
    ...restOptions
  } = options;
  const controller = new AbortController();
  const id = setTimeout(() => {
    controller.abort();
  }, timeout);

  const defaultHeaders: HeadersInit = {
    "content-type": "application/json",
    Accept: "application/json",
  };
  const headers: HeadersInit = {
    ...defaultHeaders,
    ...customHeaders,
  };

  const config: RequestInit = {
    signal: controller.signal,
    headers,
    ...restOptions,
  };
  try {
    const response = await fetch(url, config);
    clearTimeout(id);

    if (!response.ok) {
      throw new RequestError(response.status, `HTTP error:${response.status}`);
    }

    return await response.json();
  } catch (err) {
    const error = isError(err) ? err : new Error("Unknown Error");
    if (error.name === "AbortError") {
      logger.warn(`Request to ${url} timed out`);
    } else {
      logger.error(`Error fetching ${url}:${error.message}`);
    }
    return handleError(error) as ActionResponse<T>;
  }
}
