import React from "react";
import { useTranslation } from "react-i18next";

const ClearStorageButton = () => {
  const { t } = useTranslation("common");

  const clearStorage = () => {
    // Clear local storage
    localStorage.clear();

    // Clear session storage
    sessionStorage.clear();
    
  };

  return (
    <span
      className="text-primary cursor-pointer text-sm p-2 mx-auto mb-6 "
      onClick={clearStorage}
    >
      {t("clear_cache_key")}
    </span>
  );
};

export default ClearStorageButton;
