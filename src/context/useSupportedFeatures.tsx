import { useSettings } from "./useSettings";

export const useSupportedFeatures = () => {
  const { data: settings, isLoading, error } = useSettings();
  const apiExtensions = new Set(settings?.api_extensions);

  return {
    settings,
    isSettingsLoading: isLoading,
    settingsError: error,
    hasStorageVolumesAll: apiExtensions.has("storage_volumes_all"),
    hasAccessManagement: apiExtensions.has("access_management"),
    hasAccessManagementTLS: apiExtensions.has("access_management_tls"),
    hasExplicitTrustToken: apiExtensions.has("explicit_trust_token"),
    hasInstanceImportConversion: apiExtensions.has(
      "instance_import_conversion",
    ),
    hasEntityTypeMetadata: apiExtensions.has(
      "metadata_configuration_entity_types",
    ),
    hasEntitiesWithEntitlements: apiExtensions.has(
      "entities_with_entitlements",
    ),
    hasCloudInitSshKeys: apiExtensions.has("cloud_init_ssh_keys"),
    hasBackupMetadataVersion: apiExtensions.has("backup_metadata_version"),
    hasStorageAndProfileOperations: apiExtensions.has(
      "storage_and_profile_operations",
    ),
    hasProjectForceDelete: apiExtensions.has("projects_force_delete"),
    hasInstanceForceDelete: apiExtensions.has("instance_force_delete"),
    hasInstanceBootMode: apiExtensions.has("instance_boot_mode"),
    hasInstanceStateSelectiveRecursion: apiExtensions.has(
      "instances_state_selective_recursion",
    ),
    hasProjectDeleteOperation: apiExtensions.has("project_delete_operation"),
    hasRemoteDropSource: apiExtensions.has("storage_remote_drop_source"),
    hasClusteringControlPlane: apiExtensions.has("clustering_control_plane"),
    hasStorageAndNetworkOperations: apiExtensions.has(
      "storage_and_network_operations",
    ),
    hasImageRegistries: apiExtensions.has("image_registries"),
    hasBulkOperations: apiExtensions.has("bulk_operations"),
    hasClusterLinks: apiExtensions.has("cluster_links"),
    hasReplicators: apiExtensions.has("replicators"),
    hasLoadBalancerPools: apiExtensions.has("network_load_balancer_pool"),
    hasStorageNvmeTcp: apiExtensions.has("storage_nvme_tcp"),
    hasLoadBalancerHealthChecks: apiExtensions.has(
      "network_load_balancer_pool_health_checks",
    ),
    hasStorageDriverPowerstoreNvme: apiExtensions.has(
      "storage_driver_powerstore_nvme",
    ),
  };
};
