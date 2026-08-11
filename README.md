## <img src="src/icon.svg" alt="gnockoff-tiles-icon" width="24"/> Gnockoff Tiles

A knockoff of the [Tiles](https://freemacsoft.net/tiles/) app for macOS, for GNOME.

Gnockoff Tiles is a tiling manager extension for GNOME Shell that makes it easy to move
windows around with precision. It does that with reconfigurable keyboard shortcuts.

![The extension overview GIF](overview.gif)

## Usage

### Corner Tiling

Tile the focused window into any of the four corners. Pressing the same shortcut multiple times cycles through different grid sizes (e.g., 50%, 65%, 35%).

### Column Tiling

Inspired by the [Tiles](https://freemacsoft.net/tiles/) app for macOS, a second set of shortcuts sizes the focused window to full height at a third, half, or two thirds of the screen width and moves it left or right. Pressing the same shortcut repeatedly steps the window through the three column positions: left, center, and right.

### Linked Resize

Hold **Alt** (reconfigurable in settings) while dragging a window edge to resize all adjacent tiled windows at once.

![Linked Resize Demo](linked_resize.gif)

## Features

- **Corner Tiling**: Tile windows into any of the four corners.
- **Column Tiling**: Make a window a third, half, or two thirds of the screen wide at full height and step it left or right through the left, center, and right positions (like the Tiles app for macOS).
- **Dynamic Grid Sizes**: Successive key presses cycle through different tiling sizes (e.g., 50%, 65%, 35%).
- **Linked Resizing**: Resize adjacent tiled windows simultaneously by holding a modifier key (**Alt** by default).
- **Customizable Gaps**: Add and adjust gaps around windows and between them to suit your preference.
- **Center Alignment**: Quickly align any window to the center of the workspace without resizing.
- **Fully Reconfigurable**: All keyboard shortcuts and tiling steps can be customized in the settings.
- **Workspace Navigation**: Integrated shortcuts for switching workspaces and moving windows between them.

### Default Keybindings

| Shortcut                | Action                      |
| ----------------------- | --------------------------- |
| **Super + KP_1**        | Tile window to Bottom Left  |
| **Super + KP_3**        | Tile window to Bottom Right |
| **Super + KP_7**        | Tile window to Top Left     |
| **Super + KP_9**        | Tile window to Top Right    |
| **Super + KP_0** or **Super + Alt + C** | Align window to Center (no resize) |
| **Super + Alt + F** | Maximize window (fill the workspace) |
| **Super + KP_Add**      | Increase Gap Size           |
| **Super + KP_Subtract** | Decrease Gap Size           |
| **Alt + Resize**        | Trigger Linked Resize       |
| **Super + Alt + Left / Right** | Move half-width column left / right |
| **Ctrl + Alt + Left / Right** | Move third-width column left / right |
| **Super + Ctrl + Left / Right** | Move two-thirds-width column left / right |

On launch, the extension removes any system keybindings (e.g. GNOME's Ctrl + Alt + Left/Right workspace switching) that conflict with the shortcuts configured in the extension, and restores them when the extension is disabled.

## Installation

### From GNOME Extensions

Not yet available — the extensions.gnome.org listing is pending submission and
review. Install from source in the meantime.

### From source code

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/episode6/gnome-shell-extension-gnockoff-tiles.git
    ```
2.  **Navigate into the folder**:
    ```bash
    cd gnome-shell-extension-gnockoff-tiles
    ```
3.  **Run the local installation command**:
    ```bash
    ./install.sh local-install
    ```

## Available Translations

The extension is translated into the following languages:

- **Arabic** (`ar`)
- **German** (`de`)
- **Greek** (`el`)
- **Spanish** (`es`)
- **French** (`fr`)
- **Italian** (`it`)
- **Japanese** (`ja`)
- **Korean** (`ko`)
- **Dutch** (`nl`)
- **Polish** (`pl`)
- **Russian** (`ru`)
- **Turkish** (`tr`)
- **Ukrainian** (`uk`)
- **Chinese (Simplified)** (`zh_CN`)

## Development

A containerized development environment is provided to test the extension in various locales without affecting your host system.

### Dependencies (Host System)

To run the development environment, you need the following packages installed on your host:

- `docker`
- `x11docker`
- `inotify-tools` (for the file watcher)
- `gettext` (for translation compilation)
- `glib2.0` (for schema compilation)
- `rsync`

### Usage

1. **Start the development session**:

   ```bash
   ./dev/start-dev.sh
   ```

   This will build the development image (if it doesn't exist), setup the extension, and launch GNOME Shell inside a container.

2. **Testing different locales**:
   You can specify a language using the `--lang` argument:

   ```bash
   ./dev/start-dev.sh --lang=de_DE.UTF-8
   ```

3. **Rebuilding the image**:
   If you modify the `Dockerfile`, force a rebuild of the container image:
   ```bash
   ./dev/start-dev.sh rebuild
   ```

### How it Works (Hot Reload)

The `start-dev.sh` script includes an integrated watcher that monitors the `src/` and `po/` directories:

- **Watcher**: Uses `inotifywait` to detect file saves.
- **Syncing**: Automatically syncs `src/` files to the development directory.
- **Compiling**:
  - Compiles GSettings schemas using `glib-compile-schemas`.
  - Compiles `.po` files into `.mo` binaries using `msgfmt`.
- **Hot Reload**: When a change is detected, the GNOME Shell container is automatically restarted to apply the fresh build immediately.

## Credits

Gnockoff Tiles is maintained by [episode6](https://github.com/episode6).

It is a fork of [Awesome Tiles](https://github.com/velitasali/gnome-shell-extension-awesome-tiles)
by Pim Snel, Veli Tasalı, Samet Güzeldemirci, and its contributors — Gnockoff Tiles
would not exist without their work. Awesome Tiles in turn credits:

- [Useless Gaps](https://github.com/mipmip/gnome-shell-extensions-useless-gaps)
- [Night Theme Switcher](https://gitlab.com/rmnvgr/nightthemeswitcher-gnome-shell-extension)

## Contributing

### Translation

Create a copy of `po/gnockoff-tiles@episode6.com.pot` in the **same directory** and name it
as follows:

- `<LANGUAGE_CODE>.po` for a language.
- `<LANGUAGE_CODE>_<COUNTRY_CODE>.po` for a language spoken in a specific region.

Examples:

- `ja.po` for the Japanese language translation.
- `de_AT.po` for the German language spoken in Austria.

Finally, open a new pull request that includes your translation.
