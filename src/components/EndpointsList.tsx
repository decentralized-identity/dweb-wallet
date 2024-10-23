import { ServerStackIcon } from "@heroicons/react/16/solid";

const EndpointsList: React.FC<{ endpoints: string[] }> = ({ endpoints }) => {

  return <div className="mt-10 flex flex-wrap justify-center w-full w-9/12 mx-auto text-center">
    <div className="w-full px-4 divide-y-2 divide-dotted divide-slate-300 mb-10">
      <div className="text-xl text-left pl-4">
        DWN Endpoints
      </div>
      <div className="pl-3">
        <ul className="mt-5">
          {endpoints.map((endpoint) => <li key={endpoint} className="flex items-center mb-3 gap-2">
            <ServerStackIcon className="size-6 text-primary" />
            <span className="text-sm text-slate-700">{endpoint}</span>
          </li>)}
        </ul>
      </div>
    </div>
  </div>
}

export default EndpointsList;