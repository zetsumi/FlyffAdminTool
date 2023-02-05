<template>
  <b-navbar toggleable="lg" type="dark" variant="dark" class="shadow">
    <b-navbar-brand
      :to="{ name: 'Main' }"
      :active="activeRoute === 'Main'"
      class="d-flex align-items-center"
    >
      <b-img src="/icon.png" class="mr-2" height="32" />
      FAT
    </b-navbar-brand>

    <b-navbar-toggle target="nav-collapse" />

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item
          :to="{ name: 'Workflow' }"
          :active="activeRoute === 'Workflow'"
        >
          <b-icon icon="collection" />
          {{ $t('components.menu.links.workflow') }}
        </b-nav-item>
        <b-nav-item :to="{ name: 'System' }" :active="activeRoute === 'System'">
          <b-icon icon="gear" />
          {{ $t('components.menu.links.system') }}
        </b-nav-item>
        <b-nav-item-dropdown :text="$t('components.menu.dropdowns.database')">
          <b-dropdown-item
            :to="{ name: 'ODBC' }"
            :active="activeRoute === 'ODBC'"
          >
            <b-icon icon="layers" />
            {{ $t('components.menu.links.odbc') }}
          </b-dropdown-item>
          <b-dropdown-item
            :to="{ name: 'SQL' }"
            :active="activeRoute === 'SQL'"
          >
            <b-icon icon="server" />
            {{ $t('components.menu.links.sql') }}
          </b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item
          :to="{ name: 'SpeedTest' }"
          :active="activeRoute === 'SpeedTest'"
        >
          <b-icon icon="bar-chart" />
          {{ $t('components.menu.links.speedTest') }}
        </b-nav-item>
      </b-navbar-nav>

      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown right>
          <template v-slot:button-content>
            <b-img src="/images/icons/icons8-language.svg" height="24" />
          </template>
          <b-dropdown-item
            v-for="locale in availableLocales"
            :key="locale"
            @click="setLocale(locale)"
            :active="locale === activeLocale"
          >
            <b-avatar
              :src="`/images/flags/${locale}.svg`"
              variant="transparent"
              size="sm"
              class="mr-2"
              square
            />
            {{ locale }}
          </b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item>
          <b-icon @click="minimizeWindow()" icon="dash" variant="warning" />
        </b-nav-item>
        <b-nav-item>
          <b-icon
            @click="toggleMaximizeWindow()"
            :icon="maximizeIcon"
            variant="success"
          />
        </b-nav-item>
        <b-nav-item>
          <b-icon @click="closeWindow()" icon="x" variant="danger" />
        </b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import { remote } from 'electron';
import SettingsManager from '@/utils/SettingsManager';

export default {
  data() {
    return {
      isWindowMaximized: remote.getCurrentWindow().isMaximized(),
    };
  },
  computed: {
    maximizeIcon() {
      return this.isWindowMaximized
        ? 'arrows-angle-contract'
        : 'arrows-angle-expand';
    },
    availableLocales() {
      return this.$i18n.availableLocales;
    },
    activeLocale() {
      return this.$i18n.locale;
    },
    activeRoute() {
      return this.$route.name;
    },
  },
  methods: {
    minimizeWindow: function () {
      remote.getCurrentWindow().minimize();
    },
    toggleMaximizeWindow: function () {
      let currentWindow = remote.getCurrentWindow();
      currentWindow.isMaximized()
        ? currentWindow.unmaximize()
        : currentWindow.maximize();
      this.isWindowMaximized = currentWindow.isMaximized();
    },
    closeWindow: function () {
      remote.getCurrentWindow().close();
    },
    setLocale(locale) {
      SettingsManager.setLocale(locale);
      this.$i18n.locale = locale;
    },
  },
};
</script>

<style scoped>
nav.navbar {
  -webkit-app-region: drag;
}
nav.navbar li,
nav.navbar a {
  -webkit-app-region: no-drag;
}
</style>
