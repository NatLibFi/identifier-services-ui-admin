/**
 *
 * @licstart  The following is the entire license notice for the JavaScript code in this file.
 *
 * Admin UI service of Identifier Services system
 *
 * Copyright (C) 2023 University Of Helsinki (The National Library Of Finland)
 *
 * This file is part of identifier-services-ui-admin
 *
 * identifier-services-ui-admin program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * identifier-services-ui-admin is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * @licend  The above is the entire license notice
 * for the JavaScript code in this file.
 *
 */

export const PUBLICATION_TYPES = {
  BOOK: 'BOOK',
  DISSERTATION: 'DISSERTATION',
  MAP: 'MAP',
  SHEET_MUSIC: 'SHEET_MUSIC',
  OTHER: 'OTHER'
};

const ISSN_PUBLICATION_TYPES = {
  JOURNAL: 'JOURNAL',
  NEWSLETTER: 'NEWSLETTER',
  STAFFMAGAZINE: 'STAFF_MAGAZINE',
  MEMBERSHIPMAGAZINE: 'MEMBERSHIP_BASED_MAGAZINE',
  NEWSPAPER: 'NEWSPAPER',
  FREEPAPER: 'FREE_PAPER',
  MONOGRAPHY: 'MONOGRAPHY_SERIES',
  CARTOON: 'CARTOON',
  OTHER: 'OTHER_SERIAL'
};

const ISSN_PUBLICATION_FREQUENCY = {
  YEARLY: 'a',
  BIYEARLY: 'f', // i.e. twice a year
  QUARTERLY: 'q',
  BIMONTHLY: 'b', // i.e. six times a year / every two months
  MONTHLY: 'm',
  WEEKLY: 'w',
  DAILY: 'd',
  CONTINUOUSLY: 'k',
  IRREGULAR: '#',
  OTHER: 'z'
};

const ISSN_PUBLICATION_REQUEST_STATUS = {
  NOT_HANDLED: 'NOT_HANDLED',
  NOT_NOTIFIED: 'NOT_NOTIFIED',
  COMPLETED: 'COMPLETED',
  REJECTED: 'REJECTED'
};

const ISSN_PUBLICATION_STATUS = {
  NO_ISSN_GRANTED: 'NO_ISSN_GRANTED',
  NO_PREPUBLICATION_RECORD: 'NO_PREPUBLICATION_RECORD',
  ISSN_FROZEN: 'ISSN_FROZEN',
  WAITING_FOR_CONTROL_COPY: 'WAITING_FOR_CONTROL_COPY',
  COMPLETED: 'COMPLETED'
};

const FORMATS = {
  PRINT: 'PRINT',
  ELECTRONICAL: 'ELECTRONICAL',
  PRINT_ELECTRONICAL: 'PRINT_ELECTRONICAL'
};

const MEDIUM = {
  PRINT: 'PRINTED',
  ELECTRONICAL: 'ONLINE',
  CD_ROM: 'CDROM',
  OTHER: 'OTHER'
};

const PUBLISHING_ACTIVITIES_TYPE = {
  CONTINUOUS: 'CONTINUOUS',
  OCCASIONAL: 'OCCASIONAL'
};

const ELECTRONICAL_FORMATS = {
  PDF: 'PDF',
  EPUB: 'EPUB',
  CD_ROM: 'CD_ROM',
  MP3: 'MP3',
  OTHER: 'OTHER'
};

const PRINT_FORMATS = {
  PAPERBACK: 'PAPERBACK',
  HARDBACK: 'HARDBACK',
  SPIRAL_BINDING: 'SPIRAL_BINDING',
  OTHER_PRINT: 'OTHER_PRINT'
};

export const MESSAGE_CODES = {
  SEND_LIST_ISBN: 'big_publisher_isbn',
  SEND_LIST_ISMN: 'big_publisher_ismn',
  SEND_SUBRANGE_ISBN: 'publisher_registered_isbn',
  SEND_SUBRANGE_ISMN: 'publisher_registered_ismn',
  SEND_PUBLICATION_IDENTIFIERS_ISBN: 'identifier_created_isbn',
  SEND_PUBLICATION_IDENTIFIERS_ISMN: 'identifier_created_ismn'
};

export const publicationTypeOptions = [
  {label: 'common.BOOK', value: PUBLICATION_TYPES.BOOK},
  {label: 'common.DISSERTATION', value: PUBLICATION_TYPES.DISSERTATION},
  {label: 'common.MAP', value: PUBLICATION_TYPES.MAP},
  {label: 'common.SHEET_MUSIC', value: PUBLICATION_TYPES.SHEET_MUSIC},
  {label: 'common.OTHER', value: PUBLICATION_TYPES.OTHER}
];

export const issnPublicationTypeOptions = [
  {label: '', value: ''},
  {label: 'common.journal', value: ISSN_PUBLICATION_TYPES.JOURNAL},
  {label: 'common.newsletter', value: ISSN_PUBLICATION_TYPES.NEWSLETTER},
  {label: 'common.staff_magazine', value: ISSN_PUBLICATION_TYPES.STAFFMAGAZINE},
  {label: 'common.membership_based_magazine', value: ISSN_PUBLICATION_TYPES.MEMBERSHIPMAGAZINE},
  {label: 'common.newspaper', value: ISSN_PUBLICATION_TYPES.NEWSPAPER},
  {label: 'common.free_paper', value: ISSN_PUBLICATION_TYPES.FREEPAPER},
  {label: 'common.monography_series', value: ISSN_PUBLICATION_TYPES.MONOGRAPHY},
  {label: 'common.cartoon', value: ISSN_PUBLICATION_TYPES.CARTOON},
  {label: 'common.other_serial', value: ISSN_PUBLICATION_TYPES.OTHER}
];

export const issnPublicationRequestStatusOptions = [
  {label: 'common.not_handled', value: ISSN_PUBLICATION_REQUEST_STATUS.NOT_HANDLED},
  {label: 'common.not_notified', value: ISSN_PUBLICATION_REQUEST_STATUS.NOT_NOTIFIED},
  {label: 'common.completed', value: ISSN_PUBLICATION_REQUEST_STATUS.COMPLETED},
  {label: 'common.rejected', value: ISSN_PUBLICATION_REQUEST_STATUS.REJECTED}
];

export const issnPublicationStatusOptions = [
  {label: 'common.no_issn_granted', value: ISSN_PUBLICATION_STATUS.NO_ISSN_GRANTED},
  {label: 'common.no_prepublication_record', value: ISSN_PUBLICATION_STATUS.NO_PREPUBLICATION_RECORD},
  {label: 'common.issn_frozen', value: ISSN_PUBLICATION_STATUS.ISSN_FROZEN},
  {label: 'common.waiting_for_control_copy', value: ISSN_PUBLICATION_STATUS.WAITING_FOR_CONTROL_COPY},
  {label: 'common.completed', value: ISSN_PUBLICATION_STATUS.COMPLETED}
];

export const publicationFormatOptions = [
  {label: 'form.isbnIsmn.format.option.print', value: FORMATS.PRINT},
  {label: 'form.isbnIsmn.format.option.electronical', value: FORMATS.ELECTRONICAL},
  {label: 'form.isbnIsmn.format.option.print_electronical', value: FORMATS.PRINT_ELECTRONICAL}
];

export const mediumOptions = [
  {label: '', value: ''},
  {label: 'form.issn.publicationMedium.printed', value: MEDIUM.PRINT},
  {label: 'form.issn.publicationMedium.electronical', value: MEDIUM.ELECTRONICAL},
  {label: 'form.issn.publicationMedium.cd_rom', value: MEDIUM.CD_ROM},
  {label: 'form.issn.publicationMedium.other', value: MEDIUM.OTHER}
];

export const issnPublicationFrequencyOptions = [
  {label: '', value: ''},
  {label: 'form.frequency.yearly', value: ISSN_PUBLICATION_FREQUENCY.YEARLY},
  {label: 'form.frequency.monthly', value: ISSN_PUBLICATION_FREQUENCY.MONTHLY},
  {label: 'form.frequency.weekly', value: ISSN_PUBLICATION_FREQUENCY.WEEKLY},
  {label: 'form.frequency.daily', value: ISSN_PUBLICATION_FREQUENCY.DAILY},
  {label: 'form.frequency.biyearly', value: ISSN_PUBLICATION_FREQUENCY.BIYEARLY},
  {label: 'form.frequency.quarterly', value: ISSN_PUBLICATION_FREQUENCY.QUARTERLY},
  {label: 'form.frequency.bimonthly', value: ISSN_PUBLICATION_FREQUENCY.BIMONTHLY},
  {label: 'form.frequency.irregular', value: ISSN_PUBLICATION_FREQUENCY.IRREGULAR},
  {label: 'form.frequency.continuously', value: ISSN_PUBLICATION_FREQUENCY.CONTINUOUSLY},
  {label: 'form.frequency.other', value: ISSN_PUBLICATION_FREQUENCY.OTHER}
];

export const publisherPublishingActivityOptions = [
  {label: 'form.isbnIsmn.publishingActivities.option.continuous', value: PUBLISHING_ACTIVITIES_TYPE.CONTINUOUS},
  {label: 'form.isbnIsmn.publishingActivities.option.occasional', value: PUBLISHING_ACTIVITIES_TYPE.OCCASIONAL}
];

export const electronicFormats = [
  {label: 'form.fileFormat.pdf', value: ELECTRONICAL_FORMATS.PDF},
  {label: 'form.fileFormat.epub', value: ELECTRONICAL_FORMATS.EPUB},
  {label: 'form.fileFormat.cd_rom', value: ELECTRONICAL_FORMATS.CD_ROM},
  {label: 'form.fileFormat.mp3', value: ELECTRONICAL_FORMATS.MP3},
  {label: 'form.fileFormat.other', value: ELECTRONICAL_FORMATS.OTHER}
];

export const printFormats = [
  {label: 'form.printFormat.paperback', value: PRINT_FORMATS.PAPERBACK},
  {label: 'form.printFormat.hardback', value: PRINT_FORMATS.HARDBACK},
  {label: 'form.printFormat.spiral_binding', value: PRINT_FORMATS.SPIRAL_BINDING},
  {label: 'form.printFormat.other_print', value: PRINT_FORMATS.OTHER_PRINT}
];

export const authorRoles = [
  {label: 'form.isbnIsmn.authors.role.option.author', value: 'AUTHOR'},
  {label: 'form.isbnIsmn.authors.role.option.illustrator', value: 'ILLUSTRATOR'},
  {label: 'form.isbnIsmn.authors.role.option.translator', value: 'TRANSLATOR'},
  {label: 'form.isbnIsmn.authors.role.option.editor', value: 'EDITOR'}
];

export const langCodeOptions = [
  {label: 'common.fin', value: 'fi-FI'},
  {label: 'common.eng', value: 'en-GB'},
  {label: 'common.swe', value: 'sv-SE'}
];

export const publishingLanguages = [
  {label: '', value: ''},
  {label: 'common.fin', value: 'FIN'},
  {label: 'common.swe', value: 'SWE'},
  {label: 'common.eng', value: 'ENG'},
  {label: 'common.smi', value: 'SMI'},
  {label: 'common.fre', value: 'FRE'},
  {label: 'common.ger', value: 'GER'},
  {label: 'common.rus', value: 'RUS'},
  {label: 'common.spa', value: 'SPA'},
  {label: 'common.other', value: 'MUL'}
];

export const classificationCodes = [
  {label: 'form.publisherRegistration.classification.general', value: '000'},
  {label: 'form.publisherRegistration.classification.book-business-lib', value: '015'},
  {label: 'form.publisherRegistration.classification.text-books', value: '030'},
  {label: 'form.publisherRegistration.classification.children-book', value: '035'},
  {label: 'form.publisherRegistration.classification.official-publication', value: '040'},
  {label: 'form.publisherRegistration.classification.university-publication', value: '045'},
  {label: 'form.publisherRegistration.classification.electronic-publication', value: '050'},
  {label: 'form.publisherRegistration.classification.audiovisual', value: '055'},
  {label: 'form.publisherRegistration.classification.philosophy', value: '100'},
  {label: 'form.publisherRegistration.classification.psychology', value: '120'},
  {label: 'form.publisherRegistration.classification.paranormal', value: '130'},
  {label: 'form.publisherRegistration.classification.religion', value: '200'},
  {label: 'form.publisherRegistration.classification.christianity', value: '210'},
  {label: 'form.publisherRegistration.classification.orthodox', value: '211'},
  {label: 'form.publisherRegistration.classification.other-religions', value: '270'},
  {label: 'form.publisherRegistration.classification.social-science', value: '300'},
  {label: 'form.publisherRegistration.classification.political-studies', value: '310'},
  {label: 'form.publisherRegistration.classification.military', value: '315'},
  {label: 'form.publisherRegistration.classification.sociology', value: '316'},
  {label: 'form.publisherRegistration.classification.economics', value: '320'},
  {label: 'form.publisherRegistration.classification.law', value: '330'},
  {label: 'form.publisherRegistration.classification.public-administration', value: '340'},
  {label: 'form.publisherRegistration.classification.education', value: '350'},
  {label: 'form.publisherRegistration.classification.ethnography', value: '370'},
  {label: 'form.publisherRegistration.classification.local-history', value: '375'},
  {label: 'form.publisherRegistration.classification.social-politics', value: '380'},
  {label: 'form.publisherRegistration.classification.mass-media', value: '390'},
  {label: 'form.publisherRegistration.classification.literature', value: '400'},
  {label: 'form.publisherRegistration.classification.fiction', value: '410'},
  {label: 'form.publisherRegistration.classification.poetry', value: '420'},
  {label: 'form.publisherRegistration.classification.cartoons', value: '440'},
  {label: 'form.publisherRegistration.classification.science-fiction', value: '450'},
  {label: 'form.publisherRegistration.classification.crime-fiction', value: '460'},
  {label: 'form.publisherRegistration.classification.linguistic', value: '470'},
  {label: 'form.publisherRegistration.classification.sexual-minorities', value: '480'},
  {label: 'form.publisherRegistration.classification.minorities', value: '490'},
  {label: 'form.publisherRegistration.classification.science', value: '500'},
  {label: 'form.publisherRegistration.classification.mathematics', value: '510'},
  {label: 'form.publisherRegistration.classification.astronomy', value: '520'},
  {label: 'form.publisherRegistration.classification.physics', value: '530'},
  {label: 'form.publisherRegistration.classification.chemistry', value: '540'},
  {label: 'form.publisherRegistration.classification.geology', value: '550'},
  {label: 'form.publisherRegistration.classification.biology', value: '560'},
  {label: 'form.publisherRegistration.classification.zoology', value: '570'},
  {label: 'form.publisherRegistration.classification.botany', value: '580'},
  {label: 'form.publisherRegistration.classification.environmental-studies', value: '590'},
  {label: 'form.publisherRegistration.classification.technology', value: '600'},
  {label: 'form.publisherRegistration.classification.engineering', value: '610'},
  {label: 'form.publisherRegistration.classification.industry', value: '620'},
  {label: 'form.publisherRegistration.classification.construction', value: '621'},
  {label: 'form.publisherRegistration.classification.transport', value: '622'},
  {label: 'form.publisherRegistration.classification.information-tech', value: '630'},
  {label: 'form.publisherRegistration.classification.medicine', value: '640'},
  {label: 'form.publisherRegistration.classification.odontology', value: '650'},
  {label: 'form.publisherRegistration.classification.veteriniry', value: '660'},
  {label: 'form.publisherRegistration.classification.pharmacology', value: '670'},
  {label: 'form.publisherRegistration.classification.forestry', value: '672'},
  {label: 'form.publisherRegistration.classification.agriculture', value: '680'},
  {label: 'form.publisherRegistration.classification.handicraft', value: '690'},
  {label: 'form.publisherRegistration.classification.art', value: '700'},
  {label: 'form.publisherRegistration.classification.performing-art', value: '710'},
  {label: 'form.publisherRegistration.classification.theatre', value: '720'},
  {label: 'form.publisherRegistration.classification.dance', value: '730'},
  {label: 'form.publisherRegistration.classification.visual-art', value: '740'},
  {label: 'form.publisherRegistration.classification.art-history', value: '750'},
  {label: 'form.publisherRegistration.classification.architecture', value: '760'},
  {label: 'form.publisherRegistration.classification.fashion', value: '765'},
  {label: 'form.publisherRegistration.classification.music', value: '770'},
  {label: 'form.publisherRegistration.classification.antique', value: '780'},
  {label: 'form.publisherRegistration.classification.city-regional', value: '790'},
  {label: 'form.publisherRegistration.classification.leisure-hobbies', value: '800'},
  {label: 'form.publisherRegistration.classification.sports', value: '810'},
  {label: 'form.publisherRegistration.classification.games', value: '820'},
  {label: 'form.publisherRegistration.classification.hunting-fishing', value: '830'},
  {label: 'form.publisherRegistration.classification.gardening', value: '840'},
  {label: 'form.publisherRegistration.classification.home-economic', value: '850'},
  {label: 'form.publisherRegistration.classification.health-beauty', value: '860'},
  {label: 'form.publisherRegistration.classification.photography', value: '870'},
  {label: 'form.publisherRegistration.classification.tourism', value: '880'},
  {label: 'form.publisherRegistration.classification.humour', value: '890'},
  {label: 'form.publisherRegistration.classification.history', value: '900'},
  {label: 'form.publisherRegistration.classification.geography', value: '910'},
  {label: 'form.publisherRegistration.classification.map-atlases', value: '920'},
  {label: 'form.publisherRegistration.classification.archeology', value: '930'},
  {label: 'form.publisherRegistration.classification.genealogy', value: '940'},
  {label: 'form.publisherRegistration.classification.numismatics', value: '950'}
];

export const booleanOptions = [
  {label: 'common.yes', value: true},
  {label: 'common.no', value: false}
];

export const monthsOptions = [
  {value: '01', label: 'form.month.Jan'},
  {value: '02', label: 'form.month.Feb'},
  {value: '03', label: 'form.month.Mar'},
  {value: '04', label: 'form.month.Apr'},
  {value: '05', label: 'form.month.May'},
  {value: '06', label: 'form.month.Jun'},
  {value: '07', label: 'form.month.Jul'},
  {value: '08', label: 'form.month.Aug'},
  {value: '09', label: 'form.month.Sep'},
  {value: '10', label: 'form.month.Oct'},
  {value: '11', label: 'form.month.Nov'},
  {value: '12', label: 'form.month.Dec'}
];
