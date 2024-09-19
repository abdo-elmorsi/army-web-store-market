import React from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types"; // Import PropTypes

function extractAccessToken(sessionData) {
  return sessionData?.user?.token || "";
}

export default function ViewLicense({ url }) {
  const { data } = useSession();
  const { t } = useTranslation("common");
  const token = extractAccessToken(data);


  return (
    <div>
      <div className="p-5 mx-10 shadow-lg border-gray-300 rounded-md border-2">
        <Image
          src={`${url}?token=${token}`}
          width={700}
          height={400}
          loading="lazy"
          className="w-full"
          placeholder="blur"
          blurDataURL="data:image/png;base64,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" // Replace with an actual base64-encoded image
        />
      </div>

    </div>
  );
}
ViewLicense.propTypes = {
  url: PropTypes.string.isRequired,
};