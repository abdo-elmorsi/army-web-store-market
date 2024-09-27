import { useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getSession } from "next-auth/react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import moment from "moment";

// Custom imports
import { Layout, LayoutWithSidebar } from "components/layout";
import { DeleteModal, Header } from "components/global";
import { Actions, Button, MinimizedBox, Modal } from "components/UI";
import { PrintView, Filter } from "components/pages/products";
import exportExcel from "utils/useExportExcel";
import { useHandleMessage } from "hooks";
import { useApi, useApiMutation } from "hooks/useApi";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { formatComma } from "utils/utils";
import Table from "components/Table/Table";

const Index = () => {
    const router = useRouter();
    const language = router.locale.toLowerCase();
    const date_format = language === "en" ? "DD/MM/YYYY" : "YYYY/MM/DD";
    const handleMessage = useHandleMessage();
    const { t } = useTranslation("common");
    const [exportingExcel, setExportingExcel] = useState(false);
    const printViewRef = useRef(null);


    // ================== Filter Logic ==================
    const { user: userQuery, unit: unitQuery, category: categoryQuery } = router.query;
    const queryString = useMemo(() => {
        const queryParams = {
            user: userQuery,
            category: categoryQuery,
            unit: unitQuery,
        };
        const filteredQueryParams = Object.entries(queryParams)
            .filter(([_, value]) => value)
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`);
        return filteredQueryParams.length > 0 ? filteredQueryParams.join("&") : "";
    }, [userQuery, categoryQuery, unitQuery]);

    const { data: tableData, isLoading, mutate } = useApi(`/products?${queryString}`);

    // ================== Delete Logic ==================
    const [showDeleteModal, setShowDeleteModal] = useState({
        loading: false,
        isOpen: false,
        id: null,
    });
    const { executeMutation } = useApiMutation(`/products`);

    const closeDeleteModal = () => {
        setShowDeleteModal({ isOpen: false, loading: false, id: null });
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
                name: t("name_key"),
                selector: (row) => row?.name,
                sortable: true
            },
            {
                name: t("category_key"),
                selector: (row) => row?.category?.name,
                sortable: true
            },
            // {
            //     name: t("quantity_in_store_key"),
            //     selector: (row) => row?.quantityInStore,
            //     cell: (row) => formatComma(row?.quantityInStore),
            //     sortable: true
            // },
            // {
            //     name: t("quantity_in_market_key"),
            //     selector: (row) => row?.quantityInMarket,
            //     cell: (row) => formatComma(row?.quantityInMarket),
            //     sortable: true
            // },
            {
                name: t("balance_key"),
                selector: (row) => formatComma(row?.quantityInStock),
                cell: (row) => <p className={`${row?.quantityInStock > 0 ? "text-green-500" : "text-red-500"} text-green-500`}>
                    {formatComma(row?.quantityInStock)} ({row?.unit?.name})
                </p>,
                sortable: true
            },
            {
                name: t("created_by_key"),
                selector: (row) => row?.createdBy?.username,
                sortable: true
            },
            {
                name: t("created_at_key"),
                selector: (row) => row?.createdAt,
                cell: (row) => moment(row?.createdAt).format(date_format),
                sortable: true
            },
            {
                name: t("actions_key"),
                selector: (row) => row?.id,
                noExport: true,
                cell: (row) => (
                    <div className="flex gap-2">
                        <Button
                            onClick={() => router.push(`/products/add-update?id=${row?.id}`)}
                            className="px-3 py-2 cursor-pointer btn--primary"
                        >
                            <PencilSquareIcon width={22} />
                        </Button>
                        <Button
                            onClick={() => setShowDeleteModal({ isOpen: true, id: row?.id })}
                            className="px-3 py-2 text-white bg-red-500 cursor-pointer hover:bg-red-600"
                        >
                            <TrashIcon width={22} />
                        </Button>
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
        await exportExcel(tableData, columns, t("products_key"), handleMessage);
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
                    title={t("products_key")}
                    path="/products"
                    classes="bg-gray-100 dark:bg-gray-700 border-none"
                />
                <MinimizedBox>
                    <Filter />
                </MinimizedBox>
                <Table
                    columns={columns}
                    data={tableData || []}
                    loading={isLoading}
                    actions={
                        <Actions
                            addMsg={t("add_key")}
                            onClickAdd={() => router.push("/products/add-update")}
                            onClickPrint={exportPDF}
                            isDisabledPrint={!tableData?.length}
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
    session: PropTypes.object.isRequired,
};

export const getServerSideProps = async ({ req, locale, resolvedUrl }) => {
    const session = await getSession({ req });

    if (!session) {
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
