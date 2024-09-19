import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import Button from "components/UI/Button";
import Spinner from "components/UI/Spinner";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { FileInput, Input } from "components/UI";
import PropTypes from "prop-types"
import { useHandleMessage, useInput } from "hooks";
import API from "helper/apis";
import axiosInstance from "helper/apis/axiosInstance";
import config from "config/config";
import Cookies from "js-cookie";

const EditProfileForm = () => {
  const { t } = useTranslation("common");
  const { data: session, update } = useSession()
  const handleMessage = useHandleMessage();
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState("");

  const { name, email, phone_number, _id } = session?.user || {};
  const userName = useInput(name, "");
  const userEmail = useInput(email, "email", true);
  const userPhoneNumber = useInput(phone_number, "");




  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const user = {
      "name": userName.value,
      "email": userEmail.value,
      "phone_number": userPhoneNumber.value
    }

    try {
      await API.updateTenant(user, _id);
      toast.success("Updated Successfully");
      await update({ ...session, user: { ...session.user, ...user } })
    } catch (error) {
      handleMessage(error);
    } finally {
      setIsLoading(false);
    }
  };
  const updateImage = async (file) => {
    setImage(file);

    try {
      const formData = new FormData();
      formData.append("photo", file);
      const { data } = await axiosInstance({
        url: `${config.apiGateway.API_URL_PRODUCTION}/users/update-profile-image`,
        method: "post",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${Cookies.get("user-token")}`
        }
      })
      toast.success("Updated Successfully");
      await update({ ...session, user: { ...session.user, ...data } })
    } catch (error) {
      handleMessage(error);
    } finally {
      setIsLoading(false);
    }
  };



  return (

    <form onSubmit={onSubmit} className="flex flex-col items-center justify-around gap-8 sm:m-5 lg:flex-row">
      <div className="mb-12 flex flex-col items-center justify-center">
        <FileInput
          label={
            <div className="user__image-box relative h-32 w-32 shrink-0 cursor-pointer overflow-hidden rounded-full shadow-lg outline outline-1 outline-offset-4 outline-gray-400 sm:h-48 sm:w-48">
              <img
                src={
                  image
                    ? URL.createObjectURL(image)
                    : session?.user?.photo
                      ?.secure_url
                }
                className="user__image block h-full w-full scale-105 object-cover object-center transition-all duration-500"
              />
              <span className="user__edit translate-y-1/5 absolute  top-1/2 left-1/2 -translate-x-1/2 text-center text-sm text-white opacity-0 transition-all duration-500 md:text-lg">
                {t("change your image")}
              </span>
            </div>
          }
          className={"mb-8 "}
          onChange={(file) => {
            updateImage(file)
          }
          }
        />
        <p className={`text-center text-xs text-gray-500 ${image?.size / 1000 / 1000 >= 3.1 ? `text-red-500` : ""} sm:text-sm`}>
          {t("allowed *.jpeg, *.jpg, *.png, *.gif")}{" "}
          <br></br> {t("max size of 3.1 MB")}
        </p>
      </div>

      <div className="w-full lg:w-2/5">
        <Input
          label={t("userName")}
          {...userName.bind}
          className={"w-full"}
        />
        <Input
          label={t("phone number")}
          {...userPhoneNumber.bind}
          className={"w-full"}
        />
        <Input
          label={t("email")}
          {...userEmail.bind}
          className={"w-full"}
        />
        <Button
          disabled={isLoading || !userName.value || !userEmail.value || !userEmail.isValid || !userPhoneNumber.value}
          className="btn--primary mx-auto mt-6 flex w-full items-center justify-center"
          type="submit"
        >
          {isLoading ? (
            <>
              <Spinner className="mr-3 h-4 w-4 rtl:ml-3" />{" "}
              {t("loading")}
            </>
          ) : (
            t("update")
          )}
        </Button>
      </div>
    </form>

  );
};


EditProfileForm.propTypes = {
  session: PropTypes.object.isRequired
}

export default EditProfileForm;