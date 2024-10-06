import moment from 'moment';

const CopyRight = () => {
  return (
    <p className="fixed text-xs pointer-events-none bottom-1 right-2 rtl:right-auto rtl:left-2 dark:text-white">
      © Copyright:{' '}
      <a
        target="_blank"
        rel="noreferrer"
        className="text-primary hover:underline"
        href="https://elmorsi.vercel.app/"
      >
        Abdo
      </a>{' '}
      {moment().format("YYYY")}
    </p>
  );
};

export default CopyRight;