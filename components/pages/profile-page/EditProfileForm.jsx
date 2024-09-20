import { useState } from "react";
import { useTranslation } from "next-i18next";
import Button from "components/UI/Button";
import Spinner from "components/UI/Spinner";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { FileInput, Input } from "components/UI";
import PropTypes from "prop-types"
import { useHandleMessage, useInput } from "hooks";
import { convertImageToBase64 } from "utils/utils";
import Image from "next/image";
import { useApiMutation } from "hooks/useApi";

const EditProfileForm = () => {
  const { t } = useTranslation("common");
  const { data: session, update } = useSession()
  const handleMessage = useHandleMessage();
  const [image, setImage] = useState("");

  const { username: user_username, phone: user_phone, img: user_img, _id } = session?.user || {};
  const username = useInput(user_username, "");
  const phone = useInput(user_phone, "");




  const { executeMutation, isMutating } = useApiMutation(`/users`);

  const onSubmit = async (e) => {
    e.preventDefault();
    const user = {

      username: username.value,
      phone: phone.value,
      ...(image ? { img: image } : {})
    }

    try {
      await executeMutation('PUT', { id: _id, ...user });

      toast.success("Updated Successfully");
      await update({ ...session, user: { ...session.user, ...user } })
    } catch (error) {
      handleMessage(error);
    }
  };


  const updateImage = async (file) => {
    if (file) {
      try {
        const base64String = await convertImageToBase64(file);
        setImage(base64String)
      } catch (error) {
        console.error("Error converting image to Base64:", error);
      }
    }

  }

  return (

    <form onSubmit={onSubmit} className="flex flex-col items-center justify-around gap-8 sm:m-5 lg:flex-row">
      <div className="mb-12 flex flex-col items-center justify-center">
        <FileInput
          name={user_username}
          label={<div className="user__image-box relative h-32 w-32 shrink-0 cursor-pointer overflow-hidden rounded-full shadow-lg outline outline-1 outline-offset-4 outline-gray-400 sm:h-48 sm:w-48">
            <Image
              alt={user_username}
              src={image || user_img}
              width={200}
              height={200}
              className="user__image block h-full w-full scale-105 object-cover object-center transition-all duration-500"
            />
            <span className="user__edit translate-y-1/5 absolute  top-1/2 left-1/2 -translate-x-1/2 text-center text-sm text-white opacity-0 transition-all duration-500 md:text-lg">
              {t("change_your_image_key")}
            </span>
          </div>}
          className={"mb-8 "}
          onChange={updateImage}
        />
        <p className={`text-center text-xs text-gray-500 ${image?.size / 1000 / 1000 >= 3.1 ? `text-red-500` : ""} sm:text-sm`}>
          {t("allowed *.jpeg, *.jpg, *.png, *.gif")}{" "}
          <br></br> {t("max size of 3.1 MB")}
        </p>
      </div>

      <div className="w-full lg:w-2/5">
        <Input
          label={t("name_key")}
          {...username.bind}
          className={"w-full"}
        />
        <Input
          label={t("phone_key")}
          {...phone.bind}
          className={"w-full"}
        />
        <Button
          disabled={isMutating || !username.value || !phone.value}
          className="btn--primary mx-auto mt-6 flex w-full items-center justify-center"
          type="submit"
        >
          {isMutating ? (
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