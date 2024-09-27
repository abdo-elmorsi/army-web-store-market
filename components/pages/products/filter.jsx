import { Select } from 'components/UI';
import { useApi } from 'hooks/useApi';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';

const Filter = () => {
	const { t } = useTranslation("common");
	const router = useRouter();

	const { data: userOptions = [] } = useApi(`/users`);
	const { data: categoryOptions = [] } = useApi(`/categories`);
	const { data: unitOptions = [] } = useApi(`/units`);

	const updateQuery = (key, value) => {
		const { query } = router;
		const newQuery = { ...query };

		if (value) {
			newQuery[key] = value;
		} else {
			delete newQuery[key];
		}

		router.push({ pathname: router.pathname, query: newQuery }, undefined, { shallow: true });
	};

	const currentUser = router.query.user || null;
	const currentCategory = router.query.category || null;
	const currentUnit = router.query.unit || null;

	const findSelectedOption = (options, id) => options.find(option => option.id === id) || null;

	const selectedUserOption = findSelectedOption(userOptions, currentUser);
	const selectedCategoryOption = findSelectedOption(categoryOptions, currentCategory);
	const selectedUnitOption = findSelectedOption(unitOptions, currentUnit);

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-10">
			<Select
				label={t("created_by_key")}
				options={userOptions}
				getOptionValue={(option) => option.id}
				getOptionLabel={(option) => option.username}
				value={selectedUserOption}
				onChange={(selected) => updateQuery('user', selected?.id)}
			/>

			<Select
				label={t("category_key")}
				options={categoryOptions}
				getOptionValue={(option) => option.id}
				getOptionLabel={(option) => option.name}
				value={selectedCategoryOption}
				onChange={(selected) => updateQuery('category', selected?.id)}
			/>

			<Select
				label={t("unit_key")}
				options={unitOptions}
				getOptionValue={(option) => option.id}
				getOptionLabel={(option) => option.name}
				value={selectedUnitOption}
				onChange={(selected) => updateQuery('unit', selected?.id)}

			/>
		</div>
	);
};

export default Filter;
