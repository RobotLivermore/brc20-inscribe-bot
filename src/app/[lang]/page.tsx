import Login from "@/components/Login";
import Navigator from "@/components/Navigator";
import initTranslations from "@/locales/initI18n";
import TranslationsProvider from "@/components/TranslationsProvider";

export default async function Home({ params: { lang } }: any) {
  const i18nNamespaces = ["common"];
  const { resources } = await initTranslations(lang, i18nNamespaces);
  return (
    <TranslationsProvider
      namespaces={i18nNamespaces}
      locale={lang}
      resources={resources}
    >
      <main className="flex min-h-screen flex-col items-center p-4 bg-gray-100 !pb-20">
        <Login />
        <Navigator />
      </main>
    </TranslationsProvider>
  );
}
