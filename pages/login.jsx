import React, { useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getSession, signIn } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import useSWRMutation from "swr/mutation";

// Custom
import { useHandleMessage, useInput } from "hooks";
import { Spinner, Button, Input } from "components/UI";
import { MainLogo } from "components/icons";
import Link from "next/link";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import axiosInstance from "helper/apis/axiosInstance";


const loginRequest = async (url, { arg }) => {
  const res = await axiosInstance.post(url, arg);
  return res.data;
};

const Login = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const handleMessage = useHandleMessage();

  const username = useInput("", null);
  const password = useInput("", "password_optional", true);

  const [showPass, setShowPass] = useState(false);
  const handleShowPass = () => setShowPass(!showPass);


  const { trigger, isMutating } = useSWRMutation("/authentication/login", loginRequest);

  const onSubmit = async (e) => {
    e.preventDefault();

    const submitData = {
      username: username.value,
      password: password.value,
    };
    try {
      const user = await trigger(submitData);
      toast.success(user.message);

      Cookies.set('user-token', user.token, { secure: true })
      await signIn("credentials", {
        redirect: false,
        callbackUrl: "/",
        user: JSON.stringify({ ...user.user }),
      });
      router.push(router.query.returnTo || '/');
    } catch (error) {
      handleMessage(error);
    }
  };
  return (
    <div className="flex items-center justify-center h-screen dark:bg-dark dark:bg-gray-800">
      <div className="hidden bg-center bg-cover login md:block md:w-1/2">
        <div className="flex flex-col items-center justify-center h-screen">
          <MainLogo className="text-white w-52" />
        </div>
      </div>
      <div className="w-full px-4 md:w-1/2 md:px-12 xl:px-48">
        <h1 className="mb-4 text-3xl font-bold text-gray-800 dark:text-white">
          {t("sign_in_now_key")}
        </h1>
        <p className="mb-2 text-sm text-gray-500 dark:text-white">
          {t("enter_your_email_and_password_to_sign_in_key")}
        </p>

        <form onSubmit={onSubmit} className="flex flex-col">
          <div className="mb-4">
            <Input
              label={t("username_key")}
              {...username.bind}
              name="username"
            />
          </div>
          <div className="mb-2">
            <Input
              label={t("password_key")}
              name="password"
              type={showPass ? "text" : "password"}
              append={showPass ? <EyeIcon onClick={handleShowPass} className="cursor-pointer text-primary" width={"25"} /> : <EyeSlashIcon onClick={handleShowPass} className="cursor-pointer text-primary" width={"25"} />}
              {...password.bind}
            />
          </div>




          <Button
            disabled={isMutating || !username.value || !password.value}
            className="w-full mt-6 btn--primary"
            type="submit"
          >
            {isMutating ? (
              <>
                <Spinner className="w-4 h-4 mr-3 rtl:ml-3" />
                {t("loading_key")}
              </>
            ) : (
              t("sign_in_now_key")
            )}
          </Button>
          <Link href="/forget-password">
            <span className="mt-4 cursor-pointer text-primary">

              {t("forgot_password_key")}
            </span>
          </Link>
        </form>

      </div>
    </div>
  );
};

export default Login;

Login.getLayout = function PageLayout(page) {
  return <>{page}</>;
};


export const getServerSideProps = async ({ req, locale }) => {
  const session = await getSession({ req: req });
  const routeUrl = locale === 'ar' ? '/' : `/${locale}/`;
  if (session) {
    return {
      redirect: {
        destination: `${routeUrl}`,
        permanent: false,
      },
    };
  } else {
    return {
      props: {
        session,
        ...(await serverSideTranslations(locale, ['common'])),
      },
    };
  }
};