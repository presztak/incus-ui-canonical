import { type FC } from "react";
import { Spinner, CustomLayout } from "@canonical/react-components";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "context/auth";
import { ROOT_PATH } from "util/rootPath";
import { useSettings } from "context/useSettings";
import { AUTH_METHOD } from "util/authentication";
import DsIcon from "components/DsIcon";

const Login: FC = () => {
  const { isAuthenticated, isAuthLoading } = useAuth();
  const { data: settings } = useSettings();
  const hasOidc = settings?.auth_methods?.includes(AUTH_METHOD.OIDC);

  if (isAuthLoading) {
    return <Spinner className="u-loader" text="Loading resources..." />;
  }

  if (isAuthenticated) {
    return <Navigate to={`${ROOT_PATH}/ui`} replace={true} />;
  }

  return (
    <>
      <CustomLayout>
        <div className="empty-state login-page">
          <h1 className="p-heading--4 u-sv-2">Login</h1>

          <>
            <p className="u-sv1">Choose your login method</p>
            <div className="auth-container">
              {hasOidc && (
                <a
                  className="p-button--positive has-icon"
                  href={`${ROOT_PATH}/oidc/login`}
                >
                  <DsIcon icon="security" />
                  <span>Login with SSO</span>
                </a>
              )}
              <Link to={`${ROOT_PATH}/ui/login/certificate-generate`}>
                <span>Set up TLS login</span>
              </Link>
            </div>
          </>
        </div>
      </CustomLayout>
    </>
  );
};

export default Login;
