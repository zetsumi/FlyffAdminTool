<template>
  <div class="bg-dark text-light">
    <b-progress
      v-if="autoUpdaterStatus === ipc.UPDATE_PROGRESS"
      max="1"
      variant="info"
      animated
    >
      <b-progress-bar :value="autoUpdaterProgress.percent">
        {{ autoUpdaterProgress.transferred | bytes }} /
        {{ autoUpdaterProgress.total | bytes }}
      </b-progress-bar>
    </b-progress>
    <div
      class="font-weight-light d-flex justify-content-between align-items-center px-4 py-2"
    >
      <small>
        <b-link
          @click="
            openExternal('https://github.com/Quentin-Lamotte/Flyff-Admin-Tool')
          "
          class="d-flex align-items-center"
        >
          <b-avatar
            src="/images/icons/icons8-creative-commons.svg"
            variant="transparent"
            square
          />
          {{ $t('components.footer.copyright') }}
        </b-link>
      </small>
      <small>
        {{ $t('components.footer.signature') }} |
        <b-link
          @click="
            openExternal(
              'https://github.com/Quentin-Lamotte/Flyff-Admin-Tool/blob/master/LICENSE.md'
            )
          "
        >
          {{ $t('components.footer.githubLink') }}
        </b-link>
      </small>
      <small class="d-flex align-items-center">
        {{ $t('components.footer.appVersion', [appVersion, appMode]) }}
        <b-button
          @click="checkForUpdates"
          :disabled="!canCheckForUpdates"
          variant="outline-light"
          size="sm"
          class="ml-2"
        >
          <b-icon
            v-if="autoUpdaterStatus === ipc.UPDATE_ERROR"
            icon="exclamation-triangle"
            variant="danger"
          />
          <b-icon
            v-else-if="autoUpdaterStatus === ipc.CHECKING_FOR_UPDATE"
            icon="arrow-clockwise"
            variant="info"
            animation="spin"
          />
          <b-icon
            v-else-if="
              autoUpdaterStatus === ipc.UPDATE_AVAILABLE ||
              autoUpdaterStatus === ipc.UPDATE_PROGRESS
            "
            icon="download"
            variant="info"
          />
          <b-icon
            v-else-if="autoUpdaterStatus === ipc.UPDATE_NOT_AVAILABLE"
            icon="check"
            variant="success"
          />
          <b-icon
            v-else-if="autoUpdaterStatus === ipc.UPDATE_DOWNLOADED"
            icon="check-all"
            variant="success"
          />
          {{
            $t(`components.footer.updateStatus.${autoUpdaterStatus}`, [
              autoUpdaterNewVersionInfo
                ? autoUpdaterNewVersionInfo.version
                : undefined,
            ])
          }}
        </b-button>
      </small>
    </div>
  </div>
</template>

<script>
import { ipcRenderer, remote, shell } from 'electron';
import ipc from '../ipc';

export default {
  name: 'Footer',
  data() {
    return {
      autoUpdaterStatus: ipc.UPDATE_NOT_AVAILABLE,
      autoUpdaterProgress: {
        bytesPerSecond: undefined,
        percent: undefined,
        transferred: undefined,
        total: undefined,
      },
      autoUpdaterNewVersionInfo: undefined,
    };
  },
  computed: {
    appVersion: () => remote.app.getVersion(),
    appMode: () => process.env.NODE_ENV,
    ipc: () => ipc,
    canCheckForUpdates() {
      return (
        this.autoUpdaterStatus === ipc.UPDATE_NOT_AVAILABLE ||
        this.autoUpdaterStatus === ipc.UPDATE_ERROR
      );
    },
  },
  methods: {
    openExternal: shell.openExternal,
    checkForUpdates() {
      ipcRenderer.send(ipc.CHECK_FOR_UPDATES);
    },
  },
  mounted() {
    ipcRenderer.on(ipc.UPDATE_ERROR, (event, error) => {
      console.error('AutoUpdater error', error);
      this.autoUpdaterStatus = ipc.UPDATE_ERROR;

      this.$bvModal.msgBoxOk(
        this.$t('components.footer.notifications.updateError.message', [
          JSON.stringify(error),
        ]),
        {
          title: this.$t('components.footer.notifications.updateError.title'),
        }
      );
    });
    ipcRenderer.on(ipc.CHECKING_FOR_UPDATE, () => {
      this.autoUpdaterStatus = ipc.CHECKING_FOR_UPDATE;
    });
    ipcRenderer.on(ipc.UPDATE_AVAILABLE, () => {
      this.autoUpdaterStatus = ipc.UPDATE_AVAILABLE;
    });
    ipcRenderer.on(ipc.UPDATE_NOT_AVAILABLE, () => {
      this.autoUpdaterStatus = ipc.UPDATE_NOT_AVAILABLE;
    });
    ipcRenderer.on(ipc.UPDATE_PROGRESS, (event, progress) => {
      this.autoUpdaterStatus = ipc.UPDATE_PROGRESS;
      this.autoUpdaterProgress = progress;
    });
    ipcRenderer.on(ipc.UPDATE_DOWNLOADED, async (event, info) => {
      this.autoUpdaterStatus = ipc.UPDATE_DOWNLOADED;
      this.autoUpdaterNewVersionInfo = info;

      const message = [
        this.$createElement(
          'p',
          this.$t('components.footer.notifications.updateDownloaded.message', [
            info.version,
            new Date(info.releaseDate).toLocaleString(this.$i18n.locale),
          ])
        ),
        this.$createElement('p', {
          domProps: {
            innerHTML: info.releaseNotes,
          },
        }),
      ];

      const response = await this.$bvModal.msgBoxConfirm(message, {
        title: this.$t(
          'components.footer.notifications.updateDownloaded.title',
          [info.version]
        ),
        okTitle: this.$t(
          'components.footer.notifications.updateDownloaded.okTitle'
        ),
        cancelTitle: this.$t(
          'components.footer.notifications.updateDownloaded.cancelTitle'
        ),
      });

      if (response) ipcRenderer.send(ipc.QUIT_AND_INSTALL);
    });
  },
};
</script>

<style scoped>
div {
  box-shadow: 0 -0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}
.progress {
  border-radius: 0;
}
</style>
