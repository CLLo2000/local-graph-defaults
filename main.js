'use strict';

const { Plugin, PluginSettingTab, Setting, Notice } = require('obsidian');

const VIEW_TYPE = 'localgraph';

const DEFAULT_SETTINGS = {
  enabled: true,
  template: null,       // yakalanan ayar nesnesi
  capturedAt: null,     // ne zaman yakalandığı (bilgi amaçlı)
  notify: false,        // uygulandığında bildirim göster
};

class LocalGraphDefaults extends Plugin {

  async onload() {
    await this.loadSettings();

    // Hangi panellere uygulandığını tutar. WeakSet kullanılıyor ki
    // kapatılan paneller bellekte kalmasın.
    this.applied = new WeakSet();

    this.addSettingTab(new LocalGraphDefaultsSettingTab(this.app, this));

    // Yeni panel açıldığında yakala
    this.registerEvent(
      this.app.workspace.on('layout-change', () => this.applyToNewLeaves())
    );

    this.app.workspace.onLayoutReady(() => this.applyToNewLeaves());

    this.addCommand({
      id: 'capture-template',
      name: 'Açık local graftan şablonu yakala',
      callback: () => this.captureTemplate(),
    });

    this.addCommand({
      id: 'apply-now',
      name: 'Şablonu tüm açık local graflara uygula',
      callback: () => this.applyToAllLeaves(),
    });
  }

  onunload() {
    this.applied = null;
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  getLocalGraphLeaves() {
    return this.app.workspace.getLeavesOfType(VIEW_TYPE) || [];
  }

  /**
   * Şablonu, daha önce dokunulmamış panellere uygular.
   * Panel başına bir kez çalışır — böylece kullanıcı bir panelde
   * derinliği veya filtreyi elle değiştirdiğinde plugin geri almaz.
   */
  applyToNewLeaves() {
    if (!this.settings.enabled || !this.settings.template) return;

    for (const leaf of this.getLocalGraphLeaves()) {
      if (this.applied.has(leaf)) continue;
      this.applied.add(leaf);
      this.applyToLeaf(leaf);
    }
  }

  /** Açık tüm panellere, daha önce uygulanmış olsa bile uygular. */
  applyToAllLeaves() {
    if (!this.settings.template) {
      new Notice('Önce bir şablon yakalamalısın.');
      return;
    }
    const leaves = this.getLocalGraphLeaves();
    if (leaves.length === 0) {
      new Notice('Açık local graf paneli yok.');
      return;
    }
    for (const leaf of leaves) {
      this.applied.add(leaf);
      this.applyToLeaf(leaf);
    }
    new Notice(`Şablon ${leaves.length} panele uygulandı.`);
  }

  applyToLeaf(leaf) {
    try {
      const current = leaf.getViewState();
      if (!current || current.type !== VIEW_TYPE) return;

      const state = Object.assign({}, current.state);

      // 'file' alanı panelin hangi nota baktığını söyler, korunmalı.
      state.options = Object.assign(
        {},
        state.options || {},
        this.settings.template
      );

      leaf.setViewState({
        type: VIEW_TYPE,
        state: state,
        active: false,
      });

      if (this.settings.notify) {
        new Notice('Local graf ayarları uygulandı.');
      }
    } catch (err) {
      console.error('[local-graph-defaults] uygulanamadı:', err);
    }
  }

  /**
   * Açık bir local graf panelinin mevcut ayarlarını şablon olarak alır.
   * Obsidian'ın iç anahtar isimlerini bilmeye gerek kalmaz: panelde ne
   * varsa o kopyalanır.
   */
  async captureTemplate() {
    const leaves = this.getLocalGraphLeaves();
    if (leaves.length === 0) {
      new Notice('Açık local graf paneli yok. Bir not aç, local grafı aç, ayarla, sonra tekrar dene.');
      return null;
    }

    // Etkin panel local graf ise onu, değilse ilkini al.
    // NOT: workspace.activeLeaf kullanımdan kaldırılmıştır (obsolete);
    // yerine resmi olarak önerilen getMostRecentLeaf() kullanılıyor.
    const recent = this.app.workspace.getMostRecentLeaf();
    let leaf = leaves[0];
    if (recent && leaves.includes(recent)) leaf = recent;

    const vs = leaf.getViewState();
    const options = vs && vs.state ? vs.state.options : null;

    if (!options || Object.keys(options).length === 0) {
      new Notice('Panelden ayar okunamadı. Panelde bir ayarı değiştirip tekrar dene.');
      return null;
    }

    // 'file' asla şablona girmemeli — her panel kendi notuna bakar.
    const clean = Object.assign({}, options);
    delete clean.file;

    this.settings.template = clean;
    this.settings.capturedAt = new Date().toISOString().slice(0, 16).replace('T', ' ');
    await this.saveSettings();

    new Notice(`Şablon yakalandı (${Object.keys(clean).length} ayar).`);
    return clean;
  }
}

class LocalGraphDefaultsSettingTab extends PluginSettingTab {

  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl('h2', { text: 'Local Graph Defaults' });
    containerEl.createEl('p', {
      text: 'Bir not açıp local grafı istediğin gibi ayarla (filtre, derinlik, renk grupları, oklar, kuvvetler). Sonra aşağıdaki butonla o ayarları şablon olarak yakala. Bundan sonra açılan her local graf paneli bu şablonla başlar.',
      cls: 'setting-item-description',
    });

    new Setting(containerEl)
      .setName('Etkin')
      .setDesc('Kapatırsan yeni paneller Obsidian varsayılanıyla açılır.')
      .addToggle(t => t
        .setValue(this.plugin.settings.enabled)
        .onChange(async v => {
          this.plugin.settings.enabled = v;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName('Şablonu yakala')
      .setDesc('Açık local graf panelinin mevcut ayarlarını kaydeder.')
      .addButton(b => b
        .setButtonText('Açık panelden yakala')
        .setCta()
        .onClick(async () => {
          await this.plugin.captureTemplate();
          this.display();
        }));

    new Setting(containerEl)
      .setName('Şimdi uygula')
      .setDesc('Açık tüm local graf panellerini şablona döndürür.')
      .addButton(b => b
        .setButtonText('Uygula')
        .onClick(() => this.plugin.applyToAllLeaves()));

    new Setting(containerEl)
      .setName('Uygulandığında bildir')
      .setDesc('Her panelde kısa bir bildirim gösterir. Hata ayıklama için.')
      .addToggle(t => t
        .setValue(this.plugin.settings.notify)
        .onChange(async v => {
          this.plugin.settings.notify = v;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName('Şablonu sil')
      .setDesc('Kayıtlı şablonu temizler.')
      .addButton(b => b
        .setButtonText('Sil')
        .setWarning()
        .onClick(async () => {
          this.plugin.settings.template = null;
          this.plugin.settings.capturedAt = null;
          await this.plugin.saveSettings();
          this.display();
        }));

    // Kayıtlı şablonun önizlemesi
    containerEl.createEl('h3', { text: 'Kayıtlı şablon' });

    const tpl = this.plugin.settings.template;
    if (!tpl) {
      containerEl.createEl('p', {
        text: 'Henüz şablon yakalanmadı.',
        cls: 'setting-item-description',
      });
      return;
    }

    if (this.plugin.settings.capturedAt) {
      containerEl.createEl('p', {
        text: 'Yakalanma: ' + this.plugin.settings.capturedAt,
        cls: 'setting-item-description',
      });
    }

    // Stiller styles.css'teki .local-graph-defaults-preview class'ından geliyor
    // (JS ile doğrudan .style atamak yerine).
    const pre = containerEl.createEl('pre', { cls: 'local-graph-defaults-preview' });
    pre.setText(JSON.stringify(tpl, null, 2));
  }
}

module.exports = LocalGraphDefaults;
