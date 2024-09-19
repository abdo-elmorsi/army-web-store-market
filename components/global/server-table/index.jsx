import React from "react";
import DataTable from "react-data-table-component";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Spinner } from "components/UI";
import { useTranslation } from "react-i18next";

const ServerTable = ({
  data,
  columns,
  noHeader,
  paginationPerPage,
  paginationRowsPerPageOptions,
  actions,
  selectableRowSelected,
  handlePageChange,
  handlePerRowsChange,
  paginationTotalRows,
  ...rest
}) => {
  const { theme } = useSelector((state) => state.theme);
  const { t } = useTranslation("common");

  return (
    <div className="p-5 overflow-hidden bg-white rounded-2xl dark:bg-gray-800">
      <div className="flex flex-row flex-wrap items-center justify-between gap-2 mb-2">
        {actions}
      </div>
      <DataTable
        fixedHeader
        noHeader={noHeader}
        fixedHeaderScrollHeight="550px"

        data={data}
        columns={columns}

        theme={theme}
        selectableRowSelected={selectableRowSelected}
        highlightOnHover
        defaultSortField="id"
        defaultSortAsc={false}


        // pagination
        pagination
        paginationServer
        paginationPerPage={paginationPerPage}
        paginationTotalRows={paginationTotalRows}
        paginationRowsPerPageOptions={paginationRowsPerPageOptions}
        paginationComponentOptions={{
          rowsPerPageText: t("rows_per_page_key"),
          rangeSeparatorText: t("of_key"),
        }}


        // actions
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handlePerRowsChange}

        progressPending={rest.loading}
        progressComponent={<Spinner className="w-10 my-44" />}
        noDataComponent={<h3 className="my-16">{t("table_no_data_message_key")}</h3>}
        {...rest}
      />
    </div>
  );
};

ServerTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      selector: PropTypes.oneOfType([PropTypes.string, PropTypes.func.isRequired]),
      sortable: PropTypes.bool,
      format: PropTypes.func,
      cell: PropTypes.func,
      width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      wrap: PropTypes.bool,
    })
  ).isRequired,
  noHeader: PropTypes.bool,
  fixedHeader: PropTypes.bool,
  pagination: PropTypes.bool,
  paginationPerPage: PropTypes.number,
  paginationRowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
  actions: PropTypes.element,
  selectableRowSelected: PropTypes.func,
  handlePageChange: PropTypes.func,
  handlePerRowsChange: PropTypes.func,
  paginationTotalRows: PropTypes.number
};

ServerTable.defaultProps = {
  noHeader: false,
  fixedHeader: true,
  pagination: true,
  paginationPerPage: 10,
  paginationRowsPerPageOptions: [10, 25, 50, 100]
};
export default ServerTable;
