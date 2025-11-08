// SII base types (SiiTypes_v10.xsd)

export type RUTType = string; // 99999999-X
export type FolioType = number; // max 10 digits
export type MontoType = number; // 18 digits, no decimals
export type ValorType = number; // 18 digits
export type Dec16_2Type = number; // 16 int + 2 dec
export type Dec14_4Type = number; // 14 int + 4 dec
export type Dec12_6Type = number; // 12 int + 6 dec
export type Dec6_4Type = number; // 6 int + 4 dec
export type PctType = number; // 3 int + 2 dec (0.01-999.99)
export type FechaType = string; // YYYY-MM-DD
export type FechaHoraType = string; // YYYY-MM-DDTHH:mm:ss
export type MailType = string; // max 80 chars
export type FonoType = string; // max 20 chars
export type ComunaType = string; // max 20 chars
export type CiudadType = string; // max 20 chars
export type RznSocType = string; // max 100 chars
export type DireccionType = string; // max 70 chars
export type GiroType = string; // max 80 chars
export type ActecoType = number; // 6 digits
export type NroResolType = number; // 6 digits
