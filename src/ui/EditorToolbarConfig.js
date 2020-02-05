// @flow

// eslint-disable-next-line no-unused-vars
import React from 'react';

import * as EditorCommands from '../EditorCommands';
import FontSizeCommandMenuButton from './FontSizeCommandMenuButton';
import FontTypeCommandMenuButton from './FontTypeCommandMenuButton';
import Icon from './Icon';

const ICON_LABEL_PATTERN = /\[([A-Za-z_\d]+)\](.*)/;

export function parseLabel(input: string): Object {
  const matched = input.match(ICON_LABEL_PATTERN);
  if (matched) {
    const [
      // eslint-disable-next-line no-unused-vars
      all,
      icon,
      label,
    ] = matched;
    return {
      icon: icon ? Icon.get(icon) : null,
      title: label || null,
    };
  }
  return {
    icon: null,
    title: input || null,
  };
}

const {
  // BLOCKQUOTE_TOGGLE,
  CLEAR_FORMAT,
  // CODE,
  // DOC_LAYOUT,
  EM,
  H1,
  H2,
  H3,
  // H4,
  // H5,
  // H6,
  HISTORY_REDO,
  HISTORY_UNDO,
  HR,
  // IMAGE_FROM_URL,
  IMAGE_UPLOAD,
  INDENT_LESS,
  INDENT_MORE,
  LINK_SET_URL,
  // MATH_EDIT,
  OL,
  STRIKE,
  STRONG,
  SUPER,
  TABLE_ADD_COLUMN_AFTER,
  TABLE_ADD_COLUMN_BEFORE,
  TABLE_ADD_ROW_AFTER,
  TABLE_ADD_ROW_BEFORE,
  //TABLE_BORDER_COLOR,
  TABLE_BACKGROUND_COLOR,
  TABLE_DELETE_COLUMN,
  TABLE_DELETE_ROW,
  TABLE_DELETE_TABLE,
  TABLE_INSERT_TABLE,
  TABLE_MERGE_CELLS,
  //TABLE_MOVE_TO_NEXT_CELL,
  //TABLE_MOVE_TO_PREV_CELL,
  TABLE_SPLIT_ROW,
  //TABLE_TOGGLE_HEADER_CELL,
  //TABLE_TOGGLE_HEADER_COLUMN,
  //TABLE_TOGGLE_HEADER_ROW,
  TEXT_ALIGN_CENTER,
  TEXT_ALIGN_JUSTIFY,
  TEXT_ALIGN_LEFT,
  TEXT_ALIGN_RIGHT,
  TEXT_COLOR,
  TEXT_HIGHLIGHT,
  TEXT_LINE_SPACINGS,
  UL,
  UNDERLINE,
} = EditorCommands;

export const TABLE_COMMANDS_GROUP = [
  {
    'Inserir Tabela': TABLE_INSERT_TABLE,
  },
  {
    'Cor de Fundo': TABLE_BACKGROUND_COLOR,
    //'Border Color....': TABLE_BORDER_COLOR,
  },
  {
    'Inserir Coluna Antes': TABLE_ADD_COLUMN_BEFORE,
    'Inserir Coluna Depois': TABLE_ADD_COLUMN_AFTER,
    'Apagar Coluna': TABLE_DELETE_COLUMN,
  },
  {
    'Inserir Linha Antes': TABLE_ADD_ROW_BEFORE,
    'Inserir Linha Depois': TABLE_ADD_ROW_AFTER,
    'Apagar Linha': TABLE_DELETE_ROW,
  },
  {
    'Mesclar Celulas': TABLE_MERGE_CELLS,
    'Dividir Celulas': TABLE_SPLIT_ROW,
  },
  // Disable these commands cause user rarely use them.
  //{
  //  'Toggle Header Column': TABLE_TOGGLE_HEADER_COLUMN,
  //  'Toggle Header Row': TABLE_TOGGLE_HEADER_ROW,
  //  'Toggle Header Cells': TABLE_TOGGLE_HEADER_CELL,
  //},
  {
    'Apagar Tabela': TABLE_DELETE_TABLE,
  },
];

export const COMMAND_GROUPS = [
  {
    '[undo] Desfazer': HISTORY_UNDO,
    '[redo] Refazer': HISTORY_REDO,
  },
  {
    '[grid_on] Tabela...': TABLE_COMMANDS_GROUP,
  },
  {
    '[H] Títulos...': [
      {
        'Título 1': H1,
        'Título 2': H2,
        'Título 3': H3,
        // 'Header 4': H4,
        // 'Header 5': H5,
        // 'Header 6': H6,
      },
    ],
  },
  {
    '[font_download] Fonte': FontTypeCommandMenuButton,
  },
  {
    '[format_size] Tamanho da Fonte': FontSizeCommandMenuButton,
  },
  {
    '[format_bold] Negrito': STRONG,
    '[format_italic] Itálico': EM,
    '[format_underline] Sublinhado': UNDERLINE,
    '[format_strikethrough] Tachado': STRIKE,
    '[superscript] Sobrescrito': SUPER,
  },
  {
    '[format_color_text] Cor do texto': TEXT_COLOR,
    '[border_color] Cor de fundo': TEXT_HIGHLIGHT,
  },
  {
    '[link] Link': LINK_SET_URL,
    '[image] Figura': IMAGE_UPLOAD,
    // '[image] Insert image': [
    //   {
    //     'Insert image by URL': IMAGE_FROM_URL,
    //     'Upload image from computer': IMAGE_UPLOAD,
    //   },
    // ],
  },
  {
    '[format_align_left] Esquerda': TEXT_ALIGN_LEFT,
    '[format_align_center] Centro': TEXT_ALIGN_CENTER,
    '[format_align_right] Direita': TEXT_ALIGN_RIGHT,
    '[format_align_justify] Justificado': TEXT_ALIGN_JUSTIFY,
  },
  {
    '[format_line_spacing] Espaço entre linhas': TEXT_LINE_SPACINGS,
    '[hr] Linha horizontal': HR,
  },
  {
    '[format_list_bulleted] Lista': UL,
    '[format_list_numbered] Lista Ordenada': OL,
  },
  {
    '[format_indent_increase] Identar mais': INDENT_MORE,
    '[format_indent_decrease] Identar menos': INDENT_LESS,
  },
  {
    '[format_clear] Limpar formatação': CLEAR_FORMAT,
  },
  // {
  //   '[hr] Horizontal line': HR,
  //   '[functions] Math': MATH_EDIT,
  //   '[code] Code': CODE,
  //   '[format_strikethrough] Strike through': STRIKE,
  //   '[format_quote] Block quote': BLOCKQUOTE_TOGGLE,
  // },
  // {
  //   '[settings_overscan] Page layout': DOC_LAYOUT,
  // },
];
