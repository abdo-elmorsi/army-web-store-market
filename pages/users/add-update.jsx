import { useEffect, useMemo, useState } from "react";
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
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { convertImageToBase64 } from "utils/utils";


const Index = () => {
	const router = useRouter();
	const userId = router.query.id;
	const handleMessage = useHandleMessage();

	const { t } = useTranslation("common");

	const { data: user, isLoading, isValidating, mutate } = useApi(userId ? `/users?id=${userId}` : null);
	const { executeMutation, isMutating } = useApiMutation(`/users`);




	const username = useInput("", null);
	const password = useInput("", "password_optional", true);
	const phone = useInput("", null);
	const role = useSelect("", "select");
	const [image, setImage] = useState("");


	const roleOptions = useMemo(
		() => [
			{ label: t("store_key"), value: "store", id: "store" },
			{ label: t("market_key"), value: "market", id: "market" }
		],
		[t]
	);

	const [showPass, setShowPass] = useState(false);
	const handleShowPass = () => setShowPass(!showPass);


	const updateImage = async (e) => {
		const file = e.target?.files[0];
		if (file) {
			try {
				const base64String = await convertImageToBase64(file);
				setImage(base64String)
			} catch (error) {
				setImage("")
			}
		}

	}


	const onSubmit = async (e) => {
		e.preventDefault();
		const newUser = {
			...(userId ? { id: userId } : {}),
			username: username.value || null,
			password: password.value || null,
			phone: phone.value || null,
			role: role.value?.value || null,
			img: image || null,
		}

		try {
			await executeMutation(userId ? 'PUT' : "POST", newUser);
			mutate(`/users?id=${userId}`)
			router.back()
		} catch (error) {
			handleMessage(error);
		}
	};



	useEffect(() => {
		if (!isValidating && !!user) {
			username.changeValue(user.username || "");
			phone.changeValue(user.phone || "");
			role.changeValue(roleOptions.find(role => role.value == user.role));
		}
	}, [isValidating])



	return (
		<>
			<div className="min-h-full bg-gray-100 rounded-md dark:bg-gray-700">
				<Header
					title={t("users_key")}
					path="/users"
					classes="bg-gray-100 dark:bg-gray-700 border-none"
					links={[{ label: userId ? t("edit_key") : t("add_key") }]}
				/>
				<div className="p-5 rounded-2xl bg-white dark:bg-gray-800">
					{isLoading ? <div className="flex justify-center items-center my-28">
						<Spinner className="h-10 w-10" />
					</div>
						: <form onSubmit={onSubmit}>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-10 min-h-80">
								<Input
									mandatory
									label={t("name_key")}
									{...username.bind}
								/>
								<Input
									label={t("phone_key")}
									{...phone.bind}
								/>
								<Select
									mandatory
									label={t("role_key")}
									options={roleOptions}
									{...role.bind}
								/>
								<Input
									mandatory={!userId}
									label={t("password_key")}
									type={showPass ? "text" : "password"}

									{...password.bind}
									append={showPass ? <EyeIcon onClick={handleShowPass} className="cursor-pointer text-primary" width={"25"} /> : <EyeSlashIcon onClick={handleShowPass} className="cursor-pointer text-primary" width={"25"} />}
								/>

								<Input
									type="file"
									label={t("image_key")}
									onChange={updateImage}
								/>
							</div>
							<div className="flex justify-start gap-8 items-center">
								<Button
									disabled={isMutating || !username.value || !role.value?.value || (!userId && password.value?.length < 6)}
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

export default Index;

Index.propTypes = {
	session: PropTypes.object.isRequired
};

export const getServerSideProps = async ({ req, locale, resolvedUrl }) => {
	const session = await getSession({ req });
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