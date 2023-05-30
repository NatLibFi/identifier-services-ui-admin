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

// TinyMCE React integration instructions: https://www.tiny.cloud/docs/tinymce/6/react-pm-bundle/

import React from 'react';
import {Editor} from '@tinymce/tinymce-react';

// Importing TinyMCE so the global var exists
// eslint-disable-next-line no-unused-vars
import tinymce from 'tinymce/tinymce';
// DOM model
import 'tinymce/models/dom/model';
// Theme
import 'tinymce/themes/silver';
// Toolbar icons
import 'tinymce/icons/default';
// Editor styles
import 'tinymce/skins/ui/oxide/skin.min.css';

// Importing plugins for the editor - required for the editor to work
// Plugins description: https://www.tiny.cloud/docs/tinymce/6/plugins/#open-source-plugins
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/image';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/quickbars';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/table';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/visualchars';
import 'tinymce/plugins/wordcount';

function BundledEditor(props) {
  const bundledEditorConfig = {
    height: 500,
    plugins: [
      'advlist',
      'anchor',
      'autolink',
      'image',
      'link',
      'lists',
      'searchreplace',
      'table',
      'charmap',
      'fullscreen',
      'preview',
      'quickbars',
      'visualblocks',
      'visualchars',
      'wordcount'
    ],
    // Quickbars (shown when something is selected) toolbar
    quickbars_insert_toolbar: false,
    quickbars_selection_toolbar: 'bold italic underline | blockquote quicklink',
    // Toolbar buttons
    toolbar:
      'undo redo | ' +
      'bold italic underline forecolor | alignleft aligncenter ' +
      'alignright alignjustify | bullist numlist | ' +
      'link charmap removeformat | fullscreen preview',
    // Styles of the editor content
    content_style: 'body { font-family: "Open Sans", sans-serif; font-size: 0.9rem }',
    entity_encoding: 'raw'
  };

  return <Editor init={bundledEditorConfig} {...props} />;
}

export default BundledEditor;
