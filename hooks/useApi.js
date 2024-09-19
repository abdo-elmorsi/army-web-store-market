// src/hooks/useApi.js

import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import axiosInstance from "helper/apis/axiosInstance";

// Generic fetcher for GET requests
const fetcher = async (url) => {
  try {
    const response = await axiosInstance.get(url);
    return response.data;
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
        response = await axiosInstance.delete(url);
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
  const { data, error, isLoading, mutate } = useSWR(endpoint, fetcher, {
    ...options,
    onErrorRetry: (error, key, config, revalidate) => {
      if (error.response?.status === 404) return;
      setTimeout(() => revalidate({ retryCount: config?.retryCount || 0 }), 5000);
    },
  });

  return {
    data,
    error,
    isLoading: !error && !data,
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