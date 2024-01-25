import { LxdStorageVolume } from "types/storage";
import { getSnapshotsPerVolume } from "./storageVolume";

describe("getSnapshotsPerVolume", () => {
  it("no snapshot volumes", () => {
    const volumes: LxdStorageVolume[] = [
      {
        config: {},
        description: "",
        name: "instance-1",
        type: "container",
        used_by: ["/1.0/instances/instance-1"],
        location: "none",
        content_type: "filesystem",
        project: "default",
        created_at: "2023-11-24T13:12:34.236303935Z",
        pool: "default",
      },
      {
        config: {},
        description: "",
        name: "instance-2",
        type: "container",
        used_by: ["/1.0/instances/instance-2"],
        location: "none",
        content_type: "filesystem",
        project: "default",
        created_at: "2023-11-24T13:13:26.586439414Z",
        pool: "default",
      },
      {
        config: {},
        description: "",
        name: "instance-3",
        type: "container",
        used_by: ["/1.0/instances/instance-3"],
        location: "none",
        content_type: "filesystem",
        project: "default",
        created_at: "2023-11-24T13:23:29.083858845Z",
        pool: "default",
      },
      {
        config: {
          size: "1GiB",
        },
        description: "",
        name: "custom-storage-1",
        type: "custom",
        used_by: [],
        location: "none",
        content_type: "filesystem",
        project: "default",
        created_at: "2023-11-29T12:40:55.693180467Z",
        pool: "default",
      },
    ];

    const actual = getSnapshotsPerVolume(volumes);
    const expected = {};
    expect(actual).toEqual(expected);
  });

  it("have snapshot volumes", () => {
    const volumes: LxdStorageVolume[] = [
      {
        config: {},
        description: "",
        name: "instance-1",
        type: "container",
        used_by: ["/1.0/instances/instance-1"],
        location: "none",
        content_type: "filesystem",
        project: "default",
        created_at: "2023-11-24T13:12:34.236303935Z",
        pool: "default",
      },
      {
        config: {},
        description: "",
        name: "instance-1/instance-1-snapshot-1",
        type: "container",
        used_by: ["/1.0/instances/instance-1/snapshots/instance-1-snapshot-1"],
        location: "none",
        content_type: "filesystem",
        project: "default",
        created_at: "2023-11-24T13:27:00.768096193Z",
        pool: "default",
      },
      {
        config: {},
        description: "",
        name: "instance-1/instance-1-snapshot-2",
        type: "container",
        used_by: ["/1.0/instances/instance-1/snapshots/instance-1-snapshot-2"],
        location: "none",
        content_type: "filesystem",
        project: "default",
        created_at: "2023-11-24T13:27:12.213363162Z",
        pool: "default",
      },
      {
        config: {},
        description: "",
        name: "instance-1/instance-1-snapshot-3",
        type: "container",
        used_by: ["/1.0/instances/instance-1/snapshots/instance-1-snapshot-3"],
        location: "none",
        content_type: "filesystem",
        project: "default",
        created_at: "2023-11-24T13:27:22.113883819Z",
        pool: "default",
      },
      {
        config: {},
        description: "",
        name: "instance-2",
        type: "container",
        used_by: ["/1.0/instances/instance-2"],
        location: "none",
        content_type: "filesystem",
        project: "default",
        created_at: "2023-11-24T13:13:26.586439414Z",
        pool: "default",
      },
      {
        config: {},
        description: "",
        name: "instance-2/snapshot-1",
        type: "container",
        used_by: ["/1.0/instances/instance-2/snapshots/snapshot-1"],
        location: "none",
        content_type: "filesystem",
        project: "default",
        created_at: "2023-11-30T13:24:19.76724278Z",
        pool: "default",
      },
      {
        config: {},
        description: "",
        name: "instance-2/snapshot-2",
        type: "container",
        used_by: ["/1.0/instances/instance-2/snapshots/snapshot-2"],
        location: "none",
        content_type: "filesystem",
        project: "default",
        created_at: "2023-11-30T13:24:27.812801069Z",
        pool: "default",
      },
      {
        config: {},
        description: "",
        name: "instance-3",
        type: "container",
        used_by: ["/1.0/instances/instance-3"],
        location: "none",
        content_type: "filesystem",
        project: "default",
        created_at: "2023-11-24T13:23:29.083858845Z",
        pool: "default",
      },
      {
        config: {
          size: "1GiB",
        },
        description: "",
        name: "custom-storage-1",
        type: "custom",
        used_by: [],
        location: "none",
        content_type: "filesystem",
        project: "default",
        created_at: "2023-11-29T12:40:55.693180467Z",
        pool: "default",
      },
      {
        config: {},
        description: "",
        name: "vm-1",
        type: "virtual-machine",
        used_by: ["/1.0/instances/vm-1"],
        location: "none",
        content_type: "block",
        project: "default",
        created_at: "2023-11-29T15:18:56.68295803Z",
        pool: "default",
      },
      {
        config: {},
        description: "",
        name: "vm-1/snapshot-1",
        type: "virtual-machine",
        used_by: ["/1.0/instances/vm-1/snapshots/snapshot-1"],
        location: "none",
        content_type: "block",
        project: "default",
        created_at: "2023-11-30T13:24:54.725406799Z",
        pool: "default",
      },
    ];

    const actual = getSnapshotsPerVolume(volumes);
    const expected = {
      "instance-1": [
        "instance-1-snapshot-1",
        "instance-1-snapshot-2",
        "instance-1-snapshot-3",
      ],
      "instance-2": ["snapshot-1", "snapshot-2"],
      "vm-1": ["snapshot-1"],
    };

    expect(actual).toEqual(expected);
  });
});