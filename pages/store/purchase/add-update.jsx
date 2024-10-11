import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getSession } from "next-auth/react";
import PropTypes from "prop-types"
import { useRouter } from "next/router";

// Custom
import { Layout, LayoutWithSidebar } from "components/layout";
import { Header } from "components/global";
import { Button, Input, Select, Spinner } from "components/UI";
import { useHandleMessage, useInput, useSelect } from "hooks";
import { useApi, useApiMutation } from "hooks/useApi";


const Index = ({ session }) => {
	const router = useRouter();
	const transactionId = router.query.id;
	const handleMessage = useHandleMessage();

	const { t } = useTranslation("common");

	const { data: transaction, isLoading, isValidating, mutate } = useApi(transactionId ? `/transactions?id=${transactionId}` : null);
	const { executeMutation, isMutating } = useApiMutation(`/transactions`);



	const { data: productOptions = [] } = useApi(`/products?forSelect=true`);

	const productId = useSelect("", "select", null);
	const quantity = useInput("", "number", true);
	const description = useInput("", null);

	const onSubmit = async (e) => {
		e.preventDefault();
		const newTransaction = {
			...(transactionId ? {
				id: transactionId,
				lastUpdatedById: session.user?.id
			} : {
				productId: productId.value?.id || null,
				type: "storeIn",
				createdById: session.user?.id,
			}),
			quantity: +quantity.value || 0,
			description: description.value || null,
		}

		try {
			await executeMutation(transactionId ? 'PUT' : "POST", newTransaction);
			mutate(`/transactions?id=${transactionId}`)
			router.back()
		} catch (error) {
			handleMessage(error);
		}
	};



	useEffect(() => {
		if (!isValidating && !!transaction) {
			quantity.changeValue(transaction.quantity || "");
			description.changeValue(transaction.description || "");
			productId.changeValue({ id: transaction.product?.id, name: transaction.product?.name });
		}
	}, [isValidating])



	return (
		<>
			<div className="min-h-full bg-gray-100 rounded-md dark:bg-gray-700">
				<Header
					title={t("purchase_key")}
					path="/store/purchase"
					classes="bg-gray-100 dark:bg-gray-700 border-none"
					links={[{ label: transactionId ? t("edit_key") : t("add_key") }]}
				/>
				<div className="p-5 rounded-2xl bg-white dark:bg-gray-800">
					{isLoading ? <div className="flex justify-center items-center my-28">
						<Spinner className="h-10 w-10" />
					</div>
						: <form onSubmit={onSubmit}>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-10 min-h-80">

								<Select
									mandatory
									isDisabled={transactionId}
									label={t("product_key")}
									options={productOptions}
									getOptionValue={(option) => option?.id}
									getOptionLabel={(option) => option?.name}
									{...productId.bind}
								/>

								<Input
									mandatory
									label={t("quantity_key")}
									{...quantity.bind}
								/>
								<Input
									label={t("description_key")}
									{...description.bind}
								/>
							</div>
							<div className="flex justify-start gap-8 items-center">
								<Button
									disabled={isMutating || !productId.value?.id || !+quantity.value}
									className="btn--primary w-32 flex items-center justify-center"
									type="submit"
								>
									{isMutating ? (
										<>
											<Spinner className="mr-3 h-4 w-4 rtl:ml-3" /> {t("loading_key")}
										</>
									) : (
										t("save_key")
									)}
								</Button>
								<Button
									disabled={isMutating}
									className="btn--secondary w-32"
									onClick={() => router.back()}
								>
									{t("cancel_key")}
								</Button>
							</div>
						</form>}
				</div>
			</div>
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

Index.propTypes = {
	session: PropTypes.object.isRequired
};

export const getServerSideProps = async ({ req, locale, resolvedUrl }) => {
	const session = await getSession({ req: req });
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

export default Index;