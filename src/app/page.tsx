import Brc20Minter from '@/components/Brc20Minter'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 bg-gray-100">
      <Brc20Minter />
    </main>
  );
}
