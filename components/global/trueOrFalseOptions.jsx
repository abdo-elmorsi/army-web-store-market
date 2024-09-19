import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Select } from "components/UI";
import { useSelect } from "hooks";

export default function TrueOrFalseOptions({ label, KeyName, fetchReport }) {
  const { t } = useTranslation("common");

  const status = useSelect("", "select", null);
  return (
    <div className="">
      <Select
        placeholder={t("select_key")}
        label={label}
        options={[
          {
            value: null,
            label: t("all_key"),
          },
          {
            value: true,
            label: t("yes_key"),
          },
          {
            value: false,
            label: t("no_key"),
          },
        ]}
        value={status.value}
        onChange={(value) => {
          status.changeValue(value);
          fetchReport && fetchReport({ [KeyName]: value });
        }}
      />
    </div>
  );
}
TrueOrFalseOptions.propTypes = {
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  KeyName: PropTypes.string.isRequired,
  fetchReport: PropTypes.func,
};
