interface Configuration {
    naam: string
    rapport: string
    verantwoordelijke_organisatie: string
    identificator_organisatie: string
    publicatiedatum: string
    type_toepassing: string
    categorie: string
    beschrijving: string
    specificatiedocument: Document[]
    documentatie: Document[]
    charter: Document[]
    verslagen: Document[]
    presentaties: Document[]
    functioneel_toepassingsgebied: string
    organisatorisch_werkingsgebied: string
    datum_van_aanmelding: string
    erkenning_werkgroep_datastandaarden: string
    erkenning_stuurgroep: string
}

interface SanitizedConfiguration {
    naam: string
    rapport: string
    verantwoordelijke_organisatie: boolean
    identificator_organisatie: boolean
    publicatiedatum: boolean
    type_toepassing: boolean
    categorie: boolean
    beschrijving: boolean
    specificatiedocument: boolean
    documentatie: boolean
    charter: boolean
    verslagen: boolean
    presentaties: boolean
    functioneel_toepassingsgebied: boolean
    organisatorisch_werkingsgebied: boolean
    datum_van_aanmelding: boolean
    erkenning_werkgroep_datastandaarden: boolean
    erkenning_stuurgroep: boolean
}

interface Document {
    naam: string
    waarde: string
}

const defaultConfiguration: Configuration = {
    naam: "Geen naam gevonden",
    rapport: "Geen rapport gevonden",
    verantwoordelijke_organisatie: "Geen organisatie gevonden",
    identificator_organisatie: "Geen identificator gevonden",
    publicatiedatum: "Geen publicatiedatum gevonden",
    type_toepassing: "Geen type gevonden",
    categorie: "Geen categorie gevonden",
    beschrijving: "Geen beschrijving gevonden",
    specificatiedocument: [],
    documentatie: [],
    charter: [],
    verslagen: [],
    presentaties: [],
    functioneel_toepassingsgebied: "Geen functioneel toepassingsgebied gevonden",
    organisatorisch_werkingsgebied: "Geen organisatorisch werkingsgebied gevonden",
    datum_van_aanmelding: "Geen datum van aanmelding gevonden",
    erkenning_werkgroep_datastandaarden: "Geen erkenning werkgroep datastandaarden gevonden",
    erkenning_stuurgroep: "Geen erkenning stuurgroep gevonden"
}



export { defaultConfiguration, Configuration, SanitizedConfiguration }


