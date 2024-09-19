import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Select } from 'components/UI';
import { useSavedState } from 'hooks';
import { useSession } from 'next-auth/react';
import API from 'helper/apis';

export default function UserSearch({ user, roleFilter = "user", label = null, ...props }) {
  const { data: session } = useSession();
  const { t } = useTranslation('common');
  const [defaultOptions, setDefaultOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      await UserSearch("", (data) => setDefaultOptions(data));
    };
    !defaultOptions?.length && fetchData();
  }, [])

  const UserSearch = async (inputValue = "", callback) => {
    const data = await API.getAllTenants({
      search: inputValue,
      searchFields: ["name"],
      sort: "name",
      select: "name role",
      filters: `role=${roleFilter},admin_id=${session?.user?._id}`,
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
      label={label || t('tenant_key')}
      mandatory={props?.mandatory || true}
      async={true}
      loadOptions={UserSearch}
      isDisabled={false}
      value={user.value}
      onChange={(value) => {
        user.changeValue(value);
      }}
      {...props}
      defaultOptions={defaultOptions}
    />
  );
}

UserSearch.propTypes = {
  roleFilter: PropTypes.string,
  label: PropTypes.string,
  user: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    changeValue: PropTypes.func,
  }).isRequired,
};