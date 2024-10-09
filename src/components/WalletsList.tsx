const WalletsList: React.FC<{ wallets: string[] }> = ({ wallets }) => {

  const walletIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" />
  </svg>

  return <div className="mt-10 flex flex-wrap justify-center w-full w-9/12 mx-auto text-center">
    <div className="w-full px-4 divide-y-2 divide-dotted divide-slate-300 mb-10">
      <div className="text-xl text-left pl-4">
        Available Wallets
      </div>
      <div className="pl-3">
        <ul className="mt-5">
          {wallets.map((wallet) => <li key={wallet} className="flex flex-row items-center mb-2">
            <span className="h-5 w-5 mr-2">{walletIcon}</span>
            <div className="flex flex-col">
              <span className="text-sm text-slate-700">{wallet}</span>
            </div>
          </li>)}
        </ul>
      </div>
    </div>
  </div>
}

export default WalletsList;