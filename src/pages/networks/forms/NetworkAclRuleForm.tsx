import { FC, useEffect } from "react";
import {
  Col,
  Form,
  Input,
  Label,
  Notification,
  Row,
  useNotify,
} from "@canonical/react-components";
import { FormikProps } from "formik/dist/types";
import * as Yup from "yup";
import { LxdNetworkAcl } from "types/network";
import { updateMaxHeight } from "util/updateMaxHeight";
import useEventListener from "@use-it/event-listener";
import NotificationRow from "components/NotificationRow";
import ScrollableForm from "components/ScrollableForm";

export const toNetworkAclRule = (
  values: NetworkAclRuleFormValues,
): LxdNetworkAclRule => {
  return {
    action: values.action,
    state: values.state,
    description: values.description,
    source: values.source,
    destination: values.destination,
    protocol: values.protocol,
    source_port: values.sourcePort,
    destination_port: values.destinationPort,
    icmp_type: values.icmpType,
    icmp_ode: values.icmpCode,
  };
};

export const NetworkAclRuleSchema = Yup.object().shape({
});

export interface NetworkAclRuleFormValues {
  readOnly: boolean;
  isCreating: boolean;
  action: string;
  state: string;
  description?: string;
  source?: string;
  destination?: string;
  protocol?: string;
  sourcePort?: string;
  destinationPort?: string;
  icmpType?: string;
  icmpCode?: string;
  yaml?: string;
}

interface Props {
  formik: FormikProps<NetworkAclFormValues>;
  isEdit?: boolean;
  acl?: LxdNetworkAcl;
}

const NetworkAclRuleForm: FC<Props> = ({ formik, isEdit, acl }) => {
  const notify = useNotify();

  const updateFormHeight = () => {
    updateMaxHeight("form-contents", "p-bottom-controls");
  };
  useEffect(updateFormHeight, [notify.notification?.message]);
  useEventListener("resize", updateFormHeight);

  return (
    <Form className="form network-forwards-form" onSubmit={formik.handleSubmit}>
      <Row className="form-contents">
        <Col size={12}>
          <ScrollableForm>
            {/* hidden submit to enable enter key in inputs */}
            <Input type="submit" hidden value="Hidden input" />
            <Row className="p-form__group p-form-validation">
              <NotificationRow />
            </Row>
            <Input
              {...formik.getFieldProps("action")}
              type="text"
              label="Action"
              required
              disabled={formik.values.readOnly || !formik.values.isCreating}
            />
            <Input
              {...formik.getFieldProps("state")}
              type="text"
              label="State"
              required
              disabled={formik.values.readOnly || !formik.values.isCreating}
            />
            <Input
              {...formik.getFieldProps("description")}
              id="description"
              type="text"
              label="Description"
              placeholder="Enter description"
              stacked
            />
            <Input
              {...formik.getFieldProps("source")}
              id="source"
              type="text"
              label="Source"
            />
            <Input
              {...formik.getFieldProps("destination")}
              id="destination"
              type="text"
              label="Destination"
            />
            <Input
              {...formik.getFieldProps("protocol")}
              id="protocol"
              type="text"
              label="Protocol"
            />
            <Input
              {...formik.getFieldProps("source_port")}
              id="source_port"
              type="text"
              label="Source port"
            />
            <Input
              {...formik.getFieldProps("destination_port")}
              id="destination_port"
              type="text"
              label="Destination port"
            />
            <Input
              {...formik.getFieldProps("icmp_type")}
              id="icmp_type"
              type="text"
              label="ICMP type"
            />
            <Input
              {...formik.getFieldProps("icmp_code")}
              id="icmp_code"
              type="text"
              label="ICMP code"
            />
          </ScrollableForm>
        </Col>
      </Row>
    </Form>
  );
};

export default NetworkAclRuleForm;
