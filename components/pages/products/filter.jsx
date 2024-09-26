import { Select } from 'components/UI';
import { useApi } from 'hooks/useApi';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';

const Filter = () => {
	const { t } = useTranslation("common");
	const router = useRouter();

	const { data: userOptions = [] } = useApi(`/users`);
	const { data: categoryOptions = [] } = useApi(`/categories`);

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

	const findSelectedOption = (options, id) => options.find(option => option._id === id) || null;

	const selectedUserOption = findSelectedOption(userOptions, currentUser);
	const selectedCategoryOption = findSelectedOption(categoryOptions, currentCategory);

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-10">
			<Select
				label={t("user_key")}
				options={userOptions}
				getOptionValue={(option) => option._id}
				getOptionLabel={(option) => option.username}
				value={selectedUserOption}
				onChange={(selected) => updateQuery('user', selected?._id)}

			/>
			<Select
				label={t("category_key")}
				options={categoryOptions}
				getOptionValue={(option) => option._id}
				getOptionLabel={(option) => option.name}
				value={selectedCategoryOption}
				onChange={(selected) => updateQuery('category', selected?._id)}

			/>
		</div>
	);
};

export default Filter;
