/*
 * Copyright (C) 2021 Pim Snel (https://github.com/mipmip)
 * Copyright (C) 2021 Veli Tasalı (https://github.com/velitasali)
 * Copyright (C) 2026 Samet Güzeldemirci (https://github.com/samex)
 * Copyright (C) 2026 episode6 (https://github.com/episode6)
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */

import Clutter from 'gi://Clutter'
import Gio from 'gi://Gio'
import GObject from 'gi://GObject'
import St from 'gi://St'
import { gettext as _ } from 'resource:///org/gnome/shell/extensions/extension.js'
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js'
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js'

const MODIFIER_LABELS = {
  super: 'Super',
  control: 'Ctrl',
  primary: 'Ctrl',
  alt: 'Alt',
  shift: 'Shift',
  meta: 'Meta',
  hyper: 'Hyper',
}

const KEY_LABELS = {
  KP_Add: 'Num +',
  KP_Subtract: 'Num -',
  KP_Multiply: 'Num *',
  KP_Divide: 'Num /',
  KP_Decimal: 'Num .',
  KP_Enter: 'Num Enter',
  Prior: 'Page Up',
  Next: 'Page Down',
  Left: '←',
  Right: '→',
  Up: '↑',
  Down: '↓',
}

function formatAccelerator(accel) {
  if (!accel) return ''

  const parts = []
  const modifierPattern = /<([^>]+)>/g
  let match
  while ((match = modifierPattern.exec(accel)) !== null)
    parts.push(MODIFIER_LABELS[match[1].toLowerCase()] ?? match[1])

  const key = accel.replace(/<[^>]+>/g, '')
  if (key)
    parts.push(KEY_LABELS[key] ?? (key.startsWith('KP_') ? `Num ${key.slice(3)}` : key))

  return parts.join('+')
}

export const PanelIndicator = GObject.registerClass(
class PanelIndicator extends PanelMenu.Button {
  _init(extension) {
    super._init(0.0, _('Gnockoff Tiles'))

    this._settings = extension._settings
    this._settingsConnections = []

    // The window the actions should apply to, captured when the menu opens
    // so it isn't affected by whatever the popup grab does to focus.
    this._targetWindow = null

    // Shipped rather than themed: the file name's `-symbolic.svg` suffix is
    // what makes St recolor it to match the panel's foreground.
    this.add_child(new St.Icon({
      gicon: new Gio.FileIcon({
        file: extension.dir.get_child('gnockoff-tiles-symbolic.svg'),
      }),
      style_class: 'system-status-icon',
    }))

    // Inline style because the theme's `#panel .panel-button` selector
    // out-ranks any class selector an extension stylesheet could add.
    this.set_style('-natural-hpadding: 0px; -minimum-hpadding: 0px;')

    this.menu.connect('open-state-changed', (menu, open) => {
      if (open) this._targetWindow = global.display.get_focus_window()
    })

    this._addSection(_('Tile Window'))
    this._addAction(_('Top Left'), 'shortcut-tile-window-to-top-left', (w) => extension._tileWindowTopLeft(w))
    this._addAction(_('Top'), 'shortcut-tile-window-to-top', (w) => extension._tileWindowTop(w))
    this._addAction(_('Top Right'), 'shortcut-tile-window-to-top-right', (w) => extension._tileWindowTopRight(w))
    this._addAction(_('Left'), 'shortcut-tile-window-to-left', (w) => extension._tileWindowLeft(w))
    this._addAction(_('Center'), 'shortcut-tile-window-to-center', (w) => extension._tileWindowCenter(w))
    this._addAction(_('Right'), 'shortcut-tile-window-to-right', (w) => extension._tileWindowRight(w))
    this._addAction(_('Bottom Left'), 'shortcut-tile-window-to-bottom-left', (w) => extension._tileWindowBottomLeft(w))
    this._addAction(_('Bottom'), 'shortcut-tile-window-to-bottom', (w) => extension._tileWindowBottom(w))
    this._addAction(_('Bottom Right'), 'shortcut-tile-window-to-bottom-right', (w) => extension._tileWindowBottomRight(w))
    this._addAction(_('Maximize'), 'shortcut-maximize-window', (w) => extension._maximizeWindow(w))
    this._addAction(_('Align to Center (No Resize)'), 'shortcut-align-window-to-center', (w) => extension._alignWindowToCenter(w))

    this._addSection(_('Tile Column'))
    this._addAction(_('Third Width, Move Left'), 'shortcut-tile-column-third-left', (w) => extension._tileColumnThirdLeft(w))
    this._addAction(_('Third Width, Move Right'), 'shortcut-tile-column-third-right', (w) => extension._tileColumnThirdRight(w))
    this._addAction(_('Half Width, Move Left'), 'shortcut-tile-column-half-left', (w) => extension._tileColumnHalfLeft(w))
    this._addAction(_('Half Width, Move Right'), 'shortcut-tile-column-half-right', (w) => extension._tileColumnHalfRight(w))
    this._addAction(_('Two-Thirds Width, Move Left'), 'shortcut-tile-column-two-thirds-left', (w) => extension._tileColumnTwoThirdsLeft(w))
    this._addAction(_('Two-Thirds Width, Move Right'), 'shortcut-tile-column-two-thirds-right', (w) => extension._tileColumnTwoThirdsRight(w))

    this._addSection(_('Gaps'))
    this._addAction(_('Increase Gap Size'), 'shortcut-increase-gap-size', () => extension._increaseGapSize())
    this._addAction(_('Decrease Gap Size'), 'shortcut-decrease-gap-size', () => extension._decreaseGapSize())

    this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem())
    this.menu.addAction(_('Settings…'), () => extension.openPreferences())

    this.connect('destroy', () => {
      this._settingsConnections.forEach((id) => this._settings.disconnect(id))
      this._settingsConnections = []
      this._targetWindow = null
    })
  }

  _addSection(title) {
    this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem(title))
  }

  _addAction(label, settingName, callback) {
    const item = new PopupMenu.PopupMenuItem(label)
    item.label.x_expand = true

    const shortcutLabel = new St.Label({
      style_class: 'gnockoff-tiles-shortcut-label',
      y_align: Clutter.ActorAlign.CENTER,
      opacity: 128,
    })
    item.add_child(shortcutLabel)

    const update = () => {
      shortcutLabel.text = this._settings.get_strv(settingName)
        .map(formatAccelerator)
        .filter(Boolean)
        .join(', ')
    }
    update()
    this._settingsConnections.push(
      this._settings.connect(`changed::${settingName}`, update)
    )

    item.connect('activate', () => callback(this._targetWindow))
    this.menu.addMenuItem(item)
  }
})
