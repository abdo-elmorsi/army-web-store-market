import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Select } from 'components/UI';
import { useSavedState } from 'hooks';
import { useSession } from 'next-auth/react';
import { isSuperAdmin } from 'utils/utils';
import API from 'helper/apis';

export default function TowersSearch({ tower, ...props }) {
  const { t } = useTranslation('common');
  const { data: session } = useSession();
  const is_super_admin = isSuperAdmin(session);
  const [defaultOptions, setDefaultOptions] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      await TowersSearch("", (data) => setDefaultOptions(data));
    };
    !defaultOptions?.length && fetchData();
  }, [])

  const TowersSearch = async (inputValue = "", callback) => {
    const data = await API.getAllTowers({
      search: inputValue,
      searchFields: ["name"],
      sort: "name",
      select: "name -owner",
      ...(!is_super_admin ? { filters: `owner=${session?.user?._id}` } : {}),
      page: 1,
      limit: 10
    })
    const items = data.items;
    if (!items?.length) {
      return callback([]);
    }
    return callback(
      [...items]?.map((c) => {
        return {
          value: c._id,
          label: c.name,
        };
      })
    );


  };

  return (
    <Select
      label={t('tower_key')}
      mandatory
      async={true}
      loadOptions={TowersSearch}
      isDisabled={false}
      value={tower.value}
      onChange={(value) => {
        tower.changeValue(value);
        props.fetchReport && props.fetchReport({ tower: value });
      }}
      {...props}
      defaultOptions={defaultOptions}
    />
  );
}

TowersSearch.propTypes = {
  fetchReport: PropTypes.func,
  tower: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    changeValue: PropTypes.func,
  }).isRequired,
};