import type {
  RemoteImage,
  RemoteImageList,
  RemoteImagesResult,
} from "types/image";
import { capitalizeFirstLetter, handleResponse } from "util/helpers";
import type { ImageServer } from "util/imageServers";

export const linuxContainersServer = "https://images.linuxcontainers.org";

interface LegacyImageSource {
  label: string;
  server: string;
  json: string;
  serverName?: string;
}

const streamsIndex = (server: string): string => {
  return `${server.replace(/\/$/, "")}/streams/v1/images.json`;
};

// user-defined simplestreams servers override the default list when provided
export const getLegacyImageSources = (
  userServers: ImageServer[] = [],
): LegacyImageSource[] => {
  if (userServers.length > 0) {
    return userServers.map((server) => ({
      label: server.name || server.url,
      server: server.url,
      json: streamsIndex(server.url),
      serverName: server.name,
    }));
  }

  return [
    {
      label: "Linux Containers",
      server: linuxContainersServer,
      json: streamsIndex(linuxContainersServer),
    },
  ];
};

// fetching directly from hard coded indexes and servers,
// or from user-defined simplestreams servers when provided
// when a server is passed, only images from that source are loaded
export const loadRemoteImagesLegacy = async (
  userServers: ImageServer[] = [],
  server?: string,
): Promise<RemoteImagesResult> => {
  const allSources = getLegacyImageSources(userServers);
  const sources = server
    ? allSources.filter((source) => source.server === server)
    : allSources;

  const results = await Promise.all(
    sources.map(async (source) =>
      loadImageJson(source.json, source.server, source.serverName),
    ),
  );

  const errors = results
    .map((result) => result.error)
    .filter((error) => error !== "");

  return {
    images: results.flatMap((result) => result.images),
    error: errors.join(". "),
  };
};

const loadImageJson = async (
  file: string,
  server: string,
  serverName?: string,
): Promise<RemoteImagesResult> => {
  return new Promise((resolve) => {
    fetch(file)
      .then(handleResponse)
      .then((data: RemoteImageList) => {
        const images: RemoteImage[] = Object.entries(data.products).map(
          (product) => {
            const { os, ...image } = product[1];
            const formattedOs = capitalizeFirstLetter(os);
            return { ...image, os: formattedOs, server, serverName };
          },
        );
        resolve({ images, error: "" });
      })
      .catch((e: Error) => {
        resolve({ images: [], error: e.message });
      });
  });
};
