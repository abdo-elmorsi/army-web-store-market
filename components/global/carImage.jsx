import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';

function CarImage({ imageUrl, alt, className, ...props }) {
  const [error, setError] = useState(false);

  return (
    <>
      <Image
        onError={() => setError(true)}
        className={className}
        src={!error ? imageUrl : "/images/carnotfound.svg"}
        alt={alt}
        loading="lazy"
        placeholder="blur"
        blurDataURL="/images/carnotfound.svg"
        {...props}
      />
    </>
  );
}

CarImage.propTypes = {
  className: PropTypes.string,
  imageUrl: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
};

export default CarImage;
