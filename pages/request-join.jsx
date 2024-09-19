import React, { useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

// Custom
import { useHandleMessage, useInput } from "hooks";
import { Spinner, Button, Input } from "components/UI";
import { MainLogo } from "components/icons";
import Link from "next/link";
import API from "helper/apis";
import { toast } from "react-toastify";
import { getSession } from "next-auth/react";

const Index = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [isSubmit, setIsSubmit] = useState(false);
  const handleMessage = useHandleMessage();


  const name = useInput("", "", true)
  const email = useInput("", "email", true)
  const phone_number = useInput("", "", true)

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);
    try {
      const data = {
        "user_name": name.value,
        "user_email": email.value,
        "user_phone_number": phone_number.value,
      }

      const res = await API.createRequestJoin(data);
      toast.success(res.message);
      router.push("/login")
    } catch (error) {
      handleMessage(error);
    } finally {
      setIsSubmit(false);
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

        <form onSubmit={onSubmit}>
          <div className="w-80 text-start">


            <h1 className="mb-4 dark:text-white">{t("request_join_key")}</h1>
            <div className="flex flex-col gap-4">
              <div className="mb-4">
                <Input
                  mandatory
                  label={t("name_key")}
                  {...name.bind}
                />
                <Input
                  mandatory
                  name="email"
                  label={t("email_key")}
                  {...email.bind}
                />
                <Input
                  mandatory
                  label={t("phone_number_key")}
                  {...phone_number.bind}
                />
              </div>



              <div className="mb-4">
                <Button type="submit" disabled={
                  (!name.value || !phone_number.value || !email.value || !email.isValid) || isSubmit
                } className="w-full btn--primary">
                  {isSubmit ? (
                    <>
                      <Spinner className="w-4 h-4 mr-3 rtl:ml-3" />
                      {t("loading_key")}
                    </>
                  ) : (
                    t("submit_key")
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
      </div >
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