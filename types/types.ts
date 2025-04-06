// src/types/types.ts

export type Shuttle = {
    id: string;
    from: string;
    to: string;
    active: boolean;
  };
  
  export type Location = {
    x: number;
    y: number;
  };
  
  export type LocationMap = {
    [key: string]: Location;
  };
  
  export type FilterMap = {
    [key: string]: boolean;
  };
  
  export type RootStackParamList = {
    Login: undefined;
    ShuttleList: undefined;
    AddShuttle: undefined;
    Filter: undefined;
    ShuttleDetail: { shuttle: Shuttle };
    Map: { shuttle: Shuttle };
  };
  
  export type BluetoothDevice = {
    name: string;
    address: string;
    id?: string;
    connected?: boolean;
    [key: string]: any; // fallback for missing fields
  };
  