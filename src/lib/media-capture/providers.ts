import type { CaptureProvider, CaptureViewport } from '@/types/project';

import { mediaCaptureConfig } from './config';

export class CaptureError extends Error {
  constructor(
    message: string,
    readonly retryable: boolean,
  ) {
    super(message);
    this.name = 'CaptureError';
  }
}

function buildRequestUrl(target: string, viewport: CaptureViewport): string {
  const endpoint = new URL(mediaCaptureConfig.httpEndpoint);
  endpoint.searchParams.set(mediaCaptureConfig.httpUrlParam, target);
  endpoint.searchParams.set('width', String(viewport.width));
  endpoint.searchParams.set('height', String(viewport.height));
  return endpoint.toString();
}

export const httpProvider: CaptureProvider = {
  name: 'http',

  available() {
    return mediaCaptureConfig.httpEndpoint.length > 0;
  },

  async screenshot(url, viewport) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), mediaCaptureConfig.timeoutMs);

    try {
      const response = await fetch(buildRequestUrl(url, viewport), {
        signal: controller.signal,
        headers: mediaCaptureConfig.httpApiKey
          ? { Authorization: `Bearer ${mediaCaptureConfig.httpApiKey}` }
          : undefined,
      });

      if (!response.ok) {
        throw new CaptureError(
          `Capture provider responded ${response.status}`,
          response.status >= 500 || response.status === 429,
        );
      }

      const contentType = response.headers.get('content-type') ?? 'image/png';
      if (!contentType.startsWith('image/')) {
        throw new CaptureError(`Capture provider returned ${contentType}`, false);
      }

      const bytes = Buffer.from(await response.arrayBuffer());
      if (bytes.byteLength > mediaCaptureConfig.maxBytes) {
        throw new CaptureError('Capture exceeded the maximum allowed size', false);
      }

      return {
        body: bytes,
        contentType,
        extension: contentType.includes('jpeg') ? 'jpg' : contentType.split('/')[1] || 'png',
      };
    } catch (error) {
      if (error instanceof CaptureError) throw error;
      if (error instanceof Error && error.name === 'AbortError') {
        throw new CaptureError('Capture timed out', true);
      }
      throw new CaptureError(error instanceof Error ? error.message : 'Capture failed', true);
    } finally {
      clearTimeout(timer);
    }
  },
};

export const playwrightProvider: CaptureProvider = {
  name: 'playwright',

  available() {
    return mediaCaptureConfig.driver === 'playwright';
  },

  async screenshot(url, viewport) {
    let chromium: typeof import('@playwright/test').chromium;
    try {
      ({ chromium } = await import('@playwright/test'));
    } catch {
      throw new CaptureError('Playwright is not installed in this runtime', false);
    }

    const browser = await chromium.launch();
    try {
      const page = await browser.newPage({ viewport });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: mediaCaptureConfig.timeoutMs,
      });
      await page
        .waitForLoadState('load', { timeout: mediaCaptureConfig.timeoutMs })
        .catch(() => undefined);
      await page.waitForTimeout(2000);
      const body = await page.screenshot({ type: 'png' });

      if (body.byteLength > mediaCaptureConfig.maxBytes) {
        throw new CaptureError('Capture exceeded the maximum allowed size', false);
      }

      return { body, contentType: 'image/png', extension: 'png' };
    } catch (error) {
      if (error instanceof CaptureError) throw error;
      throw new CaptureError(error instanceof Error ? error.message : 'Capture failed', true);
    } finally {
      await browser.close();
    }
  },
};

export function resolveProvider(): CaptureProvider | null {
  const preferred = mediaCaptureConfig.driver === 'playwright' ? playwrightProvider : httpProvider;
  if (preferred.available()) return preferred;

  const fallback = preferred === httpProvider ? playwrightProvider : httpProvider;
  return fallback.available() ? fallback : null;
}
