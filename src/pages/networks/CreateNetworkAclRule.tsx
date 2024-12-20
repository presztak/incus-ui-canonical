import { FC } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "util/queryKeys";
import { ActionButton, useNotify } from "@canonical/react-components";
import { useFormik } from "formik";
import NetworkAclRuleForm, {
  NetworkAclRuleFormValues,
  NetworkAclRuleSchema,
  toNetworkAclRule,
} from "pages/networks/forms/NetworkAclRuleForm";
import { Link, useNavigate, useParams } from "react-router-dom";
import BaseLayout from "components/BaseLayout";
import { useDocs } from "context/useDocs";
import HelpLink from "components/HelpLink";
import FormFooterLayout from "components/forms/FormFooterLayout";
import { useToastNotification } from "context/toastNotificationProvider";
import { updateNetworkAcl } from "api/networks";
import { toNetworkAclFormValues } from "util/networkForm";

const CreateNetworkAclRule: FC = () => {
  const docBaseLink = useDocs();
  const navigate = useNavigate();
  const notify = useNotify();
  const toastNotify = useToastNotification();
  const queryClient = useQueryClient();
  const { acl: aclName, project, type } = useParams<{
    acl: string;
    project: string;
    type: string;
  }>();

  console.log(aclName, project);
  const { data: aclObj } = useQuery({
    queryKey: [queryKeys.projects, project, queryKeys.networkAcls, aclName],
    queryFn: () => fetchNetworkAcl(aclName, project),
  });

  const formik = useFormik<NetworkAclRuleFormValues>({
    initialValues: {
      readOnly: false,
      isCreating: true,
    },
    validationSchema: NetworkAclRuleSchema,
    onSubmit: (values) => {
      const rule = toNetworkAclRule(values);
      aclObj[type].push(rule);
      updateNetworkAcl({ ...aclObj, etag: aclObj.etag }, project)
        .then(() => {
          formik.resetForm({
            values: toNetworkAclFormValues(aclObj),
          });

          void queryClient.invalidateQueries({
            queryKey: [
              queryKeys.projects,
              project,
              queryKeys.networkAcls,
              aclObj.name,
            ],
          });
          navigate(`/ui/project/${project}/network-acls/${aclName}/${type}es`);
          toastNotify.success(
            <>
              Network ACL rule added.
            </>,
          );
        })
        .catch((e) => {
          notify.failure("Network ACL rule update failed", e);
        })
        .finally(() => formik.setSubmitting(false));
    },
  });

  return (
    <BaseLayout
      title={
        <HelpLink
          href={`${docBaseLink}/howto/networks/`}
          title="Learn more about networks"
        >
          Create a network ACL rule
        </HelpLink>
      }
      contentClassName="create-network"
    >
      <NetworkAclRuleForm formik={formik} acl={aclObj} />
      <FormFooterLayout>
        <Link
          className="p-button--base"
          to={`/ui/project/${project}/acl-acls/${aclName}/${type}es`}
        >
          Cancel
        </Link>
        <ActionButton
          loading={formik.isSubmitting}
          disabled={!formik.isValid}
          onClick={() => void formik.submitForm()}
        >
          Create
        </ActionButton>
      </FormFooterLayout>
    </BaseLayout>
  );
};

export default CreateNetworkAclRule;
