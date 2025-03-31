import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import type {Props} from '@theme/PaginatorNavLink';

export default function PaginatorNavLink(props: Props): JSX.Element {
  const {permalink, title, subLabel, isNext} = props;
    {console.log(props)}
    return (
    <>
      <Link
          className={clsx(
              'pagination-nav__link',
              isNext ? 'pagination-nav__link--next' : 'pagination-nav__link--prev',
          )}
          to={permalink}>
        <div className="">{title} </div>
      </Link>
    </>
  );
}
