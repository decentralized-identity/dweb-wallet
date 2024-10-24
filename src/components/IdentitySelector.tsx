import { useIdentities } from "@/contexts/Context"
import { Identity } from "@/lib/types";
import { truncateDid } from "@/lib/utils";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material"

const IdentitySelector: React.FC<{
  value: string;
  onChange: (value: string) => void;
  [key: string]: any;
}> = ({ value, onChange, ...props }) => {
  const { identities } = useIdentities();

  const personaLabel = (identity: Identity): string => {
    return identity.persona ? `(${identity.persona})` : '';
  }

  const identityLabel = (identity: Identity): string => {
    const personaLabel = identity.persona ? ` (${identity.persona})` : '';

    return identity.profile.social?.displayName ? `${identity.profile.social.displayName}${personaLabel}` :
      `${truncateDid(identity.didUri)}${personaLabel}`;
  }

  return <Box {...props}>
    <FormControl fullWidth>
      <InputLabel id="identity-label">Selected Identity</InputLabel>
      <Select
        labelId="identity-label"
        id="identity-select"
        value={value}
        label="Selected Identity"
        onChange={(e) => onChange(e.target.value)}
      >
        {identities.map(identity => <MenuItem
          key={identity.didUri} value={identity.didUri}
          selected={identity.didUri === value}
        >
        {identityLabel(identity)}
        </MenuItem>)}
      </Select>
    </FormControl>
  </Box>
}

export default IdentitySelector;