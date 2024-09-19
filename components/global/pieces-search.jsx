import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Select } from 'components/UI';
import { useSession } from 'next-auth/react';
import { isSuperAdmin } from 'utils/utils';
import API from 'helper/apis';

export default function PiecesSearch({ piece, ...props }) {
  const { t } = useTranslation('common');
  const { data: session } = useSession();
  const is_super_admin = isSuperAdmin(session);
  const [defaultOptions, setDefaultOptions] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      await PiecesSearch("", (data) => setDefaultOptions(data));
    };
    !defaultOptions?.length && !props.isDisabled && fetchData();
  }, [])

  const PiecesSearch = async (inputValue = "", callback) => {
    const data = await API.getAllApartments({
      search: inputValue,
      searchFields: ["piece_number"],
      sort: "piece_number",
      select: "piece_number floor_number is_rented",
      ...(!is_super_admin ? { filters: `admin_id=${session?.user?._id}${props.tower_id ? `,tower=${props.tower_id}` : ""}` } : {}),
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
          label: `${c.piece_number}-${c.floor_number}`,
        };
      })
    );


  };

  return (
    <Select
      label={t('apartment_key')}
      mandatory={props.mandatory || true}
      async={true}
      loadOptions={PiecesSearch}
      value={piece.value}
      onChange={(value) => {
        piece.changeValue(value);
        props.fetchReport && props.fetchReport({ piece: value });
      }}
      {...props}
      defaultOptions={defaultOptions}
    />
  );
}

PiecesSearch.propTypes = {
  fetchReport: PropTypes.func,
  mandatory: PropTypes.bool,
  isDisabled: PropTypes.bool,
  tower_id: PropTypes.string,
  piece: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    changeValue: PropTypes.func,
  }).isRequired,
};