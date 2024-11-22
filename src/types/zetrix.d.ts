interface Zetrix {
  authorize: (
    params: { method: string; param?: any },
    callback: (response: { code: number; data?: any; message?: string }) => void
  ) => void;

  signMessage: (
    params: { message: string },
    callback: (response: { code: number; data?: any; message?: string }) => void
  ) => void;
}

interface Window {
  zetrix: Zetrix;
}

declare module 'zetrix-connect-wallet-sdk' {
  interface ZetrixWalletConnectOptions {
    bridge: string;
    qrcode: boolean;
    callMode: string;
  }

  interface ConnectResponse {
    code: Number;
    data: {
      address: string;
    };
  }

  interface AuthResponse {
    code: Number;
    data: {
      address: string;
    };
  }

  interface SignResponse {
    code: Number;
    data: {
      address: string;
      publicKey: string;
      signData: string;
    };
    message: string;
  }

  export default class ZetrixWalletConnect {
    constructor(options: ZetrixWalletConnectOptions);
    connect(): Promise<ConnectResponse>;
    auth(): Promise<AuthResponse>;
    signBlob(message: object): Promise<SignResponse>;
  }
}