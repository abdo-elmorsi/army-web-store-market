import React from "react"
import Link from "next/link"
import { formatComma, formatMinus } from "utils/utils"
import { CheckCircleIcon, EyeIcon, PencilSquareIcon, TrashIcon, XCircleIcon } from "@heroicons/react/24/outline";
import moment from "moment";
import { Button } from "components/UI";
import Image from "next/image";


const tenantColumns = (t, handleUpdate, setShowDeleteModal, date_format, is_super_admin) => [
  {
    name: t("image_key"),
    selector: (row) => row?.photo?.secure_url,
    cell: (row) => <Image
      width={40}
      height={40}
      className="rounded"
      src={row?.photo?.secure_url}
    />,
    sortable: false,
    width: "100px"
  },

  {
    name: t("role_key"),
    selector: row => row?.role,
    sortable: true,
    omit: !is_super_admin,
    width: "180px"
  },
  {
    name: t("tenant_name_key"),
    selector: row => row?.name,
    sortable: true,
    width: "180px"
  },
  {
    name: t("email_key"),
    selector: (row) => row?.email,
    cell: (row) => <a className="hover:text-primary" href={`mailto:${row?.email}`} >{row?.email}</a>,
    sortable: true,
    width: "200px"
  },
  {
    name: t("phone_number_key"),
    selector: (row) => row?.phone_number,
    cell: (row) => <a className="hover:text-primary" href={`tel:+${row?.phone_number}`} dir="ltr">{row?.phone_number}</a>,
    sortable: true,
    width: "180px"
  },
  {
    name: t("national_id_key"),
    selector: row => row?.national_id,
    sortable: true,
    width: "180px"
  },
  {
    name: t("flat_key"),
    selector: (row) => row?.piece,
    getValue: (row) => row?.piece,
    cell: (row) => row?.piece ? <Link href={`/dashboard/apartments?id=${row?.piece}`}>
      <span className="font-bold cursor-pointer text-primary">
        {`${row?.piece.slice(0, 5)}...`}
      </span>
    </Link> : "",
    // selector: (row) => row?.piece?._id,
    // getValue: (row) => `${row?.piece?.floor_number}-${row?.piece?.piece_number}`,
    // cell: (row) => row?.piece?._id ? <Link href={`/dashboard/flats?id=${row?.piece?._id}`}>
    //   <span className="font-bold cursor-pointer text-primary">
    //     {`${row?.piece?.floor_number}-${row?.piece?.piece_number}`}
    //   </span>
    // </Link> : "",
    sortable: true,
    width: "160px"
  },
  {
    name: t("created_at_key"),
    selector: (row) => row?.createdAt,
    cell: (row) => moment(row?.createdAt).format(date_format),
    width: "180px",
    sortable: true,

  },
  {
    name: t("actions_key"),
    selector: row => row?._id,
    noExport: true,
    cell: (row) =>
      <div className="flex gap-2">
        <Button onClick={() => handleUpdate(row?._id)} className="px-3 py-2 cursor-pointer btn--primary">
          <PencilSquareIcon width={22} />
        </Button>
        <Button onClick={() => setShowDeleteModal({ isOpen: true, id: row?._id })} className="px-3 py-2 text-white bg-red-500 cursor-pointer hover:bg-red-600">
          <TrashIcon width={22} />
        </Button>

      </div>
    ,
    sortable: false,
    width: "180px"
  },
];
const apartmentColumns = (t, handleUpdate, setShowDeleteModal, date_format, settings) => [
  {
    name: t("number_key"),
    selector: row => row?.piece_number,
    sortable: true,
    width: "180px"
  },
  {
    name: t("floor_number_key"),
    selector: row => row?.floor_number,
    sortable: true,
    width: "180px"
  },
  {
    name: t("is_rented_key"),
    selector: row => row?.is_rented,
    cell: row => row?.is_rented ? <CheckCircleIcon color="green" width={22} /> : <XCircleIcon color="red" width={22} />,
    sortable: true,
    width: "180px",
    omit: settings?.details,
  },
  {
    name: t("rent_price_key"),
    selector: row => row?.rent_price,
    cell: row => formatComma(row?.rent_price),
    sortable: true,
    width: "180px"
  },
  {
    name: t("maintenance_price_key"),
    selector: row => row?.maintenance_price,
    cell: row => formatComma(row?.maintenance_price),
    sortable: true,
    width: "180px"
  },

  {
    name: t("tenant_key"),
    selector: (row) => row?.user?.name,
    cell: (row) => row?.user?.userId ? <Link href={`/dashboard/tenants?id=${row?.user?.userId}`}>
      <span className="font-bold cursor-pointer hover:text-primary">
        {row?.user?.name}
      </span>
    </Link> : "",
    sortable: true,
    width: "160px",
    omit: settings?.details,
  },
  {
    name: t("tower_key"),
    selector: (row) => row?.tower?.name,
    cell: (row) => row?.tower?.towerId ? <Link href={`/dashboard/towers?id=${row?.tower?.towerId}`}>
      <span className="font-bold cursor-pointer hover:text-primary">
        {row?.tower?.name}
      </span>
    </Link> : "",
    sortable: true,
    width: "160px",
    omit: settings?.details,
  },
  {
    name: t("created_at_key"),
    selector: (row) => moment(row?.created_at).format(date_format),
    width: "180px",
    sortable: true,

  },
  {
    name: t("actions_key"),
    selector: row => row?._id,
    noExport: true,
    cell: (row) =>
      <div className="flex gap-2">
        <Button onClick={() => handleUpdate(row?._id)} className="px-3 py-2 cursor-pointer btn--primary">
          <PencilSquareIcon width={22} />
        </Button>
        <Button onClick={() => setShowDeleteModal({ isOpen: true, id: row?._id })} className="px-3 py-2 text-white bg-red-500 cursor-pointer hover:bg-red-600">
          <TrashIcon width={22} />
        </Button>

      </div>
    ,
    sortable: false,
    omit: settings?.details,
    width: "180px"
  },
];
const towerColumns = (t, handleUpdate, setShowDeleteModal, showApartments, date_format, is_super_admin) => [
  {
    name: t("name_key"),
    selector: row => row?.name,
    sortable: true,
    width: "200px"
  },
  {
    name: t("address_key"),
    selector: row => row?.address,
    sortable: true,
    width: "250px"
  },
  {
    name: t("number_of_floors_key"),
    selector: row => row?.number_of_floors,
    sortable: true,
    width: "180px"
  },

  {
    name: t("owner_key"),
    selector: (row) => row?.owner?.name,
    cell: (row) => row?.owner?.userId ? <Link href={`/dashboard/tenants?id=${row?.owner?.userId}`}>
      <span className="font-bold cursor-pointer hover:text-primary">
        {row?.owner?.name}
      </span>
    </Link> : "",
    sortable: true,
    omit: !is_super_admin,
    width: "160px"
  },
  {
    name: t("apartments_key"),
    selector: (row) => row?.pieces?.length,
    cell: (row) =>
      <Button onClick={() => showApartments(row?._id)} className="flex gap-2 cursor-pointer btn--primary btn-small">
        <EyeIcon width={25} />
        <span>{row?.pieces?.length}</span>
      </Button>
    ,
    sortable: true,
    width: "160px"
  },
  {
    name: t("created_at_key"),
    selector: (row) => moment(row?.created_at).format(date_format),
    width: "180px",
    sortable: true,

  },
  {
    name: t("actions_key"),
    selector: row => row?._id,
    noExport: true,
    cell: (row) =>
      <div className="flex gap-2">
        <Button onClick={() => handleUpdate(row?._id)} className="px-3 py-2 cursor-pointer btn--primary">
          <PencilSquareIcon width={22} />
        </Button>
        <Button onClick={() => setShowDeleteModal({ isOpen: true, id: row?._id })} className="px-3 py-2 text-white bg-red-500 cursor-pointer hover:bg-red-600">
          <TrashIcon width={22} />
        </Button>

      </div>
    ,
    sortable: false,
    width: "180px"
  },
];
const rentalColumns = (t, date_format, is_super_admin) => [
  {
    name: t("tenant_name_key"),
    selector: (row) => row?.user_id?.id,
    cell: (row) => <span>{row?.user_id?.name}</span>,
    sortable: true,
    width: "160px"
  },
  {
    name: t("apartment_name_key"),
    selector: (row) => row?.piece_id?.id,
    cell: (row) => <span>{`${row?.piece_id?.piece_number}-${row?.piece_id?.floor_number}`}</span>,
    sortable: true,
    width: "160px"
  },
  {
    name: t("tower_key"),
    selector: (row) => row?.tower_id?.id,
    cell: (row) => <span>{row?.tower_id?.name}</span>,
    sortable: true,
    width: "160px"
  },
  {
    name: t("apartment_rent_price_key"),
    selector: (row) => formatComma(row?.piece_id?.rent_price),
    width: "200px",
    sortable: true,
  },
  {
    name: t("rent_price_key"),
    selector: (row) => formatComma(row.rent_price),
    width: "180px",
    sortable: true,
  },
  {
    name: t("different_key"),
    selector: (row) => formatMinus(row?.piece_id?.rent_price - row?.rent_price),
    width: "180px",
    sortable: true,
  },
  {
    name: t("rented_at_key"),
    selector: (row) => moment(row?.rented_at).format(date_format),
    width: "180px",
    sortable: true,
  },
];
const rentPaymentReportColumns = (t, viewDetails, date_format, is_super_admin) => [
  {
    name: t("apartments_key"),
    selector: (row) => row?.pieces?.length,
    cell: (row) =>
      <Button onClick={() => viewDetails(row?._id)} className="flex gap-2 cursor-pointer btn--primary btn-small">
        <EyeIcon width={25} />
        <span>{row?.pieces?.length}</span>
      </Button>
    ,
    sortable: true,
    width: "160px"
  },
  {
    name: t("created_at_key"),
    selector: (row) => moment(row?.created_at).format(date_format),
    width: "180px",
    sortable: true,

  },
  {
    name: t("actions_key"),
    selector: row => row?._id,
    noExport: true,
    cell: (row) =>
      <div className="flex gap-2">
        <Button onClick={() => viewDetails(row?._id)} className="px-3 py-2 cursor-pointer btn--primary">
          <EyeIcon width={22} />
        </Button>
        rentPaymentReportColumns
      </div>
    ,
    sortable: false,
    width: "180px"
  },
];

const requestJoinColumns = (t, handelAccept, handelReject, statusLoading, date_format) => [
  {
    name: t("name_key"),
    selector: (row) => row?.user_name,
    sortable: true,
    width: "180px"
  },
  {
    name: t("email_key"),
    selector: (row) => row?.user_email,
    sortable: true,
    width: "200px"
  },
  {
    name: t("phone_number_key"),
    selector: (row) => row?.user_phone_number,
    cell: (row) => <a className="hover:text-primary" href={`tel:+${row?.user_phone_number}`} dir="ltr">{row?.user_phone_number}</a>,
    sortable: true,
    width: "180px"
  },
  {
    name: t("created_at_key"),
    selector: (row) => moment(row?.created_at).format(date_format),
    width: "180px",
    sortable: true,

  },
  {
    name: t("actions_key"),
    selector: row => row?._id,
    noExport: true,
    cell: (row) =>
      <div className="flex gap-2">

        {(!row?.email_sent && <Button disabled={statusLoading} onClick={() => handelAccept(row?._id)} className="flex items-center justify-start gap-2 px-3 py-2 cursor-pointer w-28 btn--primary">
          <span>{t("accept_key")}</span> <CheckCircleIcon width={22} />
        </Button>)}
        <Button disabled={statusLoading} onClick={() => handelReject(row?._id)} className="flex items-center justify-start gap-2 px-3 py-2 cursor-pointer w-28 btn--secondary">
          <span>{t("reject_key")}</span>  <XCircleIcon width={22} />
        </Button>
      </div>
    ,
    sortable: false,
    width: "300px"
  },
];








export {
  tenantColumns,
  apartmentColumns,
  towerColumns,
  rentalColumns,
  rentPaymentReportColumns,
  requestJoinColumns
}
