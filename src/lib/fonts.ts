import { Hanken_Grotesk, Space_Grotesk } from 'next/font/google';

// headings = font-display, body = font-sans
// (Both are Google Fonts → next/font downloads & self-hosts them at build time.)

// Body / UI font.
export const fontSans = Hanken_Grotesk({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

// Heading / display font (techy geometric grotesk).
export const fontDisplay = Space_Grotesk({ subsets: ['latin'], variable: '--font-display', display: 'swap' });

export const fontVariables = [fontSans.variable, fontDisplay.variable].join(' ');
