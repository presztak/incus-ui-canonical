import { cloneElement, ReactElement, ReactNode } from "react";
import { Button, Icon, Label, Tooltip } from "@canonical/react-components";
import { CpuLimit, MemoryLimit } from "types/limits";
import { MainTableRow } from "@canonical/react-components/dist/components/MainTable/MainTable";
import classnames from "classnames";
import { FormikProps } from "formik/dist/types";
import ConfigFieldDescription from "pages/settings/ConfigFieldDescription";
import {
  InstanceAndProfileFormikProps,
  InstanceAndProfileFormValues,
} from "components/forms/instanceAndProfileFormValues";
import { StorageVolumeFormValues } from "pages/storage/forms/StorageVolumeForm";
import { NetworkFormValues } from "pages/networks/forms/NetworkForm";
import { ProjectFormValues } from "pages/projects/CreateProject";
import { getConfigRowMetadata } from "util/configInheritance";
import { NetworkAclFormValues } from "pages/networks/forms/NetworkAclForm";
import { StoragePoolFormValues } from "pages/storage/forms/StoragePoolForm";
import { ensureEditMode } from "util/instanceEdit";
import { focusField } from "util/formFields";

export type ConfigurationRowFormikValues =
  | InstanceAndProfileFormValues
  | StorageVolumeFormValues
  | NetworkFormValues
  | ProjectFormValues
  | StoragePoolFormValues
  | NetworkAclFormValues;

export type ConfigurationRowFormikProps =
  | InstanceAndProfileFormikProps
  | FormikProps<NetworkFormValues>
  | FormikProps<ProjectFormValues>
  | FormikProps<StorageVolumeFormValues>
  | FormikProps<StoragePoolFormValues>
  | FormikProps<NetworkAclFormValues>;

interface Props {
  formik: ConfigurationRowFormikProps;
  name: string;
  label: string | ReactNode;
  children: ReactElement;
  defaultValue?: string | CpuLimit | MemoryLimit | boolean;
  disabled?: boolean;
  disabledReason?: string;
  help?: string;
  inputHelp?: string;
  readOnlyRenderer?: (value: unknown) => string | ReactNode;
}

export const getConfigurationRow = ({
  formik,
  name,
  label,
  children,
  defaultValue,
  disabled = false,
  disabledReason,
  help,
  inputHelp,
  readOnlyRenderer = (value) => <>{value}</>,
}: Props): MainTableRow => {
  const values = formik.values as unknown as Record<string, string | undefined>;
  const value = values[name];
  const isOverridden = value !== undefined;
  const overrideValue = readOnlyRenderer(value === "" ? "-" : value);
  const metadata = getConfigRowMetadata(formik.values, name);

  const enableOverride = () => {
    void formik.setFieldValue(name, defaultValue);
  };

  const toggleDefault = () => {
    if (isOverridden) {
      void formik.setFieldValue(name, undefined);
    } else {
      enableOverride();
      focusField(name);
    }
  };

  const getForm = (): ReactNode => {
    return (
      <div className="override-form">
        {wrapDisabledTooltip(
          <div>
            {cloneElement(children, {
              id: name,
              name,
              onBlur: formik.handleBlur,
              onChange: formik.handleChange,
              value,
              disabled,
              help: (
                <ConfigFieldDescription
                  description={
                    metadata.configField
                      ? metadata.configField.longdesc
                      : inputHelp
                  }
                  className="p-form-help-text"
                />
              ),
            })}
          </div>,
        )}
        <Button
          onClick={toggleDefault}
          type="button"
          appearance="base"
          title={disabled ? disabledReason : "Clear override"}
          disabled={disabled}
          hasIcon
          className="u-no-margin--bottom"
        >
          <Icon name="close" className="clear-configuration-icon" />
        </Button>
      </div>
    );
  };

  const displayLabel = isOverridden ? (
    <Label forId={name}>
      <b>{label}</b>
    </Label>
  ) : (
    <b>{label}</b>
  );

  const wrapDisabledTooltip = (children: ReactNode): ReactNode => {
    if (disabled && disabledReason) {
      return (
        <Tooltip message={disabledReason} position="right">
          {children}
        </Tooltip>
      );
    }
    return children;
  };

  const renderOverride = (): ReactNode => {
    if (formik.values.readOnly) {
      return (
        <>
          {overrideValue}
          <Button
            onClick={() => {
              ensureEditMode(formik);
              if (!isOverridden) {
                enableOverride();
              }
              focusField(name);
            }}
            className="u-no-margin--bottom"
            type="button"
            appearance="base"
            title={
              disabled
                ? disabledReason
                : isOverridden
                  ? "Edit"
                  : "Create override"
            }
            disabled={disabled}
            hasIcon
          >
            <Icon name="edit" />
          </Button>
        </>
      );
    }
    if (isOverridden) {
      return getForm();
    }
    return wrapDisabledTooltip(
      <Button
        onClick={toggleDefault}
        className="u-no-margin--bottom"
        type="button"
        disabled={disabled}
        appearance="base"
        title="Create override"
        hasIcon
      >
        <Icon name="edit" />
      </Button>,
    );
  };

  return getConfigurationRowBase({
    configuration: (
      <>
        {displayLabel}
        <ConfigFieldDescription
          description={
            metadata.configField ? metadata.configField.shortdesc : help
          }
          className="configuration-help"
        />
      </>
    ),
    inherited: (
      <div
        className={classnames({
          "u-text--muted": isOverridden,
          "u-text--line-through": isOverridden,
        })}
      >
        <div className="mono-font">
          <b>{readOnlyRenderer(metadata.value)}</b>
        </div>
        {metadata && (
          <div className="p-text--small u-text--muted">
            From: {metadata.source}
          </div>
        )}
      </div>
    ),
    override: renderOverride(),
  });
};

interface BaseProps {
  configuration: ReactNode;
  inherited: ReactNode;
  override: ReactNode;
  className?: string;
}

export const getConfigurationRowBase = ({
  configuration,
  inherited,
  override,
  className,
}: BaseProps): MainTableRow => {
  return {
    className,
    columns: [
      {
        content: configuration,
        className: "configuration",
      },
      {
        content: inherited,
        className: "inherited",
      },
      {
        content: override,
        className: "override",
      },
    ],
  };
};
