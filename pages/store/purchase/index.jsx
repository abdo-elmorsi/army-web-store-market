import { useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getSession } from "next-auth/react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import moment from "moment";

// Custom imports
import { Layout, LayoutWithSidebar } from "components/layout";
import { DeleteModal, Header, ServerTable } from "components/global";
import { Actions, Button, MinimizedBox, Modal } from "components/UI";
import { Filter } from "components/pages/store/purchase";
import exportExcel from "utils/useExportExcel";
import { useHandleMessage, useQueryString } from "hooks";
import { useApi, useApiMutation } from "hooks/useApi";
import PrintView from "components/global/printView";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

const Index = () => {
    const router = useRouter();
    const language = router.locale.toLowerCase();
    const date_format = language === "en" ? "DD/MM/YYYY" : "YYYY/MM/DD";
    const handleMessage = useHandleMessage();
    const { t } = useTranslation("common");
    const [exportingExcel, setExportingExcel] = useState(false);
    const printViewRef = useRef(null);


    // ================== Query String ==================
    const currentPage = Number(router.query.page) || 1; // Default to page 1
    const limit = Number(router.query.limit) || 10; // Default limit
    const { queryString, updateQuery } = useQueryString({ page: currentPage, limit, type: "storeIn" });


    // ================== Handlers for Pagination ==================
    const handlePageChange = (newPage) => {
        updateQuery("page", newPage);
    };

    const handlePerRowsChange = (rowsPerPage) => {
        updateQuery({ page: 1, limit: rowsPerPage });
    };

    // ================== Fetch Data ==================
    const { data = {}, isLoading, mutate } = useApi(`/transactions?${queryString}`);
    const { transactions: tableData = [], totalTransactions } = data;
    // ================== Delete Logic ==================
    const [showDeleteModal, setShowDeleteModal] = useState({
        loading: false,
        isOpen: false,
        id: null
    });


    const { executeMutation } = useApiMutation(`/transactions`);

    const closeDeleteModal = () => {
        setShowDeleteModal({});
    };

    const handleDelete = async () => {
        setShowDeleteModal((prev) => ({ ...prev, loading: true }));
        try {
            await executeMutation("DELETE", { id: showDeleteModal.id });
            mutate();
            closeDeleteModal();
        } catch (error) {
            handleMessage(error);
        } finally {
            setShowDeleteModal((prev) => ({ ...prev, loading: false }));
        }
    };

    // ================== Table Columns ==================
    const columns = useMemo(
        () => [
            {
                name: t("product_name_key"), // Translate key for product name
                selector: (row) => row?.product?.name, // Access product name
                sortable: true
            },
            {
                name: t("quantity_key"), // Translate key for quantity
                selector: (row) => row?.quantity, // Access quantity
                sortable: true
            },
            {
                name: t("created_by_key"),
                selector: (row) => row?.createdBy?.username,
                sortable: true
            },
            {
                name: t("updated_by_key"),
                selector: (row) => row?.lastUpdatedBy?.username,
                sortable: true
            },
            {
                name: t("created_at_key"), // Translate key for createdAt
                selector: (row) => row?.createdAt, // Access createdAt field
                cell: (row) => moment(row?.createdAt).format(date_format), // Format the date
                sortable: true
            },
            {
                name: t("description_key"), // Translate key for description
                selector: (row) => row?.description, // Access description
                sortable: true
            },
            {
                name: t("actions_key"), // Translate key for actions
                selector: (row) => row?.id,
                noExport: true,
                noPrint: true,
                cell: (row) => (
                    <div className="flex gap-2">
                        <Button
                            onClick={() => router.push(`/store/purchase/add-update?id=${row?.id}`)}
                            className="px-3 py-2 cursor-pointer btn--primary"
                        >
                            <PencilSquareIcon width={22} />
                        </Button>
                        {/* <Button
                            onClick={() =>
                                setShowDeleteModal({ isOpen: true, id: row?.id })
                            }
                            className="px-3 py-2 text-white bg-red-500 cursor-pointer hover:bg-red-600"
                        >
                            <TrashIcon width={22} />
                        </Button> */}
                    </div>
                ),
                sortable: false
            }
        ],
        [date_format, router, t]
    );


    // ================== Export Functions ==================
    const handleExportExcel = async () => {
        setExportingExcel(true);
        await exportExcel(tableData, columns, t("purchase_key"), handleMessage);
        setTimeout(() => {
            setExportingExcel(false);
        }, 1000);
    };

    const exportPDF = useCallback(() => {
        if (printViewRef.current) {
            printViewRef.current.print();
        }
    }, [printViewRef.current]);

    return (
        <>
            <div className="min-h-full bg-gray-100 rounded-md dark:bg-gray-700">
                <Header
                    title={t("purchase_key")}
                    path="/store/purchase"
                    classes="bg-gray-100 dark:bg-gray-700 border-none"
                />
                <MinimizedBox>
                    <Filter />
                </MinimizedBox>
                <ServerTable
                    columns={columns}
                    data={tableData || []}
                    handlePageChange={handlePageChange}
                    handlePerRowsChange={handlePerRowsChange}
                    progressPending={isLoading}
                    paginationTotalRows={totalTransactions}
                    paginationPerPage={limit} // Use limit from router query
                    paginationDefaultPage={currentPage} // Use currentPage from router query
                    actions={
                        <Actions
                            addMsg={t("add_key")}
                            onClickAdd={() => router.push("/store/purchase/add-update")}
                            onClickPrint={exportPDF}
                            isDisabledPrint={!tableData?.length}
                            onClickExport={handleExportExcel}
                            isDisabledExport={exportingExcel || !tableData?.length}
                        />
                    }
                />
            </div>
            {tableData?.length && <PrintView
                title={t("purchase_key")}
                ref={printViewRef}
                data={tableData}
                columns={columns}
            />}

            {showDeleteModal?.isOpen && (
                <Modal
                    title={t("delete_key")}
                    show={showDeleteModal?.isOpen}
                    footer={false}
                    onClose={closeDeleteModal}
                >
                    <DeleteModal
                        showDeleteModal={showDeleteModal}
                        handleClose={closeDeleteModal}
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
    const session = await getSession({ req });

    if (!session) {
        const loginUrl = locale === "en" ? `/${locale}/login` : "/login";
        return {
            redirect: {
                destination: `${loginUrl}?returnTo=${encodeURIComponent(resolvedUrl || "/")}`,
                permanent: false
            }
        };
    } else {
        return {
            props: {
                session,
                ...(await serverSideTranslations(locale, ["common"]))
            }
        };
    }
};
