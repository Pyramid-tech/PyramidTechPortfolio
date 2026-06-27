import { FC } from 'react';

const Footer: FC = () => {
  return (
    <footer className="flex justify-between border-t border-t-gray-800 px-6 py-6 text-sm md:px-12 md:text-base">
      <div>© {new Date().getFullYear()} Pyramid.</div>
    </footer>
  );
};
export default Footer;
