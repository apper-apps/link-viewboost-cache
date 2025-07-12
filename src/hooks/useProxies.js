import { useState, useEffect } from "react";
import proxyService from "@/services/api/proxyService";

const useProxies = () => {
  const [proxies, setProxies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProxies = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await proxyService.getAll();
      setProxies(data);
    } catch (err) {
      setError(err.message || "Failed to load proxies");
    } finally {
      setLoading(false);
    }
  };

  const createProxy = async (proxyData) => {
    try {
      const newProxy = await proxyService.create(proxyData);
      setProxies(prev => [newProxy, ...prev]);
      return newProxy;
    } catch (err) {
      throw new Error(err.message || "Failed to create proxy");
    }
  };

  const updateProxy = async (id, updates) => {
    try {
      const updatedProxy = await proxyService.update(id, updates);
      setProxies(prev => 
        prev.map(proxy => 
          proxy.Id === id ? updatedProxy : proxy
        )
      );
      return updatedProxy;
    } catch (err) {
      throw new Error(err.message || "Failed to update proxy");
    }
  };

  const deleteProxy = async (id) => {
    try {
      await proxyService.delete(id);
      setProxies(prev => prev.filter(proxy => proxy.Id !== id));
    } catch (err) {
      throw new Error(err.message || "Failed to delete proxy");
    }
  };

  const bulkImportProxies = async (proxyList) => {
    try {
      const newProxies = await proxyService.bulkImport(proxyList);
      setProxies(prev => [...newProxies, ...prev]);
      return newProxies;
    } catch (err) {
      throw new Error(err.message || "Failed to import proxies");
    }
  };

  const checkProxyStatus = async (id) => {
    try {
      const updatedProxy = await proxyService.checkStatus(id);
      setProxies(prev => 
        prev.map(proxy => 
          proxy.Id === id ? updatedProxy : proxy
        )
      );
      return updatedProxy;
    } catch (err) {
      throw new Error(err.message || "Failed to check proxy status");
    }
  };

  useEffect(() => {
    loadProxies();
  }, []);

  return {
    proxies,
    loading,
    error,
    loadProxies,
    createProxy,
    updateProxy,
    deleteProxy,
    bulkImportProxies,
    checkProxyStatus
  };
};

export default useProxies;