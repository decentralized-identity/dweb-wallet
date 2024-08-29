import { DwnProtocolDefinition } from "@web5/agent";

export const walletDefinition: DwnProtocolDefinition = {
  published: true,
  protocol: "https://areweweb5yet.com/protocols/wallet",
  types: {
    webWallet: {
      schema: "https://areweweb5yet.com/schemas/web-wallet",
      dataFormats: ['application/json']
    }
  },
  structure: {
    webWallet: {
    }
  }
}

export const profileDefinition: DwnProtocolDefinition = {
  published: true,
  protocol: "https://areweweb5yet.com/protocols/profile",
  types: {
    name: {
      dataFormats: ['application/json']
    },
    social: {
      dataFormats: ['application/json']
    },
    messaging: {
      dataFormats: ['application/json']
    },
    phone: {
      dataFormats: ['application/json']
    },
    address: {
      dataFormats: ['application/json']
    },
    career: {
      dataFormats: ['application/json']
    },
    payment: {
      dataFormats: ['application/json']
    },
    avatar: {
      dataFormats: ['image/gif', 'image/png', 'image/jpeg']
    },
    hero: {
      dataFormats: ['image/gif', 'image/png', 'image/jpeg']
    }
  },
  structure: {
    name: {},
    social: {},
    career: {},
    avatar: {},
    hero: {},
    messaging: {},
    address: {},
    phone: {},
    payment: {}
  }
}