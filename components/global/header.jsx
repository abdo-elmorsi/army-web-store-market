import React from 'react'
import Link from 'next/link';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Breadcrumbs } from '@material-tailwind/react';

export default function Header({ title, path, links = [], classes }) {
  const { t } = useTranslation("common");
  return (
    <div className={`border-b ${classes}`}>
      <Breadcrumbs className='bg-transparent'>
        <Link href={path} className=" opacity-60">
          <span className='text-black dark:text-white hover:text-primary dark:hover:text-primary'>{t(title)}</span>
        </Link>
        {links ? links.map((link, index) => {
          const isLastLink = (links.length - 1) == index;
          if (isLastLink) return <Link key={index} disabled href={"#"}>
            <span className='text-black dark:text-white opacity-60 '>{link.label}</span>
          </Link>
          return <Link key={index} href={link.path}>
            <span className='text-black hover:text-primary dark:hover:text-primary dark:text-white opacity-90'>{link.label}</span>
          </Link>
        }) : ""}
      </Breadcrumbs>
    </div>

  )
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string,
      label: PropTypes.string.isRequired
    })
  ),
  classes: PropTypes.string.isRequired
};