export type DeviceERROR = 'ERROR';
export type DeviceACK = 'ACK';
export type DeviceTIMEOUT = 'TIMEOUT';
export type DeviceGetStatus = DeviceERROR | DeviceACK | DeviceTIMEOUT;

export type DeviceUNKNOW = 'UNKNOW';
export type DeviceWAITING = 'WAITING_RESPONSE';
export type DevicePostStatus = DeviceGetStatus | DeviceUNKNOW | DeviceWAITING;

export type DeviceON = 'ON';
export type DeviceOFF = 'OFF';
export type DeviceStatus = DeviceON | DeviceOFF | DeviceUNKNOW;