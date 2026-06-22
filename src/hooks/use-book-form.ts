'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

import { BOOK_FORM_DEFAULT_STATE, BOOK_FORM_MESSAGES } from '@/lib/constants';
import { useRateLimit } from '@/hooks/use-rate-limit';
import { submitBookingAction } from '@/lib/actions/book';

export interface BookFeedback {
  type: 'success' | 'error';
  message: string;
}

// Owns the booking form's state, validation, rate limiting and submission so
// the component stays purely presentational.
export function useBookForm() {
  const [form, setForm] = useState(BOOK_FORM_DEFAULT_STATE);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<BookFeedback | null>(null);
  // Bumped on a successful submit to remount the form, clearing the uncontrolled
  // inputs/radios in sync with the state reset below.
  const [resetKey, setResetKey] = useState(0);
  const { push } = useRouter();
  const { allowed, record } = useRateLimit({ key: 'pyramid_book_ts', max: 4, windowMs: 60_000 });

  const setValue = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!allowed()) {
      setFeedback({ type: 'error', message: BOOK_FORM_MESSAGES.rateLimited });
      return;
    }

    if (!form._service || !form._budget || !form._pages || !form._quickness) {
      setFeedback({ type: 'error', message: BOOK_FORM_MESSAGES.incomplete });
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
        setFeedback({ type: 'success', message: BOOK_FORM_MESSAGES.success });
        setForm(BOOK_FORM_DEFAULT_STATE);
        setResetKey((k) => k + 1);
      } else if (res.duplicate) {
        setFeedback({ type: 'error', message: BOOK_FORM_MESSAGES.duplicate });
      } else {
        setFeedback({ type: 'error', message: BOOK_FORM_MESSAGES.error });
      }
    } catch {
      setFeedback({ type: 'error', message: BOOK_FORM_MESSAGES.error });
    } finally {
      setSubmitting(false);
    }
  };

  return { setValue, submitting, feedback, handleSubmit, resetKey, goHome: () => push('/') };
}
