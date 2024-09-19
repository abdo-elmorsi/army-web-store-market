import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";

// Custom
import { useCheckbox, useHandleMessage, useInput } from "hooks"
import { Button, Spinner, Input, Checkbox } from "components/UI";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { isSuperAdmin } from "utils/utils";
import API from "helper/apis";
import { cancelRequestWithUrl } from "helper/apis/axiosInstance";


export default function AddUpdateModal({ handleClose, id, session }) {
  const { t } = useTranslation("common");

  const is_super_admin = isSuperAdmin(session);

  const handleMessage = useHandleMessage();
  const [loading, setLoading] = useState(id);
  const [submitted, setSubmitted] = useState(false);

  const name = useInput("", "", true);
  const email = useInput("", "email", true);
  const phone_number = useInput("", "phone", true);
  const national_id = useInput("", "", true);
  const password = useInput("Password@123", "password_optional");
  const isAdmin = useCheckbox(false, "", "checkbox");


  const validation = useCallback(() => {
    return name.value && email.value && phone_number.value && national_id.value
  }, [
    name.value,
    email.value,
    phone_number.value,
    national_id.value
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    const data = {
      "name": name.value,
      "email": email.value,
      "phone_number": phone_number.value,
      ...(password.value ? { "password": password.value } : {}),
      ...(isAdmin.checked ? { "role": "admin" } : {}),
      "national_id": national_id.value,
    }
    try {
      const req = (data) => id ? API.updateTenant(data, id) : API.createTenant(data);
      await req(data);
      handleClose(true);
    } catch (error) {
      handleMessage(error);
    } finally {
      setSubmitted(false);
    }
  }

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const item = await API.getOneTenant(id);
        name.changeValue(item?.name);
        email.changeValue(item?.email);
        phone_number.changeValue(item?.phone_number);
        national_id.changeValue(item?.national_id);
        password.changeValue("");
        setLoading(false);
      } catch (error) {
        handleMessage(error);
      }
    }
    id && getData();
    return () => {
      cancelRequestWithUrl("/users")
    }
  }, [id]);


  return (
    <form onSubmit={handleSubmit}>
      <>
        {loading ? <Spinner className="w-16 mx-40" /> : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
              // mandatory
              label={t("password_key")}
              {...password.bind}
              submitted={password.value}
            />
            {is_super_admin && <Checkbox
              // mandatory
              label={t("is_admin_key")}
              {...isAdmin.bind}
            />}
          </div>

        )}

        <div className='flex items-center justify-end gap-4 pt-4 mt-20 border-t'>
          <Button
            onClick={() => handleClose()}
            className="w-32 btn--secondary"
            type="button"
          >{t("cancel_key")}</Button>
          <Button
            type="submit"
            disabled={submitted || !validation()}
            onClick={handleSubmit}
            className="w-32 btn--primary"
          >
            {submitted ? (
              <>
                <Spinner className="w-4 h-4 mr-3 rtl:ml-3" />
                {t("loading_key")}
              </>
            ) : (
              t("save_key")
            )}
          </Button>
        </div>
      </>
    </form>
  )
}
AddUpdateModal.propTypes = {
  handleClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};