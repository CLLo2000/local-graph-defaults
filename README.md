# Local Graph Defaults

*(EN) Applies a saved settings template to every newly opened Local Graph pane in Obsidian, so you don't have to re-configure the filter, depth, and color groups by hand each time. Capture the template with one click from a pane you've already tuned.*

## Ne işe yarar

Bir not açıp Local Graph panelini istediğin gibi ayarladığında (arama filtresi, derinlik, renk grupları, etiket/ek gösterimi vb.), bu ayarları tek tıkla bir **şablon** olarak yakalayabilirsin. Bundan sonra açılan her yeni Local Graph paneli otomatik olarak bu şablonla başlar; panel panel aynı ayarları tekrar girmene gerek kalmaz.

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
