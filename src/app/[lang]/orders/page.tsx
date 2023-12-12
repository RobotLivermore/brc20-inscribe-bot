import Navigator from "@/components/Navigator";
import OrderList from "@/components/OrderList";
import initTranslations from "@/locales/initI18n";
import TranslationsProvider from "@/components/TranslationsProvider";

export default async function OrdersPage({ params: { lang } }: any) {
  const i18nNamespaces = ["common"];
  const { resources } = await initTranslations(lang, i18nNamespaces);
  return (
    <TranslationsProvider
      namespaces={i18nNamespaces}
      locale={lang}
      resources={resources}
    >
      <main className="flex min-h-screen flex-col items-center justify-between p-4 bg-gray-100">
        <OrderList />
        <Navigator />
      </main>
    </TranslationsProvider>
  );
}
