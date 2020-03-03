export type EquipmentCatalogueData = {
  operatingUnit: string // kilpailukohde
  operatorId: string // liikennöitsijä
  make: string // merkki
  model: string // malli
  type: string // kalustotyyppi
  count: number // määrä
  seats: number // istuinpaikat
  equipmentSeriesQuota: number // % osuus
  emissionClass: string // Euroluokka
  noiseLevel: number // Äänitaso
  alcoholLock: boolean // Alkolukko
  extinguishingSystem: boolean // Automaattinen sammutusjärjestelmä
  usbCharging: boolean // USB latauspaikat
  slidingDoors: boolean // Liukuovet
  startStop: boolean // start/stop toiminto
  passengerClimateControl: boolean // Matkustamotilan ilmastointi
  driverClimateControl: boolean // Kuljettajatilan ilmastointi
  drivingStyleTracking: boolean // Ajotavanseurantajärjestelmä
  collisionWarningSystem: boolean // Törmäysvaroitusjärjestelmä
  surveillance: boolean // Matkustamotilan kameravalvonta
  reversingCamera: boolean // Peruutuskamera
  doorCamera: boolean // Ovikamera
  tractionControl: boolean // Ajovakausjärjestelmä
  securityAxle: boolean // Turvatelitoiminto
  extraHeater: boolean // Taukopumppu tai lisälämmitin
}
