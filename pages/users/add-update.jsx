import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getSession } from "next-auth/react";
import PropTypes from "prop-types"
import { useRouter } from "next/router";

// Custom
import { Layout, LayoutWithSidebar } from "components/layout";
import { tenantColumns } from "components/columns";
import { ServerTable, DeleteModal, Header } from "components/global";
import { Actions, Button, FileInput, Input, MinimizedBox, Modal, Select, Spinner } from "components/UI";
import { AddUpdateModal, PrintView } from "components/pages/tenants";
import exportExcel from "utils/useExportExcel";
import { useHandleMessage, useInput, useSelect } from "hooks";
import API from "helper/apis";
import Table from "components/Table/Table";
import { useApi, useApiMutation } from "hooks/useApi";
import { EyeIcon, EyeSlashIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import moment from "moment";
import { convertImageToBase64 } from "utils/utils";


const Index = ({ session }) => {
	const router = useRouter();
	const userId = router.query.id;
	const language = router.locale.toLowerCase();
	const handleMessage = useHandleMessage();

	const { t } = useTranslation("common");

	const { data: user, isLoading } = useApi(userId ? `/users?id=${userId}` : null);
	const { executeMutation, isMutating } = useApiMutation(`/users?id=${userId}`);




	const username = useInput("", null);
	const password = useInput("", "password_optional", false);
	const role = useSelect("", "select");
	const [image, setImage] = useState("");


	const roleOptions = [
		{
			label: t("store_key"), value: "store",
		},
		{
			label: t("market_key"), value: "market",
		}
	];
	const [showPass, setShowPass] = useState(false);
	const handleShowPass = () => setShowPass(!showPass);


	const updateImage = async (e) => {
		const file = e.target?.files[0];
		if (file) {
			try {
				const base64String = await convertImageToBase64(file);
				setImage(base64String)
			} catch (error) {
				console.error("Error converting image to Base64:", error);
			}
		}

	}


	const onSubmit = async (e) => {
		e.preventDefault();
		const newUser = {
			username: username.value || null,
			password: password.value || null,
			role: role.value?.value || null,
			img: image || null,
		}

		try {
			await executeMutation(userId ? 'PUT' : "POST", newUser);
			router.push("/users")
		} catch (error) {
			handleMessage(error);
		}
	};



	useEffect(() => {
		if (!isLoading && user) {
			username.changeValue(user.username);
			role.changeValue(roleOptions.find(role => role.value == user.role));
		}

	}, [isLoading])



	return (
		<>
			<div className="min-h-full bg-gray-100 rounded-md dark:bg-gray-700">
				<Header
					title={t("users_key")}
					path="/users"
					classes="bg-gray-100 dark:bg-gray-700 border-none"
					links={[{ label: t("add_key") }]}
				/>


				<form onSubmit={onSubmit}>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-10">
						<Input
							label={t("user_name_key")}

							{...username.bind}
						/>
						<Select
							label={t("role_key")}
							options={roleOptions}
							{...role.bind}
						/>
						<Input
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
					<Button
						disabled={isMutating}
						className="btn--primary mx-auto mt-6 flex w-full items-center justify-center"
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
				</form>

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