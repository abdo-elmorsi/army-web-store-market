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

const Index = ({ session }) => {
	const router = useRouter();
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

	const quantityInStock = useInput("", 'number', true);
	const storeIn = useInput("", 'number', true);
	const storeOut = useInput("", 'number', true);
	const marketIn = useInput("", 'number', true);
	const marketOut = useInput("", 'number', true);


	const onSubmit = async (e) => {
		e.preventDefault();
		const newProduct = {
			...(productId ? {
				id: productId,
				lastUpdatedBy: session.user?._id
			} : {
				createdBy: session.user?._id, // Assuming you have user ID in session
			}),
			name: name.value || null,
			description: description.value || null,
			category: category.value?._id || null,
			unit: unit.value?._id || null,

			quantityInStock: quantityInStock.value || null,
			storeIn: storeIn.value || null,
			storeOut: storeOut.value || null,
			marketIn: marketIn.value || null,
			marketOut: marketOut.value || null,
		};

		try {
			await executeMutation(productId ? 'PUT' : "POST", newProduct);
			router.push("/products");
		} catch (error) {
			handleMessage(error);
		}
	};

	useEffect(() => {
		if (!isLoading && product) {
			name.changeValue(product.name);
			description.changeValue(product.description);
			category.changeValue({ _id: product.category?._id, name: product.category?.name });
			unit.changeValue({ _id: product.unit?._id, name: product.unit?.name });

			quantityInStock.changeValue(product.quantityInStock);
			storeIn.changeValue(product.storeIn);
			storeOut.changeValue(product.storeOut);
			marketIn.changeValue(product.marketIn);
			marketOut.changeValue(product.marketOut);

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
							<div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-10">
								<Input mandatory label={t("name_key")} {...name.bind} />
								<Input label={t("description_key")} {...description.bind} />

								<Select
									label={t("category_key")}
									{...category.bind}
									options={categories}
									getOptionLabel={(option) => option.name}
									getOptionValue={(option) => option._id}
								/>
								<Select
									label={t("unit_key")}
									{...unit.bind}
									options={units}
									getOptionLabel={(option) => option.name}
									getOptionValue={(option) => option._id}
								/>

								<Input label={t("quantityInStock_key")} {...quantityInStock.bind} />
								<Input label={t("storeIn_key")} {...storeIn.bind} />
								<Input label={t("storeOut_key")} {...storeOut.bind} />
								<Input label={t("marketIn_key")} {...marketIn.bind} />
								<Input label={t("marketOut_key")} {...marketOut.bind} />
							</div>

							<div className="flex justify-start gap-8 items-center mt-4">
								<Button
									disabled={isMutating || !name.value}
									className="btn--primary w-32 flex items-center justify-center"
									type="submit"
								>
									{isMutating ? (
										<>
											<Spinner className="mr-3 h-4 w-4 rtl:ml-3" /> {t("loading")}
										</>
									) : (
										t("save_key")
									)}
								</Button>
								<Button
									disabled={isMutating}
									className="btn--secondary w-32"
									onClick={() => router.push("/products")}
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
