import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types"
import { useRouter } from "next/router";

// Custom
import { apartmentColumns } from "components/columns";
import { ServerTable, DeleteModal } from "components/global";
import { Actions, Modal } from "components/UI";
import { PrintView } from "components/pages/apartments";
import exportExcel from "utils/useExportExcel";
import { useHandleMessage } from "hooks";
import API from "helper/apis";

const ApartmentsDetails = ({ session, id }) => {
  const router = useRouter();
  const language = router.locale.toLowerCase();
  const date_format = language === 'en' ? 'DD/MM/YYYY' : 'YYYY/MM/DD';

  const [tableData, setTableData] = useState([]);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(true);
  const handleMessage = useHandleMessage();

  const { t } = useTranslation("common");
  const [exportingExcel, setExportingExcel] = useState(false);
  const printViewRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");


  // ================== delete apartment ============
  const [showDeleteModal, setShowDeleteModal] = useState({
    loading: false,
    isOpen: false,
    id: null
  });
  const closeDeleteModal = () => {
    setShowDeleteModal(({}));
  };
  const handleDelete = async () => {
    setShowDeleteModal(prev => ({ ...prev, loading: true }))
    try {
      await API.deleteApartment(showDeleteModal?.id);
      closeDeleteModal();
      fetchReport();
    } catch (error) {
      handleMessage(error);
    } finally {
      setShowDeleteModal(prev => ({ ...prev, loading: false }))
    }
  }
  // ================== delete apartment ============

  const handleUpdate = () => { }
  const columns = apartmentColumns(t, handleUpdate, setShowDeleteModal, date_format, { details: true });
  const fetchReport = async (page, perPage, query = "") => {
    const search = query?.trim() || searchQuery;
    setLoading(true);

    try {
      const data = await API.getAllApartments({
        search,
        searchFields: ["piece_number"],
        filters: `admin_id=${session.user._id},tower=${id}`,
        page,
        limit: perPage,
      });
      setTableData(data.items);
      setTotalRows(data.totalRecords);
      setLoading(false);
    } catch (error) {
      handleMessage(error, null, setLoading);
    }
  };

  const handlePageChange = (page) => fetchReport(page, perPage);

  const handlePerRowsChange = (rowsPerPage, page) => {
    setPerPage(rowsPerPage);
    fetchReport(page, rowsPerPage);
  };

  const handleExportExcel = async () => {
    setExportingExcel(true);
    await exportExcel(tableData, columns, t("apartments_key"), handleMessage);
    setTimeout(() => {
      setExportingExcel(false);
    }, 1000);
  };

  const exportPDF = useCallback(() => {
    if (printViewRef.current) {
      printViewRef.current.print();
    }
  }, [printViewRef.current]);
  useEffect(() => {
    fetchReport(1, 10);
  }, []);


  return (
    <>
      <div className="min-w-full bg-gray-100 rounded-md dark:bg-gray-700">
        <ServerTable
          columns={columns}
          data={tableData || []}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          fetchReport={fetchReport}
          handlePageChange={handlePageChange}
          handlePerRowsChange={handlePerRowsChange}
          progressPending={loading}
          paginationTotalRows={totalRows}
          paginationPerPage={perPage}
          actions={
            <Actions
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              fetchReport={fetchReport}
              onClickPrint={exportPDF}
              onClickExport={handleExportExcel}
              isDisabledExport={exportingExcel || !tableData?.length}
            />
          }
        />
      </div>
      <PrintView ref={printViewRef} data={tableData} />

      {showDeleteModal?.isOpen && (
        <Modal
          title={t("delete_key")}
          show={showDeleteModal?.isOpen}
          footer={false}
          onClose={() => closeDeleteModal()}
        >
          <DeleteModal
            showDeleteModal={showDeleteModal}
            handleClose={() => closeDeleteModal()}
            handleDelete={handleDelete}
          />
        </Modal>
      )}

    </>
  );
};

ApartmentsDetails.propTypes = {
  session: PropTypes.object.isRequired,
  id: PropTypes.number.isRequired
};



export default ApartmentsDetails;