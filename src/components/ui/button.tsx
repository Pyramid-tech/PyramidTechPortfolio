import { ButtonHTMLAttributes, DetailedHTMLProps, FC } from 'react';

import { cn } from '@/lib/utils';

interface Props extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  title: string;
  btnClasses?: string;
  classes?: string;
}

const Button: FC<Props> = ({ title, classes, btnClasses, ...props }) => {
  return (
    <button
      className={cn(
        'relative inline-flex overflow-hidden rounded-full p-0.5 text-sm uppercase focus:outline-none focus:ring-1 focus:ring-primary focus:ring-offset-1 focus:ring-offset-stroke md:text-base',
        btnClasses,
      )}
      {...props}
    >
      <span className="absolute inset-[-1000%] animate-[spin_2.5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#CCC2DC_0%,#4A4458_50%,#CCC2DC_100%)] motion-reduce:animate-none" />
      <span
        className={cn(
          'inline-flex h-full min-h-12 cursor-pointer items-center justify-center rounded-full px-6 py-3 font-medium text-white backdrop-blur-3xl transition duration-300',
          classes,
        )}
      >
        {title}
      </span>
    </button>
  );
};
export default Button;
