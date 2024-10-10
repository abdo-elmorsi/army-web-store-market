import { getSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// Custom
import { Layout, LayoutWithSidebar } from "components/layout";
import { MinimizedBox } from "components/UI";
import { Filter, Counts, SalesPurchaseCharts } from "components/pages/home";

const Index = () => {
    return (
        <div className="min-h-full bg-gray-100 rounded-md dark:bg-gray-700">
            <MinimizedBox>
                <Filter />
            </MinimizedBox>

            <Counts />
            <SalesPurchaseCharts />
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
    }

    return {
        props: {
            session,
            ...(await serverSideTranslations(locale, ["common"])),
        },
    };
};

export default Index;
