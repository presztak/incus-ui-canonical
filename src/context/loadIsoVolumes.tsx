import {
  fetchAllStorageVolumes,
  fetchStoragePools,
  fetchStorageVolumes,
} from "api/storage-pools";
import { isoToRemoteImage } from "util/images";
import { RemoteImage } from "types/image";
import { LxdStorageVolume } from "types/storage";

export const loadIsoVolumes = async (
  project: string,
  hasStorageVolumesAll: boolean,
): Promise<RemoteImage[]> => {
  const remoteImages: RemoteImage[] = [];
  const allVolumes = await loadVolumes(project, hasStorageVolumesAll);
  allVolumes.forEach((volume) => {
    if (volume.content_type === "iso") {
      const image = isoToRemoteImage(volume);
      remoteImages.push(image);
    }
  });

  return remoteImages;
};

export const loadVolumes = async (
  project: string,
  hasStorageVolumesAll: boolean,
): Promise<LxdStorageVolume[]> => {
  return hasStorageVolumesAll
    ? fetchAllStorageVolumes(project)
    : collectAllStorageVolumes(project);
};

export const collectAllStorageVolumes = async (
  project: string,
): Promise<LxdStorageVolume[]> => {
  const allVolumes: LxdStorageVolume[] = [];
  const pools = await fetchStoragePools();

  const poolVolumes = await Promise.allSettled(
    pools.map(async (pool) => fetchStorageVolumes(pool.name, project)),
  );

  poolVolumes.forEach((result, index) => {
    if (result.status === "fulfilled") {
      const pool = pools[index];
      const volumes = result.value.map((volume) => ({
        ...volume,
        pool: pool.name,
      }));
      allVolumes.push(...volumes);
    } else {
      throw new Error("Failed to load iso images");
    }
  });

  return allVolumes;
};
