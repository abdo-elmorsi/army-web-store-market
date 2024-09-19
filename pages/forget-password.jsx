import React, { useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

// Custom
import { useHandleMessage, useInput } from "hooks";
import { Spinner, Button, Input } from "components/UI";
import Link from "next/link";
import { toast } from "react-toastify";
import API from "helper/apis";
import { MainLogo } from "components/icons";
import { getSession } from "next-auth/react";

const Index = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const handleMessage = useHandleMessage();
  const [step, setStep] = useState(router.query.step || 1);
  const email = useInput("", "email", true)
  const otp = useInput("", "", null)
  const new_pass = useInput("", "password", true)

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (step == 1) {
        const { message } = await API.forgetPassword({ email: email.value });
        toast.success(message);
        setStep(2);
      } else {
        const res = await API.changePassword({
          email: email.value,
          otp: otp.value,
          password: new_pass.value,
        });
        toast.success(res?.message)
        router.push("/login")
      }
    } catch (error) {
      handleMessage(error);
    } finally {
      setIsLoading(false);
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

        <form>
          <div className="w-80 text-start">


            <h1 className="mb-4 dark:text-white">{step == 1 ? t("forgot_password_key") : t("reset_password_key")}</h1>
            <div className="flex flex-col gap-4">
              <div className="mb-4">
                {step == 1 ? (<Input
                  name="email"
                  label={t("email_address_key")}
                  {...email.bind}
                />) : (
                  <>
                    <Input
                      name="email"
                      label={t("email_address_key")}
                      {...email.bind}
                    />
                    <Input
                      name="otp"
                      label={t("otp_key")}
                      {...otp.bind}
                    />
                    <Input
                      label={t("new_password_key")}
                      name="password"
                      {...new_pass.bind}
                    />
                  </>
                )}
              </div>
              <div className="mb-4">
                <Button type="submit" disabled={
                  (step == 1 && (!email.value || !email.isValid)) || (step == 2 && (!email.value || !email.isValid || !otp.value || !new_pass.value)) || isLoading
                } onClick={onSubmit} className="w-full btn--primary">
                  {isLoading ? (
                    <>
                      <Spinner className="w-4 h-4 mr-3 rtl:ml-3" />
                      {t("loading_key")}
                    </>
                  ) : (
                    t("continue_key")
                  )}
                </Button>
              </div>
              <p className="dark:text-white">
                <span>{t("have_an_account_key")}?</span>

                <Link href={"/login"}>
                  <span className="cursor-pointer text-primary"> {t("sign_in_key")}</span>
                </Link>
              </p>
            </div>

          </div>
        </form>
      </div>
    </div >
  );
};

export default Index;

Index.getLayout = function PageLayout(page) {
  return <>{page}</>;
};


export const getServerSideProps = async ({ req, locale }) => {
  const session = await getSession({ req: req });
  const routeUrl = locale === 'ar' ? '/' : `/${locale}/`;
  if (session) {
    return {
      redirect: {
        destination: `${routeUrl}/dashboard`,
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
