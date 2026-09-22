# Local Graph Defaults

Applies a saved settings template to every newly opened Local Graph pane in Obsidian, so you don't have to reconfigure the filter, depth, and color groups by hand each time. Capture the template with one click from a pane you've already tuned.

## What it does

Open a note, tune its Local Graph pane the way you like (search filter, depth, color groups, tags/attachments visibility, etc.), then capture those settings as a **template** with one click. From then on, every newly opened Local Graph pane starts with that template — no more re-entering the same settings pane after pane.

The template is only applied the first time a pane is opened. Any changes you make by hand afterwards are left alone; the plugin will not revert them.

## Installation

1. Copy `main.js`, `manifest.json`, and `styles.css` into `<your vault>/.obsidian/plugins/local-graph-defaults/`.
2. In Obsidian, go to **Settings → Community plugins** and enable "Local Graph Defaults".

## Usage

1. Open a note, open its Local Graph pane, and adjust the filter/depth/color groups the way you want.
2. Run the **"Capture template from open local graph"** command from the command palette (or click "Capture from open pane" in the plugin settings).
3. Every new Local Graph pane you open from now on will start with this template.
4. If you update the template and want to force it onto panes that are already open, run **"Apply template to all open local graphs"**. This overrides any manual changes on those panes.

## Commands

| Command | What it does |
|---|---|
| Capture template from open local graph | Saves the settings of the active (or first open) Local Graph pane as the template. |
| Apply template to all open local graphs | Forces every open Local Graph pane back to the template, including manual changes. |

## Settings

- **Enabled** — turn off to have new panes open with Obsidian's own defaults.
- **Notify on apply** — shows a short notice each time the template is applied to a pane (for debugging).
- **Clear template** — removes the saved template.
- The settings tab also shows a JSON preview of the currently saved template.

## Known limitation

This plugin relies on the Local Graph pane's **internal, undocumented view-state shape** (`state.options`), which is not part of Obsidian's official plugin API. The `setViewState()`/`getViewState()` calls themselves are official API, but the shape of the data they carry is not. Because of this, a future Obsidian release could change that internal structure without notice and break the plugin. If that happens, you'll see an error logged to the console prefixed with `[local-graph-defaults]`.

## License

MIT — see [LICENSE](./LICENSE).

---

# Local Graph Defaults (Türkçe)

Açılan her Local Graph paneline kayıtlı bir ayar şablonu uygular, böylece filtreyi, derinliği ve renk gruplarını her seferinde elle yeniden ayarlaman gerekmez. Şablonu, zaten ayarladığın bir panelden tek tıkla yakala.

## Ne işe yarar

Bir not aç, Local Graph panelini istediğin gibi ayarla (arama filtresi, derinlik, renk grupları, etiket/ek gösterimi vb.), sonra bu ayarları tek tıkla bir **şablon** olarak yakala. Bundan sonra açılan her yeni Local Graph paneli otomatik olarak bu şablonla başlar; panel panel aynı ayarları tekrar girmene gerek kalmaz.

Şablon, yalnızca bir panel ilk açıldığında uygulanır. Panelde sonradan elle yaptığın değişiklikler eklenti tarafından geri alınmaz.

## Kurulum

1. `main.js`, `manifest.json` ve `styles.css` dosyalarını vault'undaki `.obsidian/plugins/local-graph-defaults/` klasörüne kopyala.
2. Obsidian'da **Ayarlar → Topluluk eklentileri**'nden "Local Graph Defaults"ı etkinleştir.

## Kullanım

1. Bir not aç, Local Graph panelini aç ve filtre/derinlik/renk grubu gibi ayarları istediğin gibi düzenle.
2. Komut paletinden **"Açık local graftan şablonu yakala"** komutunu çalıştır (veya eklenti ayarlarındaki "Açık panelden yakala" butonuna tıkla).
3. Bundan sonra açılan her yeni Local Graph paneli bu şablonla başlar.
4. Şablonu güncellersen ve zaten açık olan panellere de hemen uygulamak istersen, **"Şablonu tüm açık local graflara uygula"** komutunu çalıştır. Bu, panellerde elle yapılmış değişiklikleri de ezer.

## Komutlar

| Komut | Ne yapar |
|---|---|
| Açık local graftan şablonu yakala | Aktif (veya ilk açık) Local Graph panelinin ayarlarını şablon olarak kaydeder. |
| Şablonu tüm açık local graflara uygula | Açık tüm Local Graph panellerini, elle yapılmış değişiklikler dahil, şablona döndürür. |

## Ayarlar

- **Etkin** — kapatılırsa yeni açılan paneller Obsidian'ın kendi varsayılanıyla açılır.
- **Uygulandığında bildir** — her panele şablon uygulandığında kısa bir bildirim gösterir (hata ayıklama için).
- **Şablonu sil** — kayıtlı şablonu temizler.
- Ayarlar sekmesinde, kayıtlı şablonun JSON önizlemesi de gösterilir.

## Bilinen sınırlama

Bu eklenti, Obsidian'ın Local Graph panelinin **iç/dokümante edilmemiş view-state yapısına** (`state.options`) dayanır; bu, Obsidian'ın resmi eklenti API'sinin bir parçası değildir. `setViewState()`/`getViewState()` çağrılarının kendisi resmi API'dir, ancak taşınan verinin şekli değildir. Bu nedenle gelecekteki bir Obsidian sürümünde bu yapı önceden haber verilmeden değişebilir ve eklenti çalışmayı durdurabilir. Böyle bir durumda konsolda `[local-graph-defaults]` önekiyle bir hata mesajı görürsün.

## Lisans

MIT — bkz. [LICENSE](./LICENSE).
