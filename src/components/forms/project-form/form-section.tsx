import { FC, ReactNode } from 'react';

interface Props {
  title: string;
  description?: string;
  children: ReactNode;
}

const FormSection: FC<Props> = ({ title, description, children }) => (
  <fieldset className="rounded-2xl border border-stroke bg-bg-2 p-4 sm:p-6">
    <legend className="px-2 font-display text-sm font-semibold uppercase tracking-widest text-primary">
      {title}
    </legend>
    {description && <p className="mb-4 mt-1 text-xs text-text-1/50">{description}</p>}
    <div className="flex flex-col gap-4">{children}</div>
  </fieldset>
);

export default FormSection;
