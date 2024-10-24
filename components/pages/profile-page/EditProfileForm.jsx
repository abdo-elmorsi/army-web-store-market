import { useState } from "react";
import { useTranslation } from "next-i18next";
import { useSession } from "next-auth/react";
import { FileInput, Input, Button, Spinner } from "components/UI";
import PropTypes from "prop-types"
import { useHandleMessage, useInput, useSavedState } from "hooks";
import { convertImageToBase64 } from "utils/utils";
import Image from "next/image";
import { useApiMutation } from "hooks/useApi";

const EditProfileForm = () => {
  const { t } = useTranslation("common");
  const { data: session, update } = useSession()
  const handleMessage = useHandleMessage();
  const [image, setImage] = useState("");

  const [user_image, set_user_image] = useSavedState("", 'user-image');
  const { username: user_username, phone: user_phone, id } = session?.user || {};
  const username = useInput(user_username, "");
  const phone = useInput(user_phone, "");


  const { executeMutation, isMutating } = useApiMutation(`/users`);
  const onSubmit = async (e) => {
    e.preventDefault();
    const user = {
      username: username.value,
      phone: phone.value,
    }

    try {
      await executeMutation('PUT', { id, ...user, ...(image ? { img: image } : {}) });
      image && set_user_image(image)
      handleMessage("updated_successfully_key", "success");

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
        handleMessage(error);
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
              src={image || user_image}
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
          {t("image_allowed_key")}{" "}
          <br></br> {t("max_image_size_key")}
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
          disabled={isMutating || !username.value}
          className="btn--primary mx-auto mt-6 flex w-full items-center justify-center"
          type="submit"
        >
          {isMutating ? (
            <>
              <Spinner className="mr-3 h-4 w-4 rtl:ml-3" />{" "}
              {t("loading_key")}
            </>
          ) : (
            t("save_key")
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