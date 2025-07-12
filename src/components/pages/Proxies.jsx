import React, { useState } from "react";
import { motion } from "framer-motion";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import FormField from "@/components/molecules/FormField";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import useProxies from "@/hooks/useProxies";
import { toast } from "react-toastify";
import { formatDistanceToNow } from "date-fns";

const Proxies = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [bulkProxies, setBulkProxies] = useState("");
  const [newProxy, setNewProxy] = useState({
    address: "",
    port: "",
    username: "",
    password: ""
  });

  const {
    proxies,
    loading,
    error,
    loadProxies,
    createProxy,
    updateProxy,
    deleteProxy,
    bulkImportProxies,
    checkProxyStatus
  } = useProxies();

  // Filter proxies
  const filteredProxies = React.useMemo(() => {
    return proxies.filter(proxy => {
      const matchesSearch = proxy.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          proxy.port.toString().includes(searchTerm);
      const matchesStatus = statusFilter === "all" || proxy.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [proxies, searchTerm, statusFilter]);

  const statusCounts = React.useMemo(() => {
    const counts = { all: proxies.length };
    proxies.forEach(proxy => {
      counts[proxy.status] = (counts[proxy.status] || 0) + 1;
    });
    return counts;
  }, [proxies]);

  const handleCreateProxy = async (e) => {
    e.preventDefault();
    try {
      await createProxy({
        ...newProxy,
        port: parseInt(newProxy.port)
      });
      setNewProxy({ address: "", port: "", username: "", password: "" });
      setShowAddModal(false);
      toast.success("Proxy added successfully!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleBulkImport = async (e) => {
    e.preventDefault();
    try {
      const proxyList = bulkProxies.split("\n").filter(line => line.trim());
      if (proxyList.length === 0) {
        toast.error("Please enter at least one proxy");
        return;
      }
      
      const importedProxies = await bulkImportProxies(proxyList);
      setBulkProxies("");
      setShowBulkModal(false);
      toast.success(`Successfully imported ${importedProxies.length} proxies`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleCheckStatus = async (id) => {
    try {
      await checkProxyStatus(id);
      toast.success("Proxy status updated");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteProxy = async (id) => {
    if (window.confirm("Are you sure you want to delete this proxy?")) {
      try {
        await deleteProxy(id);
        toast.success("Proxy deleted");
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      online: { variant: "success", icon: "CheckCircle" },
      offline: { variant: "error", icon: "XCircle" },
      checking: { variant: "warning", icon: "Clock" }
    };

    const config = statusConfig[status] || statusConfig.checking;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <ApperIcon name={config.icon} className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return <Loading type="table" />;
  }

  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={loadProxies}
      />
    );
  }

  const statusOptions = [
    { value: "all", label: "All Proxies", count: statusCounts.all },
    { value: "online", label: "Online", count: statusCounts.online || 0 },
    { value: "offline", label: "Offline", count: statusCounts.offline || 0 },
    { value: "checking", label: "Checking", count: statusCounts.checking || 0 }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-white">Proxies</h1>
          <p className="text-gray-400 mt-1">Manage your proxy infrastructure</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setShowBulkModal(true)}>
            <ApperIcon name="Upload" className="w-5 h-5 mr-2" />
            Bulk Import
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
            Add Proxy
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search proxies..."
          className="lg:max-w-md"
        />
        
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setStatusFilter(option.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                statusFilter === option.value
                  ? "bg-primary text-white"
                  : "bg-surface text-gray-300 hover:bg-gray-700"
              }`}
            >
              <span>{option.label}</span>
              <Badge variant={statusFilter === option.value ? "default" : "default"}>
                {option.count}
              </Badge>
            </button>
          ))}
        </div>
      </div>

      {/* Proxies Table */}
      {filteredProxies.length === 0 ? (
        <Empty
          title={searchTerm || statusFilter !== "all" ? "No proxies found" : "No proxies yet"}
          description={
            searchTerm || statusFilter !== "all" 
              ? "Try adjusting your search or filter criteria"
              : "Add your first proxy to start routing campaign traffic"
          }
          actionLabel="Add Proxy"
          onAction={() => setShowAddModal(true)}
          icon="Shield"
        />
      ) : (
        <div className="bg-surface border border-gray-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50 border-b border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Proxy</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Response Time</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Success Rate</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Last Checked</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredProxies.map((proxy, index) => (
                  <motion.tr
                    key={proxy.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-medium">
                          {proxy.address}:{proxy.port}
                        </p>
                        {proxy.username && (
                          <p className="text-sm text-gray-400">
                            User: {proxy.username}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(proxy.status)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white">
                        {proxy.responseTime > 0 ? `${proxy.responseTime}ms` : "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-white">
                          {proxy.successRate > 0 ? `${proxy.successRate.toFixed(1)}%` : "—"}
                        </span>
                        {proxy.successRate > 0 && (
                          <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                proxy.successRate >= 95 ? "bg-success" :
                                proxy.successRate >= 85 ? "bg-warning" : "bg-error"
                              }`}
                              style={{ width: `${proxy.successRate}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-400 text-sm">
                        {formatDistanceToNow(new Date(proxy.lastChecked), { addSuffix: true })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCheckStatus(proxy.Id)}
                        >
                          <ApperIcon name="RefreshCw" className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteProxy(proxy.Id)}
                        >
                          <ApperIcon name="Trash2" className="w-4 h-4 text-error" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Proxy Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-md bg-surface border border-gray-700 rounded-xl shadow-2xl"
          >
            <div className="p-6 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">Add New Proxy</h3>
            </div>
            <form onSubmit={handleCreateProxy} className="p-6 space-y-4">
              <FormField label="IP Address" required>
                <Input
                  value={newProxy.address}
                  onChange={(e) => setNewProxy(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="192.168.1.100"
                  required
                />
              </FormField>
              <FormField label="Port" required>
                <Input
                  type="number"
                  value={newProxy.port}
                  onChange={(e) => setNewProxy(prev => ({ ...prev, port: e.target.value }))}
                  placeholder="8080"
                  required
                />
              </FormField>
              <FormField label="Username (Optional)">
                <Input
                  value={newProxy.username}
                  onChange={(e) => setNewProxy(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="username"
                />
              </FormField>
              <FormField label="Password (Optional)">
                <Input
                  type="password"
                  value={newProxy.password}
                  onChange={(e) => setNewProxy(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="password"
                />
              </FormField>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="secondary" onClick={() => setShowAddModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Add Proxy
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Bulk Import Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowBulkModal(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-lg bg-surface border border-gray-700 rounded-xl shadow-2xl"
          >
            <div className="p-6 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">Bulk Import Proxies</h3>
              <p className="text-sm text-gray-400 mt-1">
                Enter one proxy per line in format: ip:port:username:password
              </p>
            </div>
            <form onSubmit={handleBulkImport} className="p-6 space-y-4">
              <FormField label="Proxy List">
                <textarea
                  value={bulkProxies}
                  onChange={(e) => setBulkProxies(e.target.value)}
                  placeholder="192.168.1.100:8080:user:pass&#10;10.0.0.50:3128&#10;172.16.0.25:8888:admin:secret"
                  className="w-full h-32 px-4 py-3 bg-surface border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                  required
                />
              </FormField>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="secondary" onClick={() => setShowBulkModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Import Proxies
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Proxies;