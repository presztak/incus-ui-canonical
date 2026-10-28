import type { FC } from "react";
import { Link } from "react-router-dom";
import { List } from "@canonical/react-components";
import { useAuth } from "context/auth";
import { useSupportedFeatures } from "context/useSupportedFeatures";
import { pluralize } from "util/helpers";
import { isLegacyIdentity } from "util/identity";
import { ROOT_PATH } from "util/rootPath";
import PermissionGroupExplanationTooltip from "pages/permissions/PermissionGroupExplanationTooltip";
import { renderOverviewCard } from "util/overview";
import DsIcon from "components/DsIcon";

const PermissionsCard: FC = () => {
  const { currentIdentity, effectiveGroups, isAuthLoading } = useAuth();
  const { hasAccessManagement } = useSupportedFeatures();
  const isAdmin = effectiveGroups?.includes("admins") ?? false;
  const isLegacy = currentIdentity && isLegacyIdentity(currentIdentity);

  if (!hasAccessManagement || isAuthLoading || isAdmin || isLegacy) {
    return null;
  }

  const cardClassName = "overview-card permissions";
  const cardTitle = (
    <>
      <span className="overview-card-title">
        <DsIcon icon="user" /> Permissions
      </span>
      <PermissionGroupExplanationTooltip />
    </>
  );

  const footerLink = (
    <Link to={`${ROOT_PATH}/ui/permissions/groups`}>Auth group details</Link>
  );

  const authMessage = (
    <p className="u-no-margin--bottom">
      Overview information is filtered by your auth groups.
    </p>
  );

  if (!effectiveGroups?.length) {
    return renderOverviewCard(
      cardClassName,
      cardTitle,
      authMessage,
      footerLink,
    );
  }

  return renderOverviewCard(
    cardClassName,
    cardTitle,
    <>
      {authMessage}
      <div>
        <span>Your {pluralize("group", effectiveGroups?.length)}: </span>
        <List
          inline
          middot
          items={effectiveGroups}
          className="effective-groups-list u-no-margin--bottom"
        />
      </div>
    </>,
    footerLink,
  );
};

export default PermissionsCard;
