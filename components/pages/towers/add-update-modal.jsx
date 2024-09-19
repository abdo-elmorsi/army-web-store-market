import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";

// Custom
import { useHandleMessage, useInput, useSelect } from "hooks"
import { Button, Spinner, Input } from "components/UI";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { isSuperAdmin } from "utils/utils";
import { UserSearch } from "components/global";
import API from "helper/apis";
import { cancelRequestWithUrl } from "helper/apis/axiosInstance";


export default function AddUpdateModal({ handleClose, id, session }) {
  const { t } = useTranslation("common");
  const is_super_admin = isSuperAdmin(session);

  const handleMessage = useHandleMessage();
  const [loading, setLoading] = useState(id);
  const [submitted, setSubmitted] = useState(false);

  const name = useInput("", "");
  const address = useInput("", "");
  const number_of_floors = useInput("", "number", true);

  const owner = useSelect("", "select");


  const validation = useCallback(() => name.value && address.value && number_of_floors.value, [address.value, name.value, number_of_floors.value]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    const data = {
      "name": name.value,
      "address": address.value,
      "number_of_floors": number_of_floors.value,
      ...(owner?.value?.value ? { "owner": owner.value.value } : {})
    }
    try {
      const req = (data) => id ? API.updateTower(data, id) : API.createTower(data);
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
        const item = await API.getOneTower(id);
        name.changeValue(item?.name)
        address.changeValue(item?.address)
        number_of_floors.changeValue(item?.number_of_floors)
        item?.owner?._id && owner.changeValue({ label: item?.owner?.name, value: item?.owner?._id })
        setLoading(false);
      } catch (error) {
        handleMessage(error);
      }
    }
    id && getData();
    return () => {
      cancelRequestWithUrl("/towers")
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
              label={t("address_key")}
              {...address.bind}
            />
            <Input
              mandatory
              label={t("number_of_floors_key")}
              {...number_of_floors.bind}
            />
            {is_super_admin && <UserSearch
              label={t("owner_key")}
              roleFilter={"admin"}
              user={owner}
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