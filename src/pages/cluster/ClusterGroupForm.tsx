import type { FC } from "react";
import { useEffect, useState } from "react";
import {
  ActionButton,
  Button,
  Col,
  Form,
  Input,
  Row,
  useNotify,
  useToastNotification,
} from "@canonical/react-components";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "util/queryKeys";
import {
  createClusterGroup,
  fetchClusterMembers,
  updateClusterGroup,
} from "api/cluster";
import type { LxdClusterGroup } from "types/cluster";
import * as Yup from "yup";
import { checkDuplicateName } from "util/helpers";
import { useFormik } from "formik";
import { updateMaxHeight } from "util/updateMaxHeight";
import useEventListener from "util/useEventListener";
import { useNavigate, useParams } from "react-router-dom";
import { getClusterHeaders, getClusterRows } from "util/clusterGroups";
import SelectableMainTable from "components/SelectableMainTable";
import NotificationRow from "components/NotificationRow";
import BaseLayout from "components/BaseLayout";
import AutoExpandingTextArea from "components/AutoExpandingTextArea";
import ResourceLink from "components/ResourceLink";

export interface ClusterGroupFormValues {
  description: string;
  members: string[];
  name: string;
}

interface Props {
  group?: LxdClusterGroup;
}

const ClusterGroupForm: FC<Props> = ({ group }) => {
  const navigate = useNavigate();
  const notify = useNotify();
  const toastNotify = useToastNotification();
  const { group: activeGroup } = useParams<{ group: string }>();
  const queryClient = useQueryClient();
  const controllerState = useState<AbortController | null>(null);

  const { data: members = [], error } = useQuery({
    queryKey: [queryKeys.cluster, queryKeys.members],
    queryFn: fetchClusterMembers,
  });

  if (error) {
    notify.failure("Loading cluster members failed", error);
  }

  const ClusterGroupSchema = Yup.object().shape({
    name: Yup.string()
      .test(
        "deduplicate",
        "A cluster group with this name already exists",
        async (value) =>
          group?.name === value ||
          checkDuplicateName(value, "", controllerState, "cluster/groups"),
      )
      .required(),
  });

  const formik = useFormik<ClusterGroupFormValues>({
    initialValues: {
      description: group?.description ?? "",
      members: group?.members ?? [],
      name: group?.name ?? "",
    },
    validationSchema: ClusterGroupSchema,
    onSubmit: (values) => {
      const mutation = group ? updateClusterGroup : createClusterGroup;
      mutation({
        name: values.name,
        description: values.description,
        members: values.members,
      })
        .then(() => {
          const verb = group ? "saved" : "created";
          navigate(`/ui/cluster/group/${encodeURIComponent(values.name)}`);
          toastNotify.success(
            <>
              Cluster group{" "}
              <ResourceLink
                type="cluster-group"
                value={values.name}
                to={`/ui/cluster/group/${encodeURIComponent(values.name)}`}
              />{" "}
              {verb}.
            </>,
          );
        })
        .catch((e: Error) => {
          formik.setSubmitting(false);
          const verb = group ? "save" : "creation";
          notify.failure(`Cluster group ${verb} failed`, e);
        })
        .finally(() => {
          queryClient.invalidateQueries({
            queryKey: [queryKeys.cluster, queryKeys.groups],
          });
        });
    },
  });

  const updateFormHeight = () => {
    updateMaxHeight("form-contents", "p-bottom-controls");
  };
  useEffect(updateFormHeight, [notify.notification?.message]);
  useEventListener("resize", updateFormHeight);

  return (
    <BaseLayout
      title={group ? "Edit cluster group" : "Create cluster group"}
      contentClassName="cluster-group-form"
    >
      <Form onSubmit={formik.handleSubmit} className="form">
        <Row className="form-contents">
          <Col size={12}>
            <NotificationRow />
            <div className="cluster-group-metadata">
              <Input
                id="name"
                type="text"
                label="Group name"
                placeholder="Enter name"
                required
                disabled={Boolean(group)}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.name}
                error={formik.touched.name ? formik.errors.name : null}
              />
              <AutoExpandingTextArea
                id="description"
                name="description"
                label="Description"
                placeholder="Enter description"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.description}
                error={
                  formik.touched.description ? formik.errors.description : null
                }
              />
            </div>
            <div className="choose-label">
              Choose members from the list{" "}
              <span className="u-text--muted">
                ({formik.values.members.length} selected)
              </span>{" "}
            </div>
            <SelectableMainTable
              headers={getClusterHeaders()}
              rows={getClusterRows(members, activeGroup)}
              sortable
              className="cluster-group-select-members"
              filteredNames={members.map((member) => member.server_name)}
              itemName="member"
              parentName="cluster"
              selectedNames={formik.values.members}
              setSelectedNames={(newMembers: string[]) =>
                void formik.setFieldValue("members", newMembers)
              }
              disabledNames={[]}
            />
          </Col>
        </Row>
      </Form>
      <div className="p-bottom-controls" id="form-footer">
        <hr />
        <Row className="u-align--right">
          <Col size={12}>
            <Button
              appearance="base"
              onClick={async () => navigate(`/ui/cluster`)}
            >
              Cancel
            </Button>
            <ActionButton
              appearance="positive"
              loading={formik.isSubmitting}
              disabled={
                !formik.isValid || formik.isSubmitting || !formik.values.name
              }
              onClick={() => void formik.submitForm()}
            >
              {group ? "Save changes" : "Create"}
            </ActionButton>
          </Col>
        </Row>
      </div>
    </BaseLayout>
  );
};

export default ClusterGroupForm;
