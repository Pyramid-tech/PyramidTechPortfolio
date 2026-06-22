import { FC } from 'react';

const Footer: FC = () => {
  return (
    <footer className="flex justify-between border-t border-t-gray-800 px-[5vw] py-[1.8vw] text-[1.6vw] md:px-[2vw] md:py-[2.4vw] md:text-[2vw]">
      <div>© {new Date().getFullYear()} Pyramid.</div>
    </footer>
  );
};
export default Footer;
