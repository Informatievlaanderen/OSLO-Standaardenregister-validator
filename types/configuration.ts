import { NavigationLink } from "./navigationLink";

export enum Usage {
  TBD = "TBD",
  RECOMMENDED = "Aanbevolen (vrijwillig)",
  MANDATORY = "mandatory",
  APPLY_OR_EXPLAIN = "Pas toe of leg uit",
}

export enum Status {
  DEVELOPMENT = "standaard-in-ontwikkeling",
  CANDIDATE = "kandidaat-standaard",
  RECOGNIZED = "erkende-standaard",
  TBD = "TBD",
}

export enum Category {
  APPLICATION_PROFILE = "Applicatieprofiel",
  VOCABULARY = "Vocabularium",
  IMPLEMENTATION_MODEL = "Implementatiemodel",
  TBD = "TBD",
}

interface Configuration {
  [key: string]: string | NavigationLink[] | Object;
  title: string;
  category: Category;
  usage: Usage;
  status: Status;
  descriptionFileName: string;
  responsibleOrganisation: NavigationLink[];
  publicationDate: string;
  specificationDocuments: NavigationLink[];
  documentation: NavigationLink[];
  reports: NavigationLink[];
  charter: Object;
  presentations: NavigationLink[];
  dateOfRegistration: string;
  dateOfAcknowledgementByWorkingGroup: string;
  dateOfAcknowledgementBySteeringCommittee: string;
  datePublicReviewStart: string;
  datePublicReviewEnd: string;
  endOfPublicationDate: string;
}

interface SanitizedConfiguration {
  title: string;
  category: boolean;
  usage: boolean;
  status: boolean;
  descriptionFileName: boolean;
  responsibleOrganisation: boolean;
  publicationDate: boolean;
  specificationDocuments: boolean;
  documentation: boolean;
  reports: boolean;
  charter: boolean;
  presentations: boolean;
  dateOfRegistration: boolean;
  dateOfAcknowledgementByWorkingGroup: boolean;
  dateOfAcknowledgementBySteeringCommittee: boolean;
  datePublicReviewStart: boolean;
  datePublicReviewEnd: boolean;
  endOfPublicationDate: boolean;
}

interface Document {
  naam: string;
  waarde: string;
}

const defaultConfiguration: Configuration = {
  title: "Geen titel gevonden",
  category: Category.TBD,
  usage: Usage.TBD,
  status: Status.TBD,
  descriptionFileName: "Geen bestandsnaam gevonden",
  responsibleOrganisation: [
    {
      name: "Geen naam gevonden",
      resourceReference: "Geen resourceReference gevonden",
      uri: "Geen uri gevonden",
      description: "Geen beschrijving gevonden",
    },
  ],
  publicationDate: "Geen publicatiedatum gevonden",
  specificationDocuments: [],
  documentation: [],
  reports: [],
  charter: {},
  presentations: [],
  dateOfRegistration: "Geen datum van aanmelding gevonden",
  dateOfAcknowledgementByWorkingGroup:
    "Geen erkenning werkgroep datastandaarden gevonden",
  dateOfAcknowledgementBySteeringCommittee:
    "Geen erkenning stuurgroep gevonden",
  datePublicReviewStart: "Geen startdatum publieke review gevonden",
  datePublicReviewEnd: "Geen einddatum publieke review gevonden",
  endOfPublicationDate: "Geen einddatum publicatie gevonden",
  _path: "",
};

export { defaultConfiguration, Configuration, SanitizedConfiguration };
