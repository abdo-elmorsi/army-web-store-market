import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { Button, Input, Spinner } from "components/UI";
import API from "helper/apis";
import { useHandleMessage, useInput } from "hooks";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

const ChangePassword = () => {
	const { t } = useTranslation("common");
	const [isLoading, setIsLoading] = useState(false);
	const handleMessage = useHandleMessage();

	const oldPassword = useInput("", "password_optional", false);
	const newPassword = useInput("", "password_optional", true);
	const confirmPassword = useInput("", "password_optional", true);


	const [showPass, setShowPass] = useState(false);
	const [showPassTwo, setShowPassTwo] = useState(false);
	const handleShowPass = () => setShowPass(!showPass);
	const handleShowPassTwo = () => setShowPassTwo(!showPassTwo);


	const onSubmit = async (e) => {
		e.preventDefault();
		if (newPassword.value != confirmPassword.value) {
			toast.warning("New password does not match confirm password");
			return;
		}
		setIsLoading(true);
		const data = {
			"oldPassword": oldPassword.value,
			"newPassword": newPassword.value,
		}

		try {
			const res = await API.updatePassword(data);
			toast.success(res?.message);
		} catch (error) {
			handleMessage(error);
		} finally {
			setIsLoading(false);
		}
	};



	return (

		<form onSubmit={onSubmit} className="flex flex-col items-center justify-around gap-8 sm:m-5 lg:flex-row">
			<div className="w-full lg:w-2/5">
				<Input
					label={t("old password")}
					type={showPass ? "text" : "password"}
					className={"w-full"}
					{...oldPassword.bind}
					append={showPass ? <EyeIcon onClick={handleShowPass} className="cursor-pointer text-primary" width={"25"} /> : <EyeSlashIcon onClick={handleShowPass} className="cursor-pointer text-primary" width={"25"} />}
				/>
				<Input
					label={t("new password")}
					type={showPassTwo ? "text" : "password"}
					append={showPassTwo ? <EyeIcon onClick={handleShowPassTwo} className="cursor-pointer text-primary" width={"25"} /> : <EyeSlashIcon onClick={handleShowPassTwo} className="cursor-pointer text-primary" width={"25"} />}
					className={"w-full"}
					{...newPassword.bind}
				/>
				<Input
					label={t("confirm new password")}
					type={showPassTwo ? "text" : "password"}
					append={showPassTwo ? <EyeIcon onClick={handleShowPassTwo} className="cursor-pointer text-primary" width={"25"} /> : <EyeSlashIcon onClick={handleShowPassTwo} className="cursor-pointer text-primary" width={"25"} />}
					className={"w-full"}
					{...confirmPassword.bind}
				/>
				<Button
					disabled={isLoading || !oldPassword.value || !newPassword.value || !confirmPassword.value}
					className="btn--primary mx-auto mt-6 flex w-full items-center justify-center"
					type="submit"
				>
					{isLoading ? (
						<>
							<Spinner className="mr-3 h-4 w-4 rtl:ml-3" /> {t("loading")}
						</>
					) : (
						t("update")
					)}
				</Button>
			</div>
		</form>

	);
};

export default ChangePassword;