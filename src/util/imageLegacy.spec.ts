import {
  linuxContainersServer,
  loadRemoteImagesLegacy,
} from "util/imageLegacy";

const jsonResponse = (data: unknown) =>
  ({
    ok: true,
    json: vi.fn<() => Promise<unknown>>().mockResolvedValue(data),
  }) as unknown as Response;

const errorResponse = (message: string) =>
  ({
    ok: false,
    status: 404,
    json: vi.fn<() => Promise<unknown>>().mockResolvedValue({ error: message }),
  }) as unknown as Response;

const product = { os: "ubuntu", arch: "amd64", release: "jammy" };
const products = { products: { p1: product } };

const stubFetch = (response: Response) => {
  const fetchMock = vi
    .fn<() => Promise<Response>>()
    .mockResolvedValue(response);
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
};

describe("loadRemoteImagesLegacy", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("loads images from user-defined servers instead of the default", async () => {
    const fetchMock = stubFetch(jsonResponse(products));

    const result = await loadRemoteImagesLegacy([
      {
        name: "custom",
        url: "https://images.example.com/",
        protocol: "simplestreams",
      },
    ]);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://images.example.com/streams/v1/images.json",
    );
    expect(result.images[0].server).toBe("https://images.example.com/");
    expect(result.images[0].serverName).toBe("custom");
  });

  it("loads images from the default source", async () => {
    const fetchMock = stubFetch(jsonResponse(products));

    const result = await loadRemoteImagesLegacy();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result.error).toBe("");
    expect(result.images.map((image) => image.server)).toEqual([
      linuxContainersServer,
    ]);
  });

  it("loads images only from the requested server", async () => {
    const fetchMock = stubFetch(jsonResponse(products));

    const result = await loadRemoteImagesLegacy([], linuxContainersServer);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://images.linuxcontainers.org/streams/v1/images.json",
    );
    expect(result.error).toBe("");
    expect(result.images).toHaveLength(1);
    expect(result.images[0].server).toBe(linuxContainersServer);
  });

  it("returns only the error of the requested source", async () => {
    stubFetch(errorResponse("not found"));

    const result = await loadRemoteImagesLegacy([], linuxContainersServer);

    expect(result.images).toEqual([]);
    expect(result.error).toBe("not found");
  });
});
