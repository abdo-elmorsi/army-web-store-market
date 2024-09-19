import { TowersSearch } from "components/global";
import { useSelect } from "hooks";
import PropTypes from "prop-types";

export default function Filter({ fetchReport }) {
  const tower = useSelect("", "select");
  return (
    <div>
      <TowersSearch tower={tower} fetchReport={fetchReport} />
    </div>
  )
}
Filter.propTypes = {
  fetchReport: PropTypes.func,
};