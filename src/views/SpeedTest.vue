<template>
  <div>
    <b-container fluid>
      <b-card
        :title="$t('views.speedTest.sections.terms.title')"
        :sub-title="$t('views.speedTest.sections.terms.subTitle')"
        class="mb-4"
      >
        <p>{{ $t('views.speedTest.sections.terms.description') }}</p>

        <b-form>
          <b-form-checkbox v-model="acceptLicense" switch required>
            <b-link
              @click="openExternal('https://www.speedtest.net/about/terms')"
            >
              {{ $t('views.speedTest.sections.terms.acceptLicenseLabel') }}
            </b-link>
          </b-form-checkbox>
          <b-form-checkbox v-model="acceptGdpr" switch required>
            <b-link
              @click="openExternal('https://www.speedtest.net/about/privacy')"
            >
              {{ $t('views.speedTest.sections.terms.acceptGdprLabel') }}
            </b-link>
          </b-form-checkbox>
          <hr />
          <b-progress
            v-if="progress"
            :value="progress"
            :max="1"
            :animated="progress < 1"
            height="38px"
          />
          <b-button
            v-else
            @click="start"
            :disabled="!acceptLicense || !acceptGdpr"
            variant="primary"
            block
          >
            {{ $t('views.speedTest.startButton') }}
          </b-button>
        </b-form>
      </b-card>

      <b-card v-if="testStart" no-body>
        <b-tabs fill pills card small>
          <b-tab :title="$t('views.speedTest.sections.bandwidth.title')">
            <dl class="row align-items-center mb-0">
              <dt class="col-sm-3">
                <b-avatar
                  src="/images/icons/icons8-network-cable.svg"
                  variant="transparent"
                  class="mr-2"
                  square
                />
                {{ $t('views.speedTest.sections.bandwidth.isp') }}
              </dt>
              <dd class="col-sm-9 mb-0">{{ testStart.isp }}</dd>
              <dt class="col-sm-3">
                <b-avatar
                  src="/images/icons/icons8-timetable.svg"
                  variant="transparent"
                  class="mr-2"
                  square
                />
                {{ $t('views.speedTest.sections.bandwidth.date') }}
              </dt>
              <dd class="col-sm-9 mb-0">
                {{ new Date(testStart.timestamp).toLocaleString() }}
              </dd>
              <dt class="col-sm-3">
                <b-avatar
                  src="/images/icons/icons8-time.svg"
                  variant="transparent"
                  class="mr-2"
                  square
                />
                {{ $t('views.speedTest.sections.bandwidth.ping') }}
              </dt>
              <dd class="col-sm-9 mb-0">{{ ping | number('0,0') }} ms</dd>
              <dt class="col-sm-3">
                <b-avatar
                  src="/images/icons/icons8-vertical-timeline.svg"
                  variant="transparent"
                  class="mr-2"
                  square
                />
                {{ $t('views.speedTest.sections.bandwidth.jitter') }}
              </dt>
              <dd class="col-sm-9 mb-0">{{ jitter | number('0,0') }} ms</dd>
              <dt class="col-sm-3">
                <b-avatar
                  src="/images/icons/icons8-download.svg"
                  variant="transparent"
                  class="mr-2"
                  square
                />
                {{ $t('views.speedTest.sections.bandwidth.download') }}
              </dt>
              <dd class="col-sm-9 mb-0">
                <b-progress :max="1">
                  <b-progress-bar
                    :value="downloadProgress"
                    :animated="downloadProgress < 1"
                  >
                    {{ download | bytes }}/s
                  </b-progress-bar>
                </b-progress>
              </dd>
              <dd class="col-12">
                <apexchart
                  :options="downloadChartOptions"
                  :series="downloadChartSeries"
                  type="line"
                  height="200"
                />
              </dd>
              <dt class="col-sm-3">
                <b-avatar
                  src="/images/icons/icons8-upload.svg"
                  variant="transparent"
                  class="mr-2"
                  square
                />
                {{ $t('views.speedTest.sections.bandwidth.upload') }}
              </dt>
              <dd class="col-sm-9 mb-0">
                <b-progress :max="1">
                  <b-progress-bar
                    :value="uploadProgress"
                    :animated="uploadProgress < 1"
                  >
                    {{ upload | bytes }}/s
                  </b-progress-bar>
                </b-progress>
              </dd>
              <dd class="col-12">
                <apexchart
                  :options="uploadChartOptions"
                  :series="uploadChartSeries"
                  type="line"
                  height="200"
                />
              </dd>
            </dl>
          </b-tab>
          <b-tab :title="$t('views.speedTest.sections.interface.title')">
            <dl class="row align-items-center mb-0">
              <dt class="col-sm-3">
                <b-avatar
                  src="/images/icons/icons8-web-address.svg"
                  variant="transparent"
                  class="mr-2"
                  square
                />
                {{ $t('views.speedTest.sections.interface.lan') }}
              </dt>
              <dd class="col-sm-9 mb-0">
                {{ testStart.interface.internalIp }}
              </dd>
              <dt class="col-sm-3">
                <b-avatar
                  src="/images/icons/icons8-web-address.svg"
                  variant="transparent"
                  class="mr-2"
                  square
                />
                {{ $t('views.speedTest.sections.interface.wan') }}
              </dt>
              <dd class="col-sm-9 mb-0">
                {{ testStart.interface.externalIp }}
              </dd>
              <dt class="col-sm-3">
                <b-avatar
                  src="/images/icons/icons8-vpn.svg"
                  variant="transparent"
                  class="mr-2"
                  square
                />
                {{ $t('views.speedTest.sections.interface.vpn') }}
              </dt>
              <dd class="col-sm-9 mb-0">
                {{ $t(testStart.interface.isVpn ? 'common.yes' : 'common.no') }}
              </dd>
              <dt class="col-sm-3">
                <b-avatar
                  src="/images/icons/icons8-network-card.svg"
                  variant="transparent"
                  class="mr-2"
                  square
                />
                {{ $t('views.speedTest.sections.interface.mac') }}
              </dt>
              <dd class="col-sm-9 mb-0">{{ testStart.interface.macAddr }}</dd>
            </dl>
          </b-tab>
          <b-tab :title="$t('views.speedTest.sections.server.title')">
            <dl class="row align-items-center mb-0">
              <dt class="col-sm-3">
                <b-avatar
                  src="/images/icons/icons8-ookla-speedtest.svg"
                  variant="transparent"
                  class="mr-2"
                  square
                />
                {{ $t('views.speedTest.sections.server.name') }}
              </dt>
              <dd class="col-sm-9 mb-0">{{ testStart.server.name }}</dd>
              <dt class="col-sm-3">
                <b-avatar
                  src="/images/icons/icons8-location.svg"
                  variant="transparent"
                  class="mr-2"
                  square
                />
                {{ $t('views.speedTest.sections.server.location') }}
              </dt>
              <dd class="col-sm-9 mb-0">{{ testStart.server.location }}</dd>
              <dt class="col-sm-3">
                <b-avatar
                  src="/images/icons/icons8-country.svg"
                  variant="transparent"
                  class="mr-2"
                  square
                />
                {{ $t('views.speedTest.sections.server.country') }}
              </dt>
              <dd class="col-sm-9 mb-0">{{ testStart.server.country }}</dd>
              <dt class="col-sm-3">
                <b-avatar
                  src="/images/icons/icons8-server.svg"
                  variant="transparent"
                  class="mr-2"
                  square
                />
                {{ $t('views.speedTest.sections.server.host') }}
              </dt>
              <dd class="col-sm-9 mb-0">
                {{ testStart.server.host }}:{{ testStart.server.port }}
              </dd>
              <dt class="col-sm-3">
                <b-avatar
                  src="/images/icons/icons8-web-address.svg"
                  variant="transparent"
                  class="mr-2"
                  square
                />
                {{ $t('views.speedTest.sections.server.ip') }}
              </dt>
              <dd class="col-sm-9 mb-0">{{ testStart.server.ip }}</dd>
            </dl>
          </b-tab>
        </b-tabs>
      </b-card>
    </b-container>
  </div>
</template>

<script>
import { shell } from 'electron';
import st from 'speedtest-net';

export default {
  name: 'SpeedTest',
  data() {
    return {
      acceptLicense: false,
      acceptGdpr: false,
      testStart: null,
      pings: [],
      downloads: [],
      uploads: [],
      progress: 0,
    };
  },
  computed: {
    downloadChartOptions() {
      return {
        chart: {
          toolbar: {
            tools: {
              download: false,
            },
          },
        },
        stroke: {
          curve: 'smooth',
        },
        xaxis: {
          categories: this.downloads.map((v) =>
            new Date(v.timestamp).toLocaleTimeString()
          ),
          labels: {
            show: false,
          },
        },
        yaxis: {
          labels: {
            formatter: (value) => {
              return this.$options.filters.bytes(value) + '/s';
            },
          },
        },
      };
    },
    downloadChartSeries() {
      return [
        {
          name: this.$t('views.speedTest.sections.bandwidth.download'),
          data: this.downloads.map((v) => v.download.bandwidth),
        },
      ];
    },
    uploadChartOptions() {
      return {
        chart: {
          toolbar: {
            tools: {
              download: false,
            },
          },
        },
        stroke: {
          curve: 'smooth',
        },
        xaxis: {
          categories: this.uploads.map((v) =>
            new Date(v.timestamp).toLocaleTimeString()
          ),
          labels: {
            show: false,
          },
        },
        yaxis: {
          labels: {
            formatter: (value) => {
              return this.$options.filters.bytes(value) + '/s';
            },
          },
        },
      };
    },
    uploadChartSeries() {
      return [
        {
          name: this.$t('views.speedTest.sections.bandwidth.upload'),
          data: this.uploads.map((v) => v.upload.bandwidth),
        },
      ];
    },
    ping() {
      return (
        this.pings.reduce((a, b) => a + b.ping.latency, 0) /
          this.pings.length || 0
      );
    },
    jitter() {
      return (
        this.pings.reduce((a, b) => a + b.ping.jitter, 0) / this.pings.length ||
        0
      );
    },
    pingProgress() {
      return this.pings.length
        ? this.pings[this.pings.length - 1].ping.progress
        : 0;
    },
    download() {
      return (
        this.downloads.reduce((a, b) => a + b.download.bandwidth, 0) /
          this.downloads.length || 0
      );
    },
    downloadProgress() {
      return this.downloads.length
        ? this.downloads[this.downloads.length - 1].download.progress
        : 0;
    },
    upload() {
      return (
        this.uploads.reduce((a, b) => a + b.upload.bandwidth, 0) /
          this.uploads.length || 0
      );
    },
    uploadProgress() {
      return this.uploads.length
        ? this.uploads[this.uploads.length - 1].upload.progress
        : 0;
    },
  },
  methods: {
    openExternal: shell.openExternal,
    async start() {
      this.testStart = null;
      this.pings = [];
      this.downloads = [];
      this.uploads = [];
      this.progress = 0;

      await st({
        acceptLicense: this.acceptLicense,
        acceptGdpr: this.acceptGdpr,
        progress: (event) => {
          switch (event.type) {
            case 'testStart': {
              this.testStart = event;
              break;
            }
            case 'ping': {
              this.pings.push(event);
              break;
            }
            case 'download': {
              this.downloads.push(event);
              break;
            }
            case 'upload': {
              this.uploads.push(event);
              break;
            }
          }

          this.progress = event.progress;
        },
      });

      this.progress = 0;
    },
  },
};
</script>
