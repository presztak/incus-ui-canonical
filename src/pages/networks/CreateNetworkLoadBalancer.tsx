import type { FC } from "react";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "util/queryKeys";
import {
  ActionButton,
  useNotify,
  useToastNotification,
} from "@canonical/react-components";
import { useFormik } from "formik";
import type { NetworkLoadBalancerFormValues } from "pages/networks/forms/NetworkLoadBalancerForm";
import NetworkLoadBalancerForm, {
  NetworkLoadBalancerSchema,
  toNetworkLoadBalancer,
} from "pages/networks/forms/NetworkLoadBalancerForm";
import { createNetworkLoadBalancer } from "api/network-load-balancers";
import { Link, useNavigate, useParams } from "react-router-dom";
import BaseLayout from "components/BaseLayout";
import LoadBalancerExplanationTooltip from "pages/networks/LoadBalancerExplanationTooltip";
import FormFooterLayout from "components/forms/FormFooterLayout";
import { useNetwork } from "context/useNetworks";
import { ovnType } from "util/networks";

const CreateNetworkLoadBalancer: FC = () => {
  const navigate = useNavigate();
  const notify = useNotify();
  const toastNotify = useToastNotification();
  const queryClient = useQueryClient();
  const { network: networkName, project } = useParams<{
    network: string;
    project: string;
  }>();

  const { data: network, error: networkError } = useNetwork(
    networkName ?? "",
    project ?? "",
  );

  useEffect(() => {
    if (networkError) {
      notify.failure("Loading networks failed", networkError);
    }
  }, [networkError]);

  const formik = useFormik<NetworkLoadBalancerFormValues>({
    initialValues: {
      listenAddress: "",
      backends: [],
      ports: [],
    },
    validationSchema: NetworkLoadBalancerSchema,
    onSubmit: (values) => {
      const loadBalancer = toNetworkLoadBalancer(values);
      createNetworkLoadBalancer(networkName ?? "", loadBalancer, project ?? "")
        .then((listenAddress) => {
          queryClient.invalidateQueries({
            queryKey: [
              queryKeys.projects,
              project,
              queryKeys.networks,
              network,
              queryKeys.loadBalancers,
            ],
          });
          navigate(
            `/ui/project/${encodeURIComponent(project ?? "")}/network/${encodeURIComponent(networkName ?? "")}/load-balancers`,
          );
          toastNotify.success(
            `Network load balancer with listen address ${listenAddress} created.`,
          );
        })
        .catch((e) => {
          formik.setSubmitting(false);
          notify.failure("Network load balancer creation failed", e);
        });
    },
  });

  return (
    <BaseLayout
      title={
        <LoadBalancerExplanationTooltip>
          Create a network load balancer
        </LoadBalancerExplanationTooltip>
      }
      contentClassName="create-network"
    >
      <NetworkLoadBalancerForm formik={formik} network={network} />
      <FormFooterLayout>
        <Link
          className="p-button--base"
          to={`/ui/project/${encodeURIComponent(project ?? "")}/network/${encodeURIComponent(networkName ?? "")}/load-balancers`}
        >
          Cancel
        </Link>
        <ActionButton
          loading={formik.isSubmitting}
          disabled={
            !formik.isValid ||
            formik.isSubmitting ||
            !formik.values.listenAddress
          }
          onClick={() => void formik.submitForm()}
        >
          Create
        </ActionButton>
      </FormFooterLayout>
    </BaseLayout>
  );
};

export default CreateNetworkLoadBalancer;
