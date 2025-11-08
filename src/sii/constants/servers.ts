// Servidores SII

export const SII_SERVERS = {
  certificacion: {
    name: 'Certificación (Pruebas)',
    host: 'maullin.sii.cl',
    urls: {
      seed: 'https://maullin.sii.cl/DTEWS/CrSeed.jws?WSDL',
      token: 'https://maullin.sii.cl/DTEWS/GetTokenFromSeed.jws?WSDL',
      upload: 'https://maullin.sii.cl/cgi_dte/UPL/DTEUpload',
      queryEstDte: 'https://maullin.sii.cl/DTEWS/QueryEstDte.jws?WSDL',
      queryEstUp: 'https://maullin.sii.cl/DTEWS/QueryEstUp.jws?WSDL',
      boleta: 'https://maullin.sii.cl/DTEWS/services/DteEmitidos',
      libroCV: 'https://maullin.sii.cl/DTEWS/services/RegistroReclamoDoc',
    },
  },
  produccion: {
    name: 'Producción',
    host: 'palena.sii.cl',
    urls: {
      seed: 'https://palena.sii.cl/DTEWS/CrSeed.jws?WSDL',
      token: 'https://palena.sii.cl/DTEWS/GetTokenFromSeed.jws?WSDL',
      upload: 'https://palena.sii.cl/cgi_dte/UPL/DTEUpload',
      queryEstDte: 'https://palena.sii.cl/DTEWS/QueryEstDte.jws?WSDL',
      queryEstUp: 'https://palena.sii.cl/DTEWS/QueryEstUp.jws?WSDL',
      boleta: 'https://palena.sii.cl/DTEWS/services/DteEmitidos',
      libroCV: 'https://palena.sii.cl/DTEWS/services/RegistroReclamoDoc',
    },
  },
} as const

export type Environment = keyof typeof SII_SERVERS

export function getServerUrl(
  env: Environment,
  service: keyof (typeof SII_SERVERS)['certificacion']['urls']
): string {
  return SII_SERVERS[env].urls[service]
}
