import React, { useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getSession } from "next-auth/react";
import PropTypes from "prop-types"
import { useRouter } from "next/router";

// Custom
import { Layout, LayoutWithSidebar } from "components/layout";
import { DeleteModal, Header } from "components/global";
import { Actions, Button, MinimizedBox, Modal } from "components/UI";
import { PrintView } from "components/pages/tenants";
import exportExcel from "utils/useExportExcel";
import { useHandleMessage } from "hooks";
import API from "helper/apis";
import Table from "components/Table/Table";
import { useApi } from "hooks/useApi";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import moment from "moment";


const Index = ({ session }) => {
    const router = useRouter();
    const language = router.locale.toLowerCase();
    const date_format = language === 'en' ? 'DD/MM/YYYY' : 'YYYY/MM/DD';
    const handleMessage = useHandleMessage();

    const { t } = useTranslation("common");
    const [exportingExcel, setExportingExcel] = useState(false);
    const printViewRef = useRef(null);


    const { data: tableData, isLoading } = useApi("/users", {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,

    })


    // ================== add-update tenant ============

    // ================== delete tenant ============
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
            await API.deleteTenant(showDeleteModal?.id);
            closeDeleteModal();
            fetchReport();
        } catch (error) {
            handleMessage(error);
        } finally {
            setShowDeleteModal(prev => ({ ...prev, loading: false }))
        }
    }
    // ================== delete tenant ============


    const columns = useMemo(() => [
        {
            name: t("image_key"),
            selector: (row) => row?.img,
            cell: (row) => <Image
                width={40}
                height={40}
                className="rounded"
                src={row?.img}
            />,
            sortable: false,
        },
        {
            name: t("user_name_key"),
            selector: row => row?.username,
            sortable: true,
        },
        {
            name: t("role_key"),
            selector: row => row?.role,
            sortable: true,
        },
        {
            name: t("created_at_key"),
            selector: (row) => row?.createdAt,
            cell: (row) => moment(row?.createdAt).format(date_format),
            sortable: true,

        },
        {
            name: t("actions_key"),
            selector: row => row?._id,
            noExport: true,
            cell: (row) =>
                <div className="flex gap-2">
                    <Button onClick={() => router.push(`users/add-update?id=${row?._id}`)} className="px-3 py-2 cursor-pointer btn--primary">
                        <PencilSquareIcon width={22} />
                    </Button>
                    <Button onClick={() => setShowDeleteModal({ isOpen: true, id: row?._id })} className="px-3 py-2 text-white bg-red-500 cursor-pointer hover:bg-red-600">
                        <TrashIcon width={22} />
                    </Button>

                </div>
            ,
            sortable: false,
        }
    ], [])




    const handleExportExcel = async () => {
        setExportingExcel(true);
        await exportExcel(tableData, columns, t("users_key"), handleMessage);
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
                    title={t("users_key")}
                    path="/users"
                    classes="bg-gray-100 dark:bg-gray-700 border-none"
                />
                <MinimizedBox></MinimizedBox>
                <Table
                    columns={columns}
                    data={tableData || []}
                    searchAble={true}
                    loading={isLoading}
                    actions={
                        <Actions

                            addMsg={t("add_tenant_key")}
                            onClickAdd={() => router.push("/users/add-update")}
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

    if (!session || userRole !== "admin") {
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