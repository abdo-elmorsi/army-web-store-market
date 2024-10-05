import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getSession } from "next-auth/react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";

// Custom
import { Layout, LayoutWithSidebar } from "components/layout";
import { Header } from "components/global";
import { Button, Input, Select, Spinner } from "components/UI";
import { useHandleMessage, useInput, useSelect } from "hooks";
import { useApi, useApiMutation } from "hooks/useApi";
import { getRole } from "utils/utils";

const Index = ({ session }) => {
	const router = useRouter();
	const admin = getRole(session, "admin")
	const productId = router.query.id;
	const handleMessage = useHandleMessage();


	const { t } = useTranslation("common");

	const { data: categories } = useApi(`/categories`);
	const { data: units } = useApi(`/units`);


	const { data: product, isLoading } = useApi(productId ? `/products?id=${productId}` : null);
	const { executeMutation, isMutating } = useApiMutation(`/products`);

	const name = useInput("", null);
	const description = useInput("", null);

	const category = useSelect("", 'select', null);
	const unit = useSelect("", 'select', null);

	const quantityInStore = useInput(0, 'number', true);
	const quantityInMarket = useInput(0, 'number', true);



	const onSubmit = async (e) => {
		e.preventDefault();
		const newProduct = {
			...(productId ? {
				id: productId,
				lastUpdatedBy: session.user?.id
			} : {
				createdBy: session.user?.id, // Assuming you have user ID in session
			}),
			name: name.value || null,
			description: description.value || null,
			category: category.value?.id || null,
			unit: unit.value?.id || null,

			quantityInStock: (+quantityInStore.value + +quantityInMarket.value) || 0,
			quantityInStore: +quantityInStore.value || 0,
			quantityInMarket: +quantityInMarket.value || 0,
		};

		try {
			await executeMutation(productId ? 'PUT' : "POST", newProduct);
			router.back();
		} catch (error) {
			handleMessage(error);
		}
	};

	useEffect(() => {
		if (!isLoading && product) {
			name.changeValue(product.name);
			description.changeValue(product.description);
			category.changeValue({ id: product.category?.id, name: product.category?.name });
			unit.changeValue({ id: product.unit?.id, name: product.unit?.name });

			quantityInStore.changeValue(product.quantityInStore);
			quantityInMarket.changeValue(product.quantityInMarket);

		}
	}, [isLoading]);

	return (
		<>
			<div className="min-h-full bg-gray-100 rounded-md dark:bg-gray-700">
				<Header
					title={t("products_key")}
					path="/products"
					classes="bg-gray-100 dark:bg-gray-700 border-none"
					links={[{ label: productId ? t("edit_key") : t("add_key") }]}
				/>
				<div className="p-5 rounded-2xl bg-white dark:bg-gray-800">
					{isLoading ? (
						<div className="flex justify-center items-center my-28">
							<Spinner className="h-10 w-10" />
						</div>
					) : (
						<form onSubmit={onSubmit}>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-10 min-h-80">
								<Input mandatory label={t("name_key")} {...name.bind} />
								<Input label={t("description_key")} {...description.bind} />

								<Select
									mandatory
									label={t("category_key")}
									{...category.bind}
									options={categories}
									getOptionLabel={(option) => option.name}
									getOptionValue={(option) => option.id}
								/>
								<Select
									mandatory
									label={t("unit_key")}
									{...unit.bind}
									options={units}
									getOptionLabel={(option) => option.name}
									getOptionValue={(option) => option.id}
								/>

								<Input disabled={productId && !admin} label={t("quantity_in_store_key")} {...quantityInStore.bind} />
								<Input disabled={productId && !admin} label={t("quantity_in_market_key")} {...quantityInMarket.bind} />
							</div>

							<div className="flex justify-start gap-8 items-center mt-4">
								<Button
									disabled={isMutating || !name.value || !category.value?.id || !unit.value?.id}
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
						</form>
					)}
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

export default Index;

Index.propTypes = {
	session: PropTypes.object.isRequired,
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
