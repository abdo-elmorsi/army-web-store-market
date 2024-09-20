import React, { useState } from "react";
import { getSession } from "next-auth/react";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// Custom
import { Layout, LayoutWithSidebar } from "components/layout";
import { MinimizedBox, Spinner } from "components/UI";
import { useSavedState } from "hooks";

const Index = () => {
    const { t } = useTranslation("common");
    const [loading, setLoading] = useState(false);





    const [tableData, setTableData] = useSavedState([
        {
            title: 'total_tenants_key',
            count: 0,
            desc: 'tenant_key',
            percentage: 0,
            duration: moment().startOf("month").fromNow(),
        },
        {
            title: 'total_towers_key',
            count: 0,
            desc: 'tower_key',
            percentage: 0,
            duration: moment().startOf("month").fromNow(),
        },
        {
            title: 'total_apartments_key',
            count: 0,
            desc: 'apartment_key',
            percentage: 0,
            duration: moment().startOf("month").fromNow(),
        },
    ], "easier-dashboard-count-cache");


    return (
        <div className="container mx-auto mt-4">
            <MinimizedBox>

            </MinimizedBox>

            <div className="grid grid-rows-2 gap-4 mb-8 sm:grid-cols-2 md:grid-cols-2">
                {
                    tableData.map((card, idx) => <React.Fragment key={`${card?.count}-${idx}`}>
                        <div className='p-4 bg-white rounded-lg shadow-sm dark:bg-slate-800'>
                            <div className="font-bold text-slate-600 dark:text-slate-200">{t(card?.title)}</div>
                            <div className="mt-3 text-3xl font-semibold text-primary">
                                {loading ? <Spinner className="w-5 h-5 text-primary" /> : <span>{card?.count}</span>}
                                <span className="px-2 text-sm text-slate-400 dark:text-slate-200">{t(card?.desc)}</span>
                            </div>
                            <div className="flex mt-3">
                                <span className={`p-1 text-sm ${card?.percentage < 0 ? "text-red-600 font-bold bg-red-100" : "text-green-600 font-bold bg-green-100"} rounded-md`}>

                                    {loading ? <Spinner className={`w-10 h-5 ${card?.percentage < 0 ? "text-red-600" : "text-green-600"}`} /> : <span dir="ltr">{`${card?.percentage}%`}</span>}

                                </span>

                                <span dir="ltr" className="mx-2 font-thin text-gray-300">{card?.duration}</span>
                            </div>
                        </div>
                    </React.Fragment>)
                }
            </div>
        </div>
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

export const getServerSideProps = async ({ req, locale, resolvedUrl }) => {
    const session = await getSession({ req: req });
    // const userRole = session?.user?.role;

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