import type { FC } from "react";
import { NavLink } from "react-router-dom";
import classNames from "classnames";
import { useCurrentProject } from "context/useCurrentProject";
import { getOverviewUrl } from "util/projects";
import { ROOT_PATH } from "util/rootPath";

interface Props {
  light?: boolean;
}

const Logo: FC<Props> = ({ light }) => {
  const { projectName } = useCurrentProject();

  const src = `${ROOT_PATH}/ui/assets/img/incus-logo.svg`;
  const heading = "Incus UI";

  return (
    <NavLink className="p-panel__logo" to={getOverviewUrl(projectName ?? "")}>
      <img src={src} alt="Incus UI logo" className="p-panel__logo-image" />
      <div
        className={classNames("logo-text p-heading--4", { "is-light": light })}
      >
        {heading}
      </div>
    </NavLink>
  );
};

export default Logo;
