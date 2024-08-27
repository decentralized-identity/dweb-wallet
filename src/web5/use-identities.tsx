import { useContext } from "react";
import { Web5IdentitiesContext } from "./IdentitiesContext";

export const useIdentities = () => {
  const context = useContext(Web5IdentitiesContext);
  if (!context) {
    throw new Error("useAgent must be used within a Web5Provider");
  }

  const { identities, reloadIdentities } = context;

  return {
    identities, reloadIdentities
  };
};
