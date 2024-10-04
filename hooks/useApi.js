import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import axiosInstance from "helper/apis/axiosInstance";

// Generic fetcher for GET requests
const fetcher = async (url) => {
  try {
    const { data } = await axiosInstance.get(url);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching data");
  }
};

// Generic mutation handler for POST, PUT, DELETE requests
const mutationHandler = async (url, { arg }) => {
  const { method, data } = arg;

  try {
    let response;
    switch (method) {
      case 'POST':
        response = await axiosInstance.post(url, data);
        break;
      case 'PUT':
        response = await axiosInstance.put(url, data);
        break;
      case 'DELETE':
        response = await axiosInstance.delete(url, { data });
        break;
      default:
        throw new Error("Unsupported request method");
    }
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error performing mutation");
  }
};

// Custom hook for GET requests
export const useApi = (endpoint, options = {}) => {
  const {
    revalidateOnFocus = false,
    revalidateOnReconnect = false,
    focusThrottleInterval = 0,
    refreshInterval = 0,
    onErrorRetry,
    ...restOptions
  } = options;

  const { data, error, isLoading, mutate } = useSWR(endpoint, fetcher, {
    revalidateOnFocus,
    revalidateOnReconnect,
    focusThrottleInterval,
    refreshInterval,
    onErrorRetry: (error, key, config, revalidate) => {
      if (error.response?.status === 404) return; // Skip retry on 404
      const retryCount = config?.retryCount || 0;
      if (retryCount < 3) {
        setTimeout(() => revalidate({ retryCount: retryCount + 1 }), 5000);
      }
    },
    ...restOptions,
  });

  return {
    data,
    error,
    isLoading, // True if loading
    mutate,
  };
};

// Custom hook for POST, PUT, DELETE operations
export const useApiMutation = (endpoint) => {
  const { trigger, data, error, isMutating } = useSWRMutation(endpoint, mutationHandler);

  const executeMutation = async (method, data = null) => {
    try {
      return await trigger({ method, data });
    } catch (error) {
      throw new Error(error.message);
    }
  };

  return {
    executeMutation,
    data,
    error,
    isMutating,
  };
};