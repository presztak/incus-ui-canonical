import type { FC, KeyboardEvent } from "react";
import {
  ActionButton,
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
} from "@canonical/react-components";
import { getTomorrow } from "util/helpers";
import type { SnapshotFormValues } from "util/snapshots";
import type { FormikProps } from "formik/dist/types";

interface Props {
  isEdit: boolean;
  formik: FormikProps<SnapshotFormValues<{ stateful?: boolean }>>;
  close: () => void;
  additionalFormInput?: React.JSX.Element;
}

const SnapshotForm: FC<Props> = (props) => {
  const { isEdit, formik, close, additionalFormInput } = props;
  const handleEscKey = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === "Escape") {
      close();
    }
  };

  return (
    <Modal
      className="snapshot-creation-modal"
      close={close}
      title={`${isEdit ? "Edit" : "Create"} snapshot`}
      buttonRow={
        <>
          <Button
            appearance="base"
            className="u-no-margin--bottom"
            type="button"
            onClick={close}
          >
            Cancel
          </Button>
          <ActionButton
            appearance="positive"
            loading={formik.isSubmitting}
            disabled={!formik.isValid || formik.isSubmitting}
            onClick={() => void formik.submitForm()}
          >
            {isEdit ? "Save changes" : "Create snapshot"}
          </ActionButton>
        </>
      }
      onKeyDown={handleEscKey}
    >
      <Form onSubmit={formik.handleSubmit} className="snapshot-creation-form">
        <Input
          id="name"
          name="name"
          type="text"
          label="Snapshot name"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.name}
          error={
            (formik.touched.name || isEdit) && formik.errors.name ? (
              <span className="name-error">{formik.errors.name}</span>
            ) : null
          }
          takeFocus
        />
        <Row className="expiration-wrapper">
          <Col size={6}>
            <Input
              id="expirationDate"
              name="expirationDate"
              type="date"
              label="Expiry date"
              min={getTomorrow()}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.expirationDate ?? ""}
              error={
                formik.touched.expirationDate
                  ? formik.errors.expirationDate
                  : null
              }
            />
          </Col>
          <Col size={6}>
            <Input
              id="expirationTime"
              name="expirationTime"
              type="time"
              label="Expiry time"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.expirationTime ?? ""}
              error={
                formik.touched.expirationTime
                  ? formik.errors.expirationTime
                  : null
              }
            />
          </Col>
        </Row>
        {additionalFormInput}
      </Form>
    </Modal>
  );
};

export default SnapshotForm;
