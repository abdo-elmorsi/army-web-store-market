import React, { useEffect, useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

// Custom
import { useHandleMessage, useInput } from "hooks";
import { Spinner, Button, Input } from "components/UI";
import { MainLogo } from "components/icons";
import Link from "next/link";
import API from "helper/apis";
import axios from "axios";
import config from "config/config";

const Index = ({ request, error, isError }) => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [isSubmit, setIsSubmit] = useState(false);
  const handleMessage = useHandleMessage();


  const name = useInput(request?.user_name, "", true)
  const email = useInput(request?.user_email, "email", true)
  const phone_number = useInput(request?.user_phone_number, "", true)
  const national_id = useInput("", "", true)
  const password = useInput("", "password", true)

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);
    try {
      const data = {
        "name": name.value,
        "email": email.value,
        "phone_number": phone_number.value,
        "password": password.value,
        "role": "admin",
        "national_id": national_id.value,
        "completeUser": request?._id
      }

      await API.completeForm(data);
      router.push("/login")
    } catch (error) {
      handleMessage(error);
    } finally {
      setIsSubmit(false);
    }
  };


  useEffect(() => {
    if (error) {
      const convertedError = { response: { data: { message: error } } }
      handleMessage(convertedError)
    }
  }, [error])

  return (
    <div className="flex items-center justify-center h-screen dark:bg-dark dark:bg-gray-800">
      <div className="hidden bg-center bg-cover login md:block md:w-1/2">
        <div className="flex flex-col items-center justify-center h-screen">
          <MainLogo className="text-white w-52" />
        </div>
      </div>
      <div className="w-full px-4 md:w-1/2 md:px-12 xl:px-48">

        {!isError && <form onSubmit={onSubmit}>
          <div className="w-80 text-start">


            <h1 className="mb-4 dark:text-white">{t("complete_your_info_key")}</h1>
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
                <Input
                  mandatory
                  label={t("national_id_key")}
                  {...national_id.bind}
                />
                <Input
                  mandatory
                  label={t("password_key")}
                  {...password.bind}
                  submitted={password.value}
                />
              </div>



              <div className="mb-4">
                <Button type="submit" disabled={
                  (!name.value || !phone_number.value || !email.value || !email.isValid || !national_id.value || !password.value) || isSubmit
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
        </form>}
      </div >
    </div >
  );
};

export default Index;

Index.getLayout = function PageLayout(page) {
  return <>{page}</>;
};

export const getServerSideProps = async (context) => {
  const requestid = context.query?.requestid || "";
  try {
    const { data: request } = await axios.get(`${config.apiGateway?.API_URL_PRODUCTION}/request-join/${requestid}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return {
      props: {
        request,
        error: null,
        ...(await serverSideTranslations(context.locale, ["common"])),
      },
    };
  } catch ({ response }) {
    return {
      props: {
        request: {},
        error: response.data?.message,
        isError: true,
        ...(await serverSideTranslations(context.locale, ["common"])),
      },
    };
  }



};
