import { ProtocolsContext } from "@/contexts/ProtocolsContext";
import { useContext } from "react";

export const useProtocols= () => {
  const context = useContext(ProtocolsContext);
  if (!context) {
    throw new Error("useProtocols must be used within a ProtocolsProvider");
  }

  const {
    addProtocol,
    listProtocols,
    loadProtocols,
  } = context;

  return {
    addProtocol,
    listProtocols,
    loadProtocols,
  };
};
