import React from "react";
import { Box, Chip, Divider, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { ConnectPermissionRequest, DwnPermissionScope } from "@web5/agent";
import { Lock, Public, SyncAlt } from "@mui/icons-material";

const PermissionRequest: React.FC<{ permissions: ConnectPermissionRequest[] }> = ({ permissions }) => {
  const formatScopes = (scopes: DwnPermissionScope[]) => {
    const sync = scopes.some(scope => scope.interface === 'Messages' && scope.method === 'Read') &&
                 scopes.some(scope => scope.interface === 'Messages' && scope.method === 'Query');

    const records = scopes.filter(scope => scope.interface === 'Records').map(scope => scope.method);

    return { sync, records };
  };

  return (
    <List disablePadding>
      {permissions.map((permission, index) => {
        const { sync, records } = formatScopes(permission.permissionScopes);
        return (
          <React.Fragment key={permission.protocolDefinition.protocol}>
            <ListItem>
              <ListItemIcon>
                {permission.protocolDefinition.published ? <Public /> : <Lock />}
              </ListItemIcon>
              <Box sx={{ mb: 2 }}>
                <ListItemText
                  primary={permission.protocolDefinition.protocol}
                />
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                  {records.map((method) => (
                    <Chip key={method} label={method} size="small" />
                  ))}
                  {sync && <Chip icon={<SyncAlt />} label="Sync" size="small" />}
                </Box>
              </Box>
            </ListItem>
            {index < permissions.length - 1 && <Divider variant="inset" component="li" />}
          </React.Fragment>
        );
      })}
    </List>
  );
};

export default PermissionRequest;