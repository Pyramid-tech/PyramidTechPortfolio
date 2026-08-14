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

const Eyebrow: FC<{ children: string }> = ({ children }) => (
  <h2 className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-primary">{children}</h2>
);

const BookForm: FC = () => {
  const { setValue, submitting, feedback, handleSubmit, resetKey, goHome } = useBookForm();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
      <div className="mb-10 md:mb-14">
        <button
          type="button"
          onClick={goHome}
          className="group inline-flex min-h-11 items-center gap-2 text-sm text-text-2 transition hover:text-text-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <svg aria-hidden className="h-4 w-4 fill-current" focusable="false" viewBox="0 0 24 24">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z" />
          </svg>
          Back to home
        </button>

        <h1 className="mt-6 text-balance font-display text-4xl font-extrabold leading-none tracking-tight sm:text-5xl md:text-6xl">
          Start a project
        </h1>
        <p className="mt-5 max-w-[52ch] text-base leading-relaxed text-text-2 md:text-lg">
          Six questions and a few details. We read every request and reply within two working days with
          a first take on scope, timeline and cost.
        </p>
      </div>

      <form
        key={resetKey}
        onSubmit={handleSubmit}
        className="flex flex-col gap-10 rounded-2xl border border-stroke bg-bg-2/60 p-5 sm:p-8"
      >
        <section className="flex flex-col gap-6">
          <Eyebrow>Project details</Eyebrow>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {RADIO_FIELDS.map((field) => (
              <RadioFieldGroup key={field.title} field={field} onChange={(value) => setValue(field.formKey, value)} />
            ))}
          </div>
        </section>

        {/* Your details */}
        <section className="flex flex-col gap-4">
          <Eyebrow>Your details</Eyebrow>
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
              <label htmlFor="message" className="text-sm font-medium text-text-2">
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
              <p className="text-xs text-text-2">Minimum 20 characters.</p>
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
                feedback.type === 'success' ? 'bg-success-surface/10 text-success' : 'bg-danger-surface/10 text-danger',
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
