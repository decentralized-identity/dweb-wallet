import { DwnProtocolDefinition } from "@web5/agent"

const ProtocolItem: React.FC<{
  definition: DwnProtocolDefinition
}> = ({ definition }) => {

  const lockIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
  </svg>;

  const publicIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 0 1-1.652.928l-.679-.906a1.125 1.125 0 0 0-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 0 0-8.862 12.872M12.75 3.031a9 9 0 0 1 6.69 14.036m0 0-.177-.529A2.25 2.25 0 0 0 17.128 15H16.5l-.324-.324a1.453 1.453 0 0 0-2.328.377l-.036.073a1.586 1.586 0 0 1-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 0 1-5.276 3.67m0 0a9 9 0 0 1-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25" />
  </svg>

  const icon = definition.published ? publicIcon : lockIcon;
  const primaryText = definition.protocol;
  const secondaryText = definition.published ? 'Published' : 'Private';

  return <li className="flex flex-row items-center mb-2">
    <span className="h-5 w-5 mr-2">{icon}</span>
    <div className="flex flex-col">
      <span className="text-sm text-slate-700">{primaryText}</span>
      <span className="italic text-xs text-slate-400">{secondaryText}</span>
    </div>
  </li>
}

const ProtocolList: React.FC<{ definitions: DwnProtocolDefinition[] }> = ({ definitions }) => {

  return <div className="divide-y-2 divide-dotted divide-slate-300 p-4">
      <div className="text-xl text-left pl-4 mt-5">
        Configured Protocols
      </div>
      <div>
        <ul className="mt-5">
          {definitions.map((definition) => <ProtocolItem key={definition.protocol} definition={definition} />)}
        </ul>
      </div>
  </div>
}

export default ProtocolList;