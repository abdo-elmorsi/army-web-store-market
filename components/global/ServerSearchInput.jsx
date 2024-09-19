import React, { useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Input } from "components/UI";
import { useRouter } from "next/router";
import debounce from "lodash.debounce";

const SearchInput = ({
  searchQuery,
  setSearchQuery,
  fetchReport,
  gridFilter = {},
  ...props
}) => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const language = router.locale.toLowerCase();

  const onSearch = useCallback(debounce((query) => {
    fetchReport(1, 10, query?.trim() || "", gridFilter);
  }, 500),
    [gridFilter]
  );

  const searchQueryHandle = useCallback(
    (event) => {
      setSearchQuery(event.target.value);
      onSearch(event.target.value);
    },
    [setSearchQuery]
  );

  const handleKeyPress = useCallback(
    (event) => {
      if (event.key === "Enter") {
        setSearchQuery(event.target?.value || "");
        onSearch(event.target?.value || "");
      }
    },
    [setSearchQuery]
  );

  const magnifyingGlassIcon = useMemo(
    () => (language != "en" ? <MagnifyingGlassIcon width={20} /> : ""),
    [language]
  );

  const rtlMagnifyingGlassIcon = useMemo(
    () => (language == "en" ? <MagnifyingGlassIcon width={20} /> : ""),
    [language]
  );

  return (
    <div className="w-80">
      <Input
        type="text"
        placeholder={t("search_key")}
        className="pl-10 pr-10 rtl:pl-3"
        onChange={searchQueryHandle}
        value={searchQuery}
        onKeyPress={handleKeyPress}
        append={magnifyingGlassIcon}
        prepend={rtlMagnifyingGlassIcon}
        disabled={props.disableSearch}
        {...props}
      />
    </div>
  );
};

SearchInput.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  fetchReport: PropTypes.func.isRequired,
  gridFilter: PropTypes.object,
  append: PropTypes.object,
  disableSearch: PropTypes.bool,
};

export default SearchInput;
