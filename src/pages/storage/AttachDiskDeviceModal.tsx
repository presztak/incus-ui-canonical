import type { FC, KeyboardEvent } from "react";
import { useState } from "react";
import { Modal } from "@canonical/react-components";
import FormLink from "components/FormLink";
import BackLink from "components/BackLink";
import type { InstanceAndProfileFormikProps } from "components/forms/instanceAndProfileFormValues";
import CustomVolumeModal from "./CustomVolumeModal";
import type { LxdDiskDevice } from "types/device";
import HostPathDeviceModal from "./HostPathDeviceModal";
import SpecialDiskModal from "./SpecialDiskModal";
import type { LxdStorageVolume } from "types/storage";

type DiskDeviceType =
  | "custom volume"
  | "host path"
  | "special device"
  | "choose type";

interface Props {
  close: () => void;
  onFinish: (device: LxdDiskDevice) => void;
  formik: InstanceAndProfileFormikProps;
  project: string;
}

const AttachDiskDeviceModal: FC<Props> = ({
  close,
  formik,
  project,
  onFinish,
}) => {
  const [type, setType] = useState<DiskDeviceType>("choose type");

  const showSpecialDisk =
    (formik.values.entityType == "instance" &&
      formik.values.instanceType == "virtual-machine") ||
    formik.values.entityType == "profile"
      ? true
      : false;

  const handleEscKey = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === "Escape") {
      close();
    }
  };

  const handleGoBack = () => {
    setType("choose type");
  };

  const handleSelectVolume = (volume: LxdStorageVolume) => {
    const device: LxdDiskDevice = {
      type: "disk",
      pool: volume.pool,
      source: volume.name,
      path: volume.content_type === "filesystem" ? "" : undefined,
    };

    onFinish(device);
  };

  const modalTitle =
    type === "choose type" ? (
      "Choose disk type"
    ) : (
      <BackLink
        title={
          type === "host path"
            ? "Mount host path"
            : type === "custom volume"
              ? "Attach custom volume"
              : "Attach special disk"
        }
        onClick={handleGoBack}
        linkText="Choose disk type"
      />
    );

  return (
    <>
      {type === "choose type" && (
        <Modal
          close={close}
          className="migrate-instance-modal"
          title={modalTitle}
          onKeyDown={handleEscKey}
        >
          <div className="choose-migration-type">
            <FormLink
              icon="add-logical-volume"
              title="Attach custom volume"
              onClick={() => {
                setType("custom volume");
              }}
            />
            <FormLink
              icon="mount"
              title="Mount host path"
              onClick={() => {
                setType("host path");
              }}
            />
            {showSpecialDisk && (
              <FormLink
                icon="file"
                title="Special disk device"
                onClick={() => setType("special device")}
              />
            )}
          </div>
        </Modal>
      )}

      {type === "custom volume" && (
        <CustomVolumeModal
          formik={formik}
          project={project}
          onFinish={handleSelectVolume}
          onCancel={handleGoBack}
          onClose={close}
          title={modalTitle}
        />
      )}

      {type === "host path" && (
        <HostPathDeviceModal
          formik={formik}
          onFinish={onFinish}
          onCancel={handleGoBack}
          onClose={close}
          title={modalTitle}
        />
      )}

      {type === "special device" && (
        <SpecialDiskModal
          formik={formik}
          onFinish={onFinish}
          onCancel={handleGoBack}
          onClose={close}
          title={modalTitle}
        />
      )}
    </>
  );
};

export default AttachDiskDeviceModal;
