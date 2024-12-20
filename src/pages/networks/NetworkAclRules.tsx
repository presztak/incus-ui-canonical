import { FC } from "react";
import {
  EmptyState,
  Icon,
  MainTable,
  Row,
} from "@canonical/react-components";
import { LxdNetworkAcl } from "types/network";
import { useDocs } from "context/useDocs";
import { Link } from "react-router-dom";
import ScrollableTable from "components/ScrollableTable";
import DeleteNetworkAclRuleBtn from "pages/networks/actions/DeleteNetworkAclRuleBtn";

interface Props {
  acl: LxdNetworkAcl;
  type: string;
  project: string;
}

const NetworkAclRules: FC<Props> = ({ acl, type, project }) => {
  const docBaseLink = useDocs();

  const hasRules = acl[type].length > 0;
  const rules = acl[type];

  const headers = [
    { content: "Action", sortKey: "action" },
    { content: "State", sortKey: "state" },
    { content: "Description", sortKey: "description" },
    { content: "Source", sortKey: "source" },
    { content: "Destination", sortKey: "destination" },
    { "aria-label": "Actions", className: "u-align--right actions" },
  ];

  const rows = rules.map((rule, index) => {
    return {
      columns: [
        {
          content: rule.action,
          role: "cell",
          "aria-label": "Action",
        },
        {
          content: rule.state,
          role: "cell",
          "aria-label": "State",
        },
        {
          content: rule.description,
          role: "cell",
          "aria-label": "Description",
        },
        {
          content: rule.source,
          role: "cell",
          "aria-label": "Source",
        },
        {
          content: rule.destination,
          role: "cell",
          "aria-label": "Destination",
        },
        {
          content: (
            <>
              <DeleteNetworkAclRuleBtn
                acl={acl}
                project={project}
                index={index}
                type={type}
              />
            </>
          ),
          role: "rowheader",
          className: "u-align--right actions",
          "aria-label": "Actions",
        },
      ],
      sortData: {
        action: rule.action,
        state: rule.state,
        description: rule.description,
      },
    };
  });

  return (
    <>
      <Link
        className="p-button--positive u-no-margin--bottom u-float-right"
        to={`/ui/project/${project}/network-acls/${acl.name}/rules/create/${type}`}
      >
        Create rule
      </Link>
      <Row>
        {hasRules && (
          <ScrollableTable
            dependencies={rules}
            tableId="network-acl-rules-table"
            belowIds={["status-bar"]}
          >
            <MainTable
              id="network-acl-rules-table"
              headers={headers}
              expanding
              rows={rows}
              paginate={30}
              sortable
              defaultSort="action"
              defaultSortDirection="ascending"
              className="u-table-layout--auto network-acl-rules-table"
              emptyStateMsg="No data to display"
            />
          </ScrollableTable>
        )}
        {!hasRules && (
          <EmptyState
            className="empty-state"
            image={<Icon className="empty-state-icon" name="exposed" />}
            title="No network ACL rules found"
          >
            <p>There are no network ACL rules in this project.</p>
            <p>
              <a
                href={`${docBaseLink}/howto/networks/`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn more about network ACLs.
                <Icon className="external-link-icon" name="external-link" />
              </a>
            </p>
          </EmptyState>
        )}
      </Row>
    </>
  );
};

export default NetworkAclRules;
