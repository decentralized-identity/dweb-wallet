import { useIdentities } from "@/contexts/Context"
import { Identity } from "@/lib/types";
import { truncateDid } from "@/lib/utils";
import { Select, Field, Fieldset, Label } from '@headlessui/react';

const IdentitySelector: React.FC<{
  value: string;
  onChange: (value: string) => void;
  [key: string]: any;
}> = ({ value, onChange, ...props }) => {
  const { identities } = useIdentities();

  const identityLabel = (identity: Identity): string => {
    const personaLabel = identity.persona ? ` (${identity.persona})` : '';

    return identity.profile.social?.displayName ? `${identity.profile.social.displayName}${personaLabel}` :
      `${truncateDid(identity.didUri)}${personaLabel}`;
  }

  return <div {...props}>
      <Fieldset>
        <Field className="w-full">
          <Label htmlFor='dwnEndpoints' className="text-sm font-medium leading-6 text-gray-900">
            Select Identity
          </Label>
          <Select
            name="identity"
            id="identity"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          >
            {identities.map(identity => <option
              key={identity.didUri} value={identity.didUri}
              selected={identity.didUri === value}
            >
            {identityLabel(identity)}
            </option>)}
          </Select>
        </Field>
      </Fieldset>
  </div>
}

export default IdentitySelector;