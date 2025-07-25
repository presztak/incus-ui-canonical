import type { FC } from "react";
import { Col, Notification, Row, useNotify } from "@canonical/react-components";
import { Navigate } from "react-router-dom";
import { useAuth } from "context/auth";
import Loader from "components/Loader";
import CertificateAddForm from "pages/login/CertificateAddForm";
import NotificationRow from "components/NotificationRow";
import CustomLayout from "components/CustomLayout";
import HelpLink from "components/HelpLink";

const CertificateAdd: FC = () => {
  const { isAuthenticated, isAuthLoading } = useAuth();
  const notify = useNotify();

  if (isAuthLoading) {
    return <Loader />;
  }

  if (isAuthenticated) {
    return <Navigate to="/ui" replace={true} />;
  }

  return (
    <CustomLayout
      mainClassName="certificate-generate"
      header={
        <div className="p-panel__header is-sticky">
          <h1 className="p-panel__title">
              Add existing certificate
          </h1>
        </div>
      }
    >
      {notify.notification ? (
        <NotificationRow />
      ) : (
        <Row>
          <Notification severity="caution">
            A client certificate must be present and selected in your browser.
            <br />
          </Notification>
        </Row>
      )}
      <Row className="u-no-margin--left">
        <Col size={12}>
          <ol className="p-stepped-list--detailed">
            <li className="p-stepped-list__item">
              <Row>
                <Col size={3}>
                  <h2 className="p-stepped-list__title p-heading--5">
                    Create token
                  </h2>
                </Col>
                <Col size={6}>
                  <div className="p-stepped-list__content">
                    <p>Generate a token on the command line</p>
                    <div className="p-code-snippet">
                      <pre className="p-code-snippet__block--icon">
                        <code>incus config trust add incus-ui</code>
                      </pre>
                    </div>
                  </div>
                </Col>
              </Row>
            </li>
            <li className="p-stepped-list__item">
              <Row>
                <Col size={3}>
                  <h2 className="p-stepped-list__title p-heading--5">Import</h2>
                </Col>
                <Col size={6}>
                  <div className="p-stepped-list__content">
                    <CertificateAddForm />
                  </div>
                </Col>
              </Row>
            </li>
            <li className="p-stepped-list__item u-no-margin--bottom">
              <Row>
                <Col size={3}>
                  <h2 className="p-stepped-list__title p-heading--5">Done</h2>
                </Col>
                <Col size={6}>
                  <div className="p-stepped-list__content">
                    <p>Enjoy Incus UI.</p>
                  </div>
                </Col>
              </Row>
            </li>
          </ol>
        </Col>
      </Row>
    </CustomLayout>
  );
};

export default CertificateAdd;
