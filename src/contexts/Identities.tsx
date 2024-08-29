import { useContext } from "react";
import { IdentitiesContext } from "@/contexts/IdentitiesContext";

export const useIdentities = () => {
  const context = useContext(IdentitiesContext);
  if (!context) {
    throw new Error("useAgent must be used within a Web5Provider");
  }

  const {
    getIdentity,
    uploadAvatar,
    uploadBanner,
    createIdentity,
    deleteIdentity,
    identities,
    reloadIdentities,
    selectedIdentity,
    setSelectedIdentity,
  } = context;

  return {
    getIdentity,
    uploadAvatar,
    uploadBanner,
    createIdentity,
    deleteIdentity,
    identities,
    reloadIdentities,
    selectedIdentity,
    setSelectedIdentity,
  };
};
