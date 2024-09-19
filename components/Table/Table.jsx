import React, { useState } from "react";
import DataTable from "react-data-table-component";
import PropTypes from "prop-types";
import SearchInput from "../global/SearchInput";
import { useSelector } from "react-redux";
import { Spinner } from "components/UI";
import { useTranslation } from "react-i18next";

const Table = ({
  data,
  columns,
  noHeader,
  pagination,
  paginationPerPage,
  paginationRowsPerPageOptions,
  actions,
  searchAble,
  selectableRowSelected,
  ...rest
}) => {
  const [searchText, setSearchText] = useState("");
  const { theme } = useSelector((state) => state.theme);
  const { t } = useTranslation("common");

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const filteredData = data?.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchText.toLowerCase())
    )
  );

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-gray-800">
      <div className="flex flex-row flex-wrap items-center justify-between gap-2 mb-2">
        {searchAble && (
          <SearchInput
            searchText={searchText}
            handleSearch={handleSearch}
            id="search-bar"
            name="search-bar"
            maxLength={50}
            autoFocus={true}
          />
        )}
        {actions}
      </div>
      <DataTable
        filter={!searchAble}
        data={filteredData}
        // theme={theme}
        columns={columns}
        noHeader={noHeader}
        pagination={pagination}
        paginationPerPage={paginationPerPage}
        paginationRowsPerPageOptions={paginationRowsPerPageOptions}
        progressPending={rest.loading}
        progressComponent={<Spinner className="w-10 my-44" />}
        noDataComponent={
          <h3 className="my-16">{t("table_no_data_message_key")}</h3>
        }
        selectableRowSelected={selectableRowSelected}
        theme={theme}
        fixedHeader
        fixedHeaderScrollHeight="550px"
        // selectableRowsComponent={<Checkbox />}
        {...rest}
      />
    </div>
  );
};

Table.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  noHeader: PropTypes.bool,
  pagination: PropTypes.bool,
  paginationPerPage: PropTypes.number,
  paginationRowsPerPageOptions: PropTypes.array,
  actions: PropTypes.element,
  searchAble: PropTypes.bool,
  selectableRowSelected: PropTypes.func,
};

Table.defaultProps = {
  noHeader: false,
  pagination: true,
  searchAble: true,
  paginationPerPage: 10,
};

export default Table;
