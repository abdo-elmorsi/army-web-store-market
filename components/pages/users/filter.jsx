import { Select } from 'components/UI';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';

const Filter = ({ roleOptions }) => {
	const { t } = useTranslation("common");
	const router = useRouter();


	const handleQuery = (selectedOption) => {
		const { query } = router;
		const newQuery = { ...query };

		if (selectedOption?.value) {
			newQuery.role = selectedOption.value;
		} else {
			delete newQuery.role;
		}

		router.push({ pathname: router.pathname, query: newQuery }, undefined, { shallow: true });
	};

	const currentRole = router.query.role || null;
	const selectedOption = roleOptions.find(option => option.value === currentRole) || null;

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-10">
			<Select
				label={t("role_key")}
				options={roleOptions}
				value={selectedOption}
				onChange={handleQuery}
			/>
		</div>
	);
};

export default Filter;
