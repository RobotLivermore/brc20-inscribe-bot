import Brc20Minter from "@/components/Brc20Minter";
import Navigator from "@/components/Navigator";
import initTranslations from "@/locales/initI18n";
import TranslationsProvider from "@/components/TranslationsProvider";

export default async function Inscribe({ params: { lang } }: any) {
  const i18nNamespaces = ["common"];
  const { resources } = await initTranslations(lang, i18nNamespaces);
  return (
    <TranslationsProvider
      namespaces={i18nNamespaces}
      locale={lang}
      resources={resources}
    >
      <main className="flex min-h-screen flex-col items-center justify-between p-4 bg-gray-100 !pb-20">
        <Brc20Minter />
        <Navigator />
      </main>
    </TranslationsProvider>
  );
}
