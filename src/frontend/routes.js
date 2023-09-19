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

// Error page
import ErrorPage from '/src/frontend/components/common/ErrorPage.jsx';

// Home page
import Home from '/src/frontend/views/Home.jsx';

// Forms
import IsbnMessageForm from '/src/frontend/views/isbn-registry/messages/IsbnMessageForm.jsx';
import IssnMessageForm from '/src/frontend/views/issn-registry/messages/IssnMessageForm.jsx';
import IsbnStatisticsForm from '/src/frontend/views/isbn-registry/statistics/IsbnStatisticsForm.jsx';
import IssnStatisticsForm from '/src/frontend/views/issn-registry/statistics/IssnStatisticsForm.jsx';
import IsbnMessageTemplateForm from '/src/frontend/views/isbn-registry/messagetemplates/IsbnMessageTemplateForm.jsx';
import IssnMessageTemplateForm from '/src/frontend/views/issn-registry/messagetemplates/IssnMessageTemplateForm.jsx';

// Publishers
import IsbnPublisherList from '/src/frontend/views/isbn-registry/publishers/IsbnPublisherList.jsx';
import IsbnPublisher from '/src/frontend/views/isbn-registry/publishers/IsbnPublisher.jsx';
import IssnPublisherList from '/src/frontend/views/issn-registry/publishers/IssnPublisherList.jsx';
import IssnPublisher from '/src/frontend/views/issn-registry/publishers/IssnPublisher.jsx';

// ISSN Publications
import IssnPublicationList from '/src/frontend/views/issn-registry/publications/IssnPublicationList.jsx';
import IssnPublication from '/src/frontend/views/issn-registry/publications/IssnPublication.jsx';

// Requests
import IsbnPublisherRequestList from '/src/frontend/views/isbn-registry/requests/publishers/IsbnPublisherRequestList.jsx';
import IsbnPublisherRequest from '/src/frontend/views/isbn-registry/requests/publishers/IsbnPublisherRequest.jsx';
import IsbnPublicationRequestList from '/src/frontend/views/isbn-registry/requests/publications/IsbnPublicationRequestList.jsx';
import IsbnPublicationRequest from '/src/frontend/views/isbn-registry/requests/publications/IsbnPublicationRequest.jsx';
import IssnRequestList from '/src/frontend/views/issn-registry/requests/IssnRequestList.jsx';
import IssnRequest from '/src/frontend/views/issn-registry/requests/IssnRequest.jsx';

// Ranges
import IsbnRangeList from '/src/frontend/views/isbn-registry/ranges/isbn/IsbnRangeList.jsx';
import IsbnRange from '/src/frontend/views/isbn-registry/ranges/isbn/IsbnRange.jsx';
import IsmnRangeList from '/src/frontend/views/isbn-registry/ranges/ismn/IsmnRangeList.jsx';
import IsmnRange from '/src/frontend/views/isbn-registry/ranges/ismn/IsmnRange.jsx';
import IssnRangeList from '/src/frontend/views/issn-registry/ranges/IssnRangeList.jsx';
import IssnRange from '/src/frontend/views/issn-registry/ranges/IssnRange.jsx';

// Publisher Ranges
import IsbnPublisherRange from '/src/frontend/views/isbn-registry/publisher-ranges/IsbnPublisherRange.jsx';
import IsmnPublisherRange from '/src/frontend/views/isbn-registry/publisher-ranges/IsmnPublisherRange.jsx';

// Batch
import IsbnIdentifierBatch from '/src/frontend/views/isbn-registry/identifierbatches/IsbnIdentifierBatch.jsx';

// Message Templates
import IsbnMessageTemplateList from '/src/frontend/views/isbn-registry/messagetemplates/IsbnMessageTemplateList.jsx';
import IsbnMessageTemplate from '/src/frontend/views/isbn-registry/messagetemplates/IsbnMessageTemplate.jsx';
import IssnMessageTemplateList from '/src/frontend/views/issn-registry/messagetemplates/IssnMessageTemplateList.jsx';
import IssnMessageTemplate from '/src/frontend/views/issn-registry/messagetemplates/IssnMessageTemplate.jsx';

// Messages
import IsbnMessageList from '/src/frontend/views/isbn-registry/messages/IsbnMessageList.jsx';
import IsbnMessage from '/src/frontend/views/isbn-registry/messages/IsbnMessage.jsx';
import IssnMessageList from '/src/frontend/views/issn-registry/messages/IssnMessageList.jsx';
import IssnMessage from '/src/frontend/views/issn-registry/messages/IssnMessage.jsx';

// Group messages
import GroupMessageList from '/src/frontend/views/isbn-registry/groupmessages/GroupMessageList.jsx';

// Routes
export const routeList = [
  /* Common */
  {path: '/', component: Home},
  {path: '/errorpage', component: ErrorPage},

  /* ISBN/ISMN */
  // Publishers
  {path: '/isbn-registry/publishers', component: IsbnPublisherList},
  {path: '/isbn-registry/publishers/:id', component: IsbnPublisher},
  // Requests
  {path: '/isbn-registry/requests/publishers', component: IsbnPublisherRequestList},
  {path: '/isbn-registry/requests/publishers/:id', component: IsbnPublisherRequest},
  {path: '/isbn-registry/requests/publications', component: IsbnPublicationRequestList},
  {path: '/isbn-registry/requests/publications/:id', component: IsbnPublicationRequest},
  // Ranges
  {path: '/isbn-registry/ranges/isbn', component: IsbnRangeList},
  {path: '/isbn-registry/ranges/isbn/:id', component: IsbnRange},
  {path: '/isbn-registry/ranges/ismn', component: IsmnRangeList},
  {path: '/isbn-registry/ranges/ismn/:id', component: IsmnRange},
  // Publisher Ranges
  {path: '/isbn-registry/publisher-ranges/isbn/:id', component: IsbnPublisherRange},
  {path: '/isbn-registry/publisher-ranges/ismn/:id', component: IsmnPublisherRange},
  // Message Templates
  {path: '/isbn-registry/messagetemplates', component: IsbnMessageTemplateList},
  {path: '/isbn-registry/messagetemplates/:id', component: IsbnMessageTemplate},
  {path: '/isbn-registry/messagetemplates/form/create', component: IsbnMessageTemplateForm},
  // Messages
  {path: '/isbn-registry/messages', component: IsbnMessageList},
  {path: '/isbn-registry/messages/:id', component: IsbnMessage},
  {path: '/isbn-registry/messages/form/send', component: IsbnMessageForm},

  // Group messages
  {path: '/isbn-registry/groupmessages', component: GroupMessageList},

  // Identifier batch
  {path: '/isbn-registry/identifierbatches/:id', component: IsbnIdentifierBatch},
  // Statistics
  {path: '/isbn-registry/statistics', component: IsbnStatisticsForm},

  /* ISSN */
  // Requests
  {path: '/issn-registry/requests', component: IssnRequestList},
  {path: '/issn-registry/requests/:id', component: IssnRequest},
  // Publishers
  {path: '/issn-registry/publishers', component: IssnPublisherList},
  {path: '/issn-registry/publishers/:id', component: IssnPublisher},
  // Publications
  {path: '/issn-registry/publications', component: IssnPublicationList},
  {path: '/issn-registry/publications/:id', component: IssnPublication},
  // Ranges
  {path: '/issn-registry/ranges', component: IssnRangeList},
  {path: '/issn-registry/ranges/:id', component: IssnRange},
  // Messages
  {path: '/issn-registry/messages', component: IssnMessageList},
  {path: '/issn-registry/messages/:id', component: IssnMessage},
  {path: '/issn-registry/messages/form/send', component: IssnMessageForm},
  // Message Templates
  {path: '/issn-registry/messagetemplates', component: IssnMessageTemplateList},
  {path: '/issn-registry/messagetemplates/:id', component: IssnMessageTemplate},
  {path: '/issn-registry/messagetemplates/form/create', component: IssnMessageTemplateForm},
  // Statistics
  {path: '/issn-registry/statistics', component: IssnStatisticsForm}
];
