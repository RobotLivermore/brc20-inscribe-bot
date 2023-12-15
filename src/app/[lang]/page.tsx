import HomeView from "@/components/HomeView";
import Navigator from "@/components/Navigator";
import initTranslations from "@/locales/initI18n";
import TranslationsProvider from "@/components/TranslationsProvider";

async function getTicks() {
  const baseUrl = process.env.ALPHA_BOT_URL;

  if (!baseUrl) {
    throw new Error("ALPHA_BOT_URL not found");
  }
  const resp = await fetch(`${baseUrl}/api/brc20/ticks/list`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await resp.json();
  return data.data;
}

export default async function Home({ params: { lang } }: any) {
  const i18nNamespaces = ["common", "home"];
  const { resources } = await initTranslations(lang, i18nNamespaces);

  const ticks = await getTicks();

  return (
    <TranslationsProvider
      namespaces={i18nNamespaces}
      locale={lang}
      resources={resources}
    >
      <div className="sm:max-w-[420px] w-full relative sm:h-[800px] sm:max-h-[80vh] border-black border-0 sm:border">
        <main className="flex min-h-screen flex-col items-center p-4 !pb-20">
          <HomeView ticks={ticks} />
        </main>
        <Navigator />
      </div>
    </TranslationsProvider>
  );
}
