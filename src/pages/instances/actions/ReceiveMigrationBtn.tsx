import type { FC } from "react";
import { Button, usePortal } from "@canonical/react-components";
import ReceiveMigrationModal from "../ReceiveMigrationModal";
import DsIcon from "components/DsIcon";

interface Props {
  project: string;
  isSmallScreen?: boolean;
}

// Entry point on the instances list for pulling an instance in from a remote
// cluster via a migration code.
const ReceiveMigrationBtn: FC<Props> = ({ project, isSmallScreen }) => {
  const { openPortal, closePortal, isOpen, Portal } = usePortal();

  return (
    <>
      {isOpen && (
        <Portal>
          <ReceiveMigrationModal close={closePortal} project={project} />
        </Portal>
      )}
      <Button
        appearance="base"
        className="u-no-margin--bottom"
        hasIcon={!isSmallScreen}
        onClick={openPortal}
        title="Receive an instance migrated from a remote cluster"
      >
        {!isSmallScreen && <DsIcon icon="import" />}
        <span>Receive migration</span>
      </Button>
    </>
  );
};

export default ReceiveMigrationBtn;
