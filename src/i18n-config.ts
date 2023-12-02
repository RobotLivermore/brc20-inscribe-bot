import { NextRequest } from 'next/server';

export interface Config {
    locales: string[];
    defaultLocale: string;
    localeCookie?: string;
    localeDetector?: ((request: NextRequest, config: Config) => string) | false;
    prefixDefault?: boolean;
    basePath?: string;
}


export const i18n: Config = {
  defaultLocale: "en",
  locales: ["zh-CN", "en"],
};

export type Locale = (typeof i18n)["locales"][number];
