import { WalletIcon } from "@heroicons/react/16/solid";

const WalletsList: React.FC<{ wallets: string[] }> = ({ wallets }) => {

  return <div className="mt-10 flex flex-wrap justify-center w-full w-9/12 mx-auto text-center">
    <div className="w-full px-4 divide-y-2 divide-dotted divide-slate-300 mb-10">
      <div className="text-xl text-left pl-4">
        Available Wallets
      </div>
      <div className="pl-3">
        <ul className="mt-5">
          {wallets.map((wallet) => <li key={wallet} className="flex flex-row items-center mb-2 gap-2">
            <WalletIcon className="size-6" />
            <span className="text-sm text-slate-700">{wallet}</span>
          </li>)}
        </ul>
      </div>
    </div>
  </div>
}

export default WalletsList;