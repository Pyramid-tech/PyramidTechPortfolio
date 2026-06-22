'use client';

import { FC } from 'react';

import { INPUT_FIELDS, RADIO_FIELDS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useBookForm } from '@/hooks/use-book-form';

import Button from '@/components/ui/button';
import Textarea from '@/components/ui/textarea';

import RadioFieldGroup from './radio-field-group';
import TextField from './text-field';

// Fields that should span the full width of the two-column grid.
const FIELD_SPANS: Record<string, string> = {
  websiteUrl: 'sm:col-span-2',
};

const SectionTitle: FC<{ children: string }> = ({ children }) => (
  <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{children}</h2>
);

const BookForm: FC = () => {
  const { setValue, submitting, feedback, handleSubmit, resetKey, goHome } = useBookForm();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <button
          type="button"
          aria-label="Back to home"
          onClick={goHome}
          className="group flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-stroke text-text-1/70 transition hover:border-primary hover:text-primary"
        >
          <svg className="h-5 w-5 fill-current" focusable="false" viewBox="0 0 24 24">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z" />
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold leading-tight sm:text-3xl">Request form</h1>
          <p className="mt-0.5 text-sm text-text-1/50">Tell us about your project and we&apos;ll be in touch.</p>
        </div>
      </div>

      <form key={resetKey} onSubmit={handleSubmit} className="flex flex-col gap-10 rounded-2xl border border-stroke bg-bg-2/60 p-5 sm:p-8">
        {/* Project details */}
        <section className="flex flex-col gap-4">
          <SectionTitle>Project details</SectionTitle>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {RADIO_FIELDS.map((field) => (
              <RadioFieldGroup key={field.title} field={field} onChange={(value) => setValue(field.formKey, value)} />
            ))}
          </div>
        </section>

        {/* Your details */}
        <section className="flex flex-col gap-4">
          <SectionTitle>Your details</SectionTitle>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {INPUT_FIELDS.map((field) => (
              <TextField
                key={field.label}
                field={field}
                className={FIELD_SPANS[field.name]}
                onChange={setValue}
              />
            ))}

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label htmlFor="message" className="text-sm font-medium text-text-1/80">
                Tell us about your project
              </label>
              <Textarea
                variant="marketing"
                minLength={20}
                maxLength={500}
                onChange={({ target: { name, value } }) => setValue(name, value)}
                id="message"
                name="message"
                placeholder="A few sentences about your goals, timeline, and anything else we should know…"
              />
              <p className="text-xs text-text-1/40">Minimum 20 characters.</p>
            </div>
          </div>
        </section>

        {/* Submit */}
        <div className="flex flex-col gap-4 border-t border-stroke/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Button
            title={submitting ? 'Sending…' : 'Submit request'}
            type="submit"
            disabled={submitting}
            classes="min-h-0 bg-bg-1 px-10 py-3 text-sm hover:bg-bg-1/80"
            btnClasses="self-start p-[2px] disabled:cursor-not-allowed disabled:opacity-50"
          />
          {feedback && (
            <p
              className={cn(
                'rounded-lg px-4 py-2.5 text-sm sm:text-right',
                feedback.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400',
              )}
            >
              {feedback.message}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default BookForm;
