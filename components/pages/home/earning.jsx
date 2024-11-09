import { useMemo } from "react";
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Legend
} from 'recharts';
import moment from 'moment-timezone';
import { useTranslation } from "react-i18next";
import { useQueryString } from "hooks";
import { useApi } from "hooks/useApi";
import { useRouter } from "next/router";
import { formatComma, groupBy } from "utils/utils";

// Custom Tooltip Component
const CustomTooltip = ({ active, payload }) => {
	if (active && payload && payload.length) {
		const { name: earningName, value: earningValue } = payload[0]; // Accessing the first payload item (earning)

		return (
			<div className="p-2 rounded-md shadow-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200">
				<p className="font-semibold">{`المبلغ : ${formatComma(earningValue)}`}</p> {/* Displaying earning in tooltip */}
			</div>
		);
	}
	return null;
};

// Skeleton Loader Component
const SkeletonLoader = () => (
	<div className="animate-pulse flex flex-col">
		<div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-2" />
		<div className="h-40 bg-gray-300 dark:bg-gray-600 rounded mb-2" />
		<div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-2" />
	</div>
);

const Chart = ({ title, data, color, isLoading }) => (
	<div className="mb-4">
		<h3 className="font-bold text-slate-600 dark:text-slate-200 text-lg sm:text-xl md:text-2xl">{title}</h3>
		{isLoading ? (
			<SkeletonLoader />
		) : (
			<ResponsiveContainer width="100%" height={window.innerWidth < 640 ? 250 : 350}>
				<AreaChart data={data}>
					<CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
					<XAxis dataKey="date" stroke="currentColor" />
					<YAxis stroke="currentColor" />
					<Tooltip content={<CustomTooltip />} />
					<Legend />
					<Area type="monotone" dataKey="earning" stroke={color} fillOpacity={0.3} fill={color} />
				</AreaChart>
			</ResponsiveContainer>
		)}
	</div>
);

function Earning() {
	const router = useRouter();
	const { t } = useTranslation("common");

	const startDate = router.query.startDate || moment().subtract(1, "month").format("YYYY-MM-DD");
	const endDate = router.query.endDate || moment().format("YYYY-MM-DD");

	const { queryString } = useQueryString({ startDate, endDate });

	const { data, isLoading } = useApi(`/dashboard/earning?${queryString}`, {
		dedupingInterval: 10000,
	});

	const chartData = useMemo(() => groupBy(data?.map(t => {
		return {
			...t,
			...t.product,
			earning: t.quantity * t.product.price - (t.quantity / t.product.piecesNo) * t.product.wholesalePrice,
			date: moment(t.createdAt).format('YYYY-MM-DD')  // Formatting the date
		};
	}), "date", "earning") || [], [data]);


	const color = "#336a86";

	return (
		<div className="mb-8 flex gap-4 flex-col md:flex-row">
			{/* earning Chart */}
			<div className="flex-1 p-4 bg-white rounded-lg shadow-sm dark:bg-slate-800">
				<Chart
					title={t("earning_key")}
					data={chartData}
					color={color}
					isLoading={isLoading}
				/>
			</div>
		</div>
	);
}

export default Earning;
