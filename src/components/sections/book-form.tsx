'use client';
import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';

import { BOOK_FORM_DEFAULT_STATE, INPUT_FIELDS, RADIO_FIELDS } from '@/lib/constants';
import { useRateLimit } from '@/hooks/use-rate-limit';
import { submitBookingAction } from '@/lib/actions/book';

import Button from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface Feedback {
  type: 'success' | 'error';
  message: string;
}

const BookForm: FC = () => {
  const [form, setForm] = useState(BOOK_FORM_DEFAULT_STATE);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const { push } = useRouter();
  const { allowed, record } = useRateLimit({ key: 'pyramid_book_ts', max: 4, windowMs: 60_000 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!allowed()) {
      setFeedback({ type: 'error', message: 'Too many requests. Please wait a minute.' });
      return;
    }

    if (!form._service || !form._budget || !form._pages || !form._quickness) {
      setFeedback({ type: 'error', message: 'Please answer all questions before submitting.' });
      return;
    }

    record();
    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await submitBookingAction({
        service: form._service,
        budget: form._budget,
        pages: form._pages,
        quickness: form._quickness,
        name: form.first,
        phone: form.phone,
        email: form.email,
        company: form.company,
        websiteUrl: form.websiteUrl || undefined,
        message: form.message || undefined,
      });
      if (res.ok) {
        setFeedback({ type: 'success', message: 'Your request was submitted! We will be in touch soon.' });
        setForm(BOOK_FORM_DEFAULT_STATE);
      } else if (res.duplicate) {
        setFeedback({ type: 'error', message: 'Your request was already received — we will be in touch soon.' });
      } else {
        setFeedback({ type: 'error', message: 'Something went wrong. Please try again.' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Something went wrong. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full px-4 md:px-8 xl:px-[4vw] xl:max-w-[85vw] 2xl:max-w-[70vw]">

      {/* Header */}
      <div className="relative mb-8 xl:mb-[1.75vw] 2xl:mb-[2.25vw]">
        <button
          className="group absolute left-0 top-1/2 z-10 -translate-y-1/2 box-content rounded-full bg-stone-800 p-2 hover:bg-stone-800 xl:p-[0.5vw]"
          onClick={() => push('/')}
        >
          <svg
            focusable="false"
            className="h-5 w-5 fill-stone-400 transition group-hover:fill-stone-300 xl:h-[1.5vw] xl:w-[1.5vw] 2xl:h-[2.25vw] 2xl:w-[2.25vw]"
            viewBox="0 0 24 24"
          >
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z" />
          </svg>
        </button>
        <h1 className="text-center text-3xl font-bold leading-[100%] md:text-4xl lg:text-5xl xl:text-[3.5vw] 2xl:text-[4.6vw]">
          Request form
        </h1>
      </div>

      <form className="flex h-full flex-col items-center" onSubmit={handleSubmit}>
        <div className="w-full">

          {/* Radio groups */}
          <div className="mb-8 flex flex-col gap-8 md:flex-row md:flex-wrap md:gap-0 xl:mb-0">
            {RADIO_FIELDS.map((item) => (
              <RadioGroup
                onValueChange={(value) => setForm((prev) => ({ ...prev, [item.formKey]: value }))}
                key={item.title}
                className={`w-full md:w-[calc(50%-1.75vw)] xl:mb-[1.75vw] xl:inline-block ${item.classes}`}
                required={true}
              >
                <h4 className="mb-3 text-lg font-medium md:mb-2 xl:mb-[0.2vw] xl:text-[1.3vw] 2xl:mb-[0.5vw] 2xl:text-[1.6vw]">
                  {item.title}{item.required && <span className="ml-1 text-red-400">*</span>}
                </h4>
                {item.radioArray.map((radio) => (
                  <div
                    key={radio.value}
                    className="flex items-center gap-2.5 py-1 xl:py-0 xl:space-x-[0.65vw] 2xl:space-x-[1vw]"
                  >
                    <RadioGroupItem value={radio.value} id={radio.name} required={true} />
                    <label htmlFor={radio.name} className="cursor-pointer text-base md:text-sm lg:text-base xl:text-[1vw] xl:leading-[1.75vw] 2xl:text-[1.25vw]">
                      {radio.name}
                    </label>
                  </div>
                ))}
              </RadioGroup>
            ))}
          </div>

          {/* Text inputs */}
          <div className="w-full space-y-5 xl:space-y-[2vw]">
            {INPUT_FIELDS.map((item) => (
              <div key={item.label} className={`w-full ${item.classes}`}>
                <label
                  htmlFor={item.label}
                  className="mb-1.5 inline-block text-base xl:mb-[0.4vw] xl:text-[1.2vw] 2xl:text-[1.5vw]"
                >
                  {item.label}{item.required && <span className="ml-1 text-red-400">*</span>}
                </label>
                <input
                  onChange={({ target: { name, value } }) => setForm((prev) => ({ ...prev, [name]: value }))}
                  type={item.type || 'text'}
                  name={item.name}
                  id={item.label}
                  className="h-12 w-full appearance-none rounded-md border border-primary/80 bg-transparent px-4 py-3 text-base xl:h-[3vw] xl:rounded-[0.25vw] xl:border-[0.125vw] xl:px-[1vw] xl:py-[0.8vw] xl:text-[1vw] 2xl:h-[4vw]"
                  required={item.required}
                />
              </div>
            ))}

            <div className="w-full">
              <label
                className="mb-1.5 inline-block text-base xl:mb-[0.4vw] xl:text-[1.2vw] 2xl:text-[1.5vw]"
                htmlFor="message"
              >
                Tell us about your project
              </label>
              <textarea
                minLength={20}
                maxLength={500}
                onChange={({ target: { name, value } }) => setForm((prev) => ({ ...prev, [name]: value }))}
                id="message"
                name="message"
                className="min-h-[150px] w-full resize-none rounded-md border border-primary/80 bg-transparent px-4 py-3 text-base xl:min-h-[10vw] xl:rounded-[0.125vw] xl:border-[0.125vw] xl:px-[0.8vw] xl:py-[0.6vw] xl:text-[1.2vw] 2xl:text-[1.5vw]"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="mt-8 flex flex-col items-start gap-3 xl:mt-0 xl:gap-[1vw]">
            <Button
              title={submitting ? 'Sending…' : 'Submit'}
              type="submit"
              disabled={submitting}
              classes="py-3.5 px-12 text-base bg-bg-1/90 hover:bg-bg-1/80 xl:py-[1.2vw] xl:px-[5vw] xl:text-[1.1vw] 2xl:py-[1.6vw] 2xl:px-[8vw] 2xl:text-[1.5vw]"
              btnClasses="p-0.5 capitalize self-start mt-8 xl:mt-[2.5vw] xl:p-[0.2vw] 2xl:p-[0.25vw] disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {feedback && (
              <p className={`text-sm md:text-base ${feedback.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                {feedback.message}
              </p>
            )}
          </div>

        </div>
      </form>
    </div>
  );
};

export default BookForm;
