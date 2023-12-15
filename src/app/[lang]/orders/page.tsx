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
      <div className="sm:max-w-[420px] w-full relative h-[100vh] sm:h-[800px] sm:max-h-[80vh] border-black border-0 sm:border overflow-hidden">
        <div className="absolute top-0 left-0 right-0 py-2 px-4 w-full bg-white font-bold border-b border-black">
          历史订单
        </div>

        <main className="flex h-full flex-col items-center justify-between p-4 overflow-auto">
          <OrderList />
        </main>
        <Navigator />
      </div>
    </TranslationsProvider>
  );
}
