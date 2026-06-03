import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import type {Props} from '@theme/PaginatorNavLink';

export default function PaginatorNavLink(props: Props) {
  const {permalink, title, subLabel, isNext} = props;
    {console.log(props)}
    return (
    <>
      <Link
          className={clsx(
              'pagination-nav__link', `text-sm `,
              isNext ? 'pagination-nav__link--next' : 'pagination-nav__link--prev',
          )}
          to={permalink}>
        <div className="text-sm break-all line-clamp-2">
          {title}
        </div>
      </Link>
    </>
    );
}
