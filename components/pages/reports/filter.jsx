import { DatePicker, Select } from 'components/UI';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import moment from 'moment';
import { useApi } from 'hooks/useApi';
import { findSelectedOption } from 'utils/utils';
import { useMemo } from 'react';
import { useQueryString } from 'hooks';

const Filter = ({ typeOptions }) => {
	const { t } = useTranslation("common");
	const router = useRouter();
	const { updateQuery } = useQueryString();

	const { data: userOptions = [] } = useApi(`/users?forSelect=true`);
	const { data: productOptions = [] } = useApi(`/products?forSelect=true`);


	const type = router.query?.type || null;
	const createdById = router.query?.createdById || null;
	const lastUpdatedById = router.query?.lastUpdatedById || null;
	const currentProduct = router.query?.productId || null;

	const selectedTypeOption = useMemo(() => findSelectedOption(typeOptions, type), [typeOptions, type]);
	const selectedCreatedByOption = useMemo(() => findSelectedOption(userOptions, createdById), [userOptions, createdById]);
	const selectedLastUpdatedByOption = useMemo(() => findSelectedOption(userOptions, lastUpdatedById), [userOptions, lastUpdatedById]);
	const selectedProductOption = useMemo(() => findSelectedOption(productOptions, currentProduct), [productOptions, currentProduct]);

	// Set default dates
	const defaultStartDate = moment().subtract(7, 'days'); // Default start date: one week ago
	const defaultEndDate = moment(); // Default end date: today

	const selectedStartDate = useMemo(() => {
		const date = router.query?.startDate ? moment(router.query.startDate) : defaultStartDate;
		return date.isValid() ? date.toDate() : defaultStartDate.toDate();
	}, [router.query?.startDate, defaultStartDate]);

	const selectedEndDate = useMemo(() => {
		const date = router.query?.endDate ? moment(router.query.endDate) : defaultEndDate;
		return date.isValid() ? date.toDate() : defaultEndDate.toDate();
	}, [router.query?.endDate, defaultEndDate]);

	const handleDateChange = (key, date) => {
		const formattedDate = moment(date).isValid() ? moment(date).format("YYYY-MM-DD") : key == "startDate" ? defaultStartDate.format("YYYY-MM-DD") : defaultEndDate.format("YYYY-MM-DD");
		updateQuery(key, formattedDate);
	};

	return (
		<div className="grid grid-cols-1 md:grid-cols-4 gap-5 md:gap-10">
			<Select
				label={t("transaction_type_key")}
				options={typeOptions}
				value={selectedTypeOption}
				getOptionValue={(option) => option?.id}
				getOptionLabel={(option) => option?.name}
				onChange={(selected) => updateQuery("type", selected?.id)}
			/>
			<Select
				label={t("product_key")}
				options={productOptions}
				value={selectedProductOption}
				getOptionValue={(option) => option?.id}
				getOptionLabel={(option) => option?.name}
				onChange={(selected) => updateQuery("productId", selected?.id)}
			/>
			<Select
				label={t("created_by_key")}
				options={userOptions}
				value={selectedCreatedByOption}
				getOptionValue={(option) => option?.id}
				getOptionLabel={(option) => option?.username}
				onChange={(selected) => updateQuery("createdById", selected?.id)}
			/>
			<Select
				label={t("updated_by_key")}
				options={userOptions}
				value={selectedLastUpdatedByOption}
				getOptionValue={(option) => option?.id}
				getOptionLabel={(option) => option?.username}
				onChange={(selected) => updateQuery("lastUpdatedById", selected?.id)}
			/>
			<DatePicker
				label={t("from_date_key")}
				value={selectedStartDate}
				onChange={(date) => handleDateChange('startDate', date)}
				maxDate={new Date()} // Prevent selecting future dates
			/>
			<DatePicker
				label={t("to_date_key")}
				value={selectedEndDate}
				onChange={(date) => handleDateChange('endDate', date)}
				maxDate={new Date()} // Prevent selecting future dates
			/>
		</div>
	);
};

export default Filter;