import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getSession } from "next-auth/react";
import PropTypes from "prop-types"
import { useRouter } from "next/router";

// Custom
import { Layout, LayoutWithSidebar } from "components/layout";
import { towerColumns } from "components/columns";
import { ServerTable, DeleteModal, Header } from "components/global";
import { Actions, MinimizedBox, Modal } from "components/UI";
import { AddUpdateModal, PrintView, ApartmentsDetails } from "components/pages/towers";
import exportExcel from "utils/useExportExcel";
import { useHandleMessage } from "hooks";
import { isSuperAdmin } from "utils/utils";
import API from "helper/apis";

const Index = ({ session }) => {
  const router = useRouter();
  const is_super_admin = isSuperAdmin(session);
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

  // ================== add-update tower ============
  const [refetch, setRefetch] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState({
    isOpen: false,
    id: null
  });
  const handleUpdate = (id) => {
    setShowUpdateModal(({ id: id, isOpen: true }));
  };
  const closeEditModal = (status) => {
    setShowUpdateModal(({}));
    status && setRefetch(!refetch);
  };
  // ================== add-update tower ============

  // ================== delete tower ============
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
      await API.deleteTower(showDeleteModal?.id);
      closeDeleteModal();
      fetchReport();
    } catch (error) {
      handleMessage(error);
    } finally {
      setShowDeleteModal(prev => ({ ...prev, loading: false }))
    }
  }
  // ================== delete tower ============


  const [viewApartmentsModal, setViewApartmentsModal] = useState({
    isOpen: false,
    id: null
  });
  const closeViewApartmentsModal = () => {
    setViewApartmentsModal(({}));
  };
  const showApartments = (id) => {
    setViewApartmentsModal({ id: id, isOpen: true });
  };

  const columns = towerColumns(t, handleUpdate, setShowDeleteModal, showApartments, date_format, is_super_admin);

  const fetchReport = async (page, perPage, query = "") => {
    const search = query?.trim() || searchQuery;
    setLoading(true);
    try {
      const data = await API.getAllTowers({
        search,
        searchFields: ["name"],
        ...(!is_super_admin ? { filters: `owner=${session.user._id}` } : {}),
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
    await exportExcel(tableData, columns, t("towers_key"), handleMessage);
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
  }, [refetch]);
  return (
    <>
      <div className="min-h-full bg-gray-100 rounded-md dark:bg-gray-700">
        <Header
          title={t("towers_key")}
          path="/dashboard/towers"
          classes="bg-gray-100 dark:bg-gray-700 border-none"
        />
        <MinimizedBox></MinimizedBox>
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
              addMsg={t("add_tower_key")}
              onClickAdd={() => setShowUpdateModal({ isOpen: true, id: null })}
              onClickPrint={exportPDF}
              onClickExport={handleExportExcel}
              isDisabledExport={exportingExcel || !tableData?.length}
            />
          }
        />
      </div>
      <PrintView ref={printViewRef} data={tableData} />

      {showUpdateModal?.isOpen && (
        <Modal
          title={t("add_tower_key")}
          show={showUpdateModal?.isOpen}
          footer={false}
          onClose={() => closeEditModal()}
        >
          <AddUpdateModal
            fetchReport={fetchReport}
            handleClose={(status) => closeEditModal(status)}
            id={showUpdateModal?.id}
            session={session}
          />
        </Modal>
      )}

      {viewApartmentsModal?.isOpen && (
        <Modal
          title={t("apartments_details_key")}
          show={viewApartmentsModal?.isOpen}
          footer={false}
          onClose={() => closeViewApartmentsModal()}
        >
          <ApartmentsDetails
            handleClose={() => closeViewApartmentsModal()}
            id={viewApartmentsModal?.id}
            session={session}
          />
        </Modal>
      )}

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



Index.getLayout = function PageLayout(page) {
  return (
    <Layout>
      <LayoutWithSidebar>{page}</LayoutWithSidebar>
    </Layout>
  );
};

export default Index;

Index.propTypes = {
  session: PropTypes.object.isRequired
};
export const getServerSideProps = async ({ req, locale, resolvedUrl }) => {
  const session = await getSession({ req: req });
  const userRole = session?.user?.role;

  if (!session || (userRole !== "admin" && userRole !== "superAdmin")) {
    const loginUrl = locale === "en" ? `/${locale}/login` : "/login";
    return {
      redirect: {
        destination: `${loginUrl}?returnTo=${encodeURIComponent(resolvedUrl || "/")}`,
        permanent: false,
      },
    };
  } else {
    return {
      props: {
        session,
        ...(await serverSideTranslations(locale, ["common"])),
      },
    };
  }
};
