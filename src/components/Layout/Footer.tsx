import { useAgent } from '@/contexts/Context';
import { useMemo } from 'react';

const Footer: React.FC = () => {
  const { agent } = useAgent();

  const agentDid = useMemo(() => agent?.agentDid.uri, [agent]);
  return (
    <div className="bg-gray-300 py-2 justify-center flex">
      <span className="text-center text-sm text-gray-500">{agentDid}</span>
    </div>
  )
}

export default Footer;