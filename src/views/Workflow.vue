<template>
  <div>
    <b-sidebar
      @change="saveSettings"
      id="workflow"
      width="33%"
      bg-variant="dark"
      text-variant="light"
      :title="$t('views.workflow.title')"
      no-header-close
      backdrop
      shadow
    >
      <b-container class="py-4" fluid>
        <draggable
          v-model="executables"
          v-bind="dragOptions"
          @start="drag = true"
          @end="drag = false"
        >
          <b-card
            v-for="(executable, id) in executables"
            v-bind:key="id"
            text-variant="dark"
            no-body
            class="my-2"
          >
            <b-card-body>
              <b-card-title>{{ getBaseName(executable.command) }}</b-card-title>
              <b-form>
                <b-form-group :disabled="isAnExecutableRunning">
                  <b-form-group
                    :label="
                      $t('views.workflow.sections.workflowSidebar.commandLabel')
                    "
                    :label-for="`command-${id}`"
                  >
                    <b-input-group>
                      <b-form-input
                        v-model="executable.command"
                        :id="`command-${id}`"
                      />
                      <b-input-group-append>
                        <b-button @click="editExecutableFile(executable)">
                          <b-icon icon="folder-symlink" />
                        </b-button>
                      </b-input-group-append>
                    </b-input-group>
                  </b-form-group>

                  <b-form-group
                    :label="
                      $t('views.workflow.sections.workflowSidebar.argsLabel')
                    "
                    :label-for="`args-${id}`"
                  >
                    <b-form-tags
                      v-model="executable.args"
                      :input-id="`args-${id}`"
                      :placeholder="
                        $t(
                          'views.workflow.sections.workflowSidebar.argsPlaceholder'
                        )
                      "
                    />
                  </b-form-group>

                  <b-form-group
                    :label="
                      $t('views.workflow.sections.workflowSidebar.delayLabel')
                    "
                    :label-for="`delay-${id}`"
                  >
                    <b-form-spinbutton
                      v-model="executable.delay"
                      min="0"
                      step="500"
                      max="10000"
                      :id="`delay-${id}`"
                    />
                  </b-form-group>

                  <b-form-group
                    :label="
                      $t(
                        'views.workflow.sections.workflowSidebar.hideWindowLabel'
                      )
                    "
                    :label-for="`hide-window-${id}`"
                  >
                    <b-form-select
                      v-model="executable.hideWindow"
                      :id="`hide-window-${id}`"
                    >
                      <b-form-select-option :value="false">
                        {{ $t('common.no') }}
                      </b-form-select-option>
                      <b-form-select-option :value="true">
                        {{ $t('common.yes') }}
                      </b-form-select-option>
                    </b-form-select>
                  </b-form-group>
                </b-form-group>
              </b-form>
            </b-card-body>

            <b-card-footer>
              <b-button-group class="w-100" size="sm">
                <b-button
                  @click="remove(executable)"
                  :disabled="isAnExecutableRunning"
                  variant="outline-danger"
                >
                  <b-icon icon="trash" />
                  {{
                    $t('views.workflow.sections.workflowSidebar.removeButton')
                  }}
                </b-button>
              </b-button-group>
            </b-card-footer>
          </b-card>
        </draggable>

        <b-button
          @click="add"
          :disabled="isAnExecutableRunning"
          variant="primary"
          block
        >
          <b-icon icon="file-plus" />
          {{ $t('views.workflow.sections.workflowSidebar.addButton') }}
        </b-button>
      </b-container>
    </b-sidebar>

    <b-container fluid>
      <h1>
        <b-icon icon="collection" />
        {{ $t('views.workflow.title') }}
      </h1>

      <b-alert :show="isStarting" variant="info">
        <b-icon icon="lock" />
        {{ $t('views.workflow.sections.settings.isStarting') }}
      </b-alert>

      <b-alert :show="isAnExecutableRunning" variant="warning">
        <b-icon icon="lock" />
        {{ $t('views.workflow.sections.settings.isAnExecutableRunning') }}
      </b-alert>

      <b-row>
        <b-col cols="12" class="my-2">
          <h3>{{ $t('views.workflow.sections.settings.title') }}</h3>

          <hr />

          <b-row>
            <b-col cols="4">
              <b-button
                v-b-toggle.workflow
                :disabled="isAnExecutableRunning"
                variant="primary"
                block
              >
                <b-icon icon="arrow-left-right" />
                {{ $t('views.workflow.sections.settings.editWorkflowButton') }}
              </b-button>
            </b-col>
            <b-col>
              <b-form-group :disabled="isStarting">
                <b-button-group class="w-100 mb-3">
                  <b-button
                    @click="startAll"
                    :disabled="executables.length === 0"
                    variant="success"
                  >
                    <b-icon icon="play-fill" />
                    {{ $t('views.workflow.sections.settings.startAllButton') }}
                  </b-button>
                  <b-button
                    @click="stopAll"
                    :disabled="executables.length === 0"
                    variant="danger"
                  >
                    <b-icon icon="stop-fill" />
                    {{ $t('views.workflow.sections.settings.stopAllButton') }}
                  </b-button>
                </b-button-group>
              </b-form-group>
            </b-col>
          </b-row>
        </b-col>

        <b-col cols="12" class="my-2">
          <h3>{{ $t('views.workflow.sections.processes.title') }}</h3>

          <hr />

          <b-card v-if="executables.length > 0" no-body>
            <b-tabs fill pills card small>
              <b-tab v-for="(executable, id) in executables" v-bind:key="id">
                <template v-slot:title>
                  <b-spinner v-if="executable.process" type="grow" small />
                  {{ getBaseName(executable.command) }}
                  <b-icon v-if="executable.delay" icon="clock-history" />
                </template>

                <b-form-group :disabled="isStarting">
                  <b-button-group class="w-100 my-2">
                    <b-button
                      @click="sequentialStart(executable)"
                      :disabled="Boolean(executable.process)"
                      variant="success"
                    >
                      <b-icon icon="play-fill" />
                      {{
                        $t(
                          'views.workflow.sections.processes.sequentialStartButton'
                        )
                      }}
                    </b-button>
                    <b-button
                      @click="sequentialStop(executable)"
                      :disabled="!Boolean(executable.process)"
                      variant="danger"
                    >
                      <b-icon icon="stop-fill" />
                      {{
                        $t(
                          'views.workflow.sections.processes.sequentialStopButton'
                        )
                      }}
                    </b-button>
                  </b-button-group>

                  <b-button-group class="w-100 my-2">
                    <b-button
                      @click="start(executable)"
                      :disabled="Boolean(executable.process)"
                      variant="outline-success"
                    >
                      <b-icon icon="play" />
                      {{ $t('views.workflow.sections.processes.startButton') }}
                    </b-button>
                    <b-button
                      @click="restart(executable)"
                      :disabled="!Boolean(executable.process)"
                      variant="outline-info"
                    >
                      <b-icon icon="arrow-clockwise" />
                      {{
                        $t('views.workflow.sections.processes.restartButton')
                      }}
                    </b-button>
                    <b-button
                      @click="stop(executable)"
                      :disabled="!Boolean(executable.process)"
                      variant="outline-danger"
                    >
                      <b-icon icon="stop" />
                      {{ $t('views.workflow.sections.processes.stopButton') }}
                    </b-button>
                  </b-button-group>
                </b-form-group>

                <b-form @submit.prevent="send(executable)">
                  <b-form-group
                    :label="$t('views.workflow.sections.processes.stdinLabel')"
                    label-for="stdin"
                    label-cols="4"
                  >
                    <b-input-group>
                      <b-form-input
                        v-model="stdin"
                        :disabled="Boolean(!executable.process)"
                        id="stdin"
                      />
                      <b-input-group-append>
                        <b-button
                          @click="send(executable)"
                          :disabled="Boolean(!executable.process)"
                          variant="primary"
                          block
                        >
                          <b-icon icon="reply" />
                        </b-button>
                      </b-input-group-append>
                    </b-input-group>
                  </b-form-group>
                </b-form>

                <b-form class="my-2">
                  <b-form-group
                    :label="
                      $t(
                        'views.workflow.sections.processes.metricsIntervalLabel'
                      )
                    "
                    label-for="metrics-interval"
                    label-cols="4"
                  >
                    <b-form-spinbutton
                      v-model="metricsSettings.interval"
                      @change="saveSettings"
                      min="1000"
                      step="1000"
                      max="10000"
                      id="metrics-interval"
                    />
                  </b-form-group>

                  <b-form-group
                    :label="
                      $t('views.workflow.sections.processes.metricsPointsLabel')
                    "
                    label-for="metrics-points"
                    label-cols="4"
                  >
                    <b-form-spinbutton
                      v-model="metricsSettings.points"
                      @change="saveSettings"
                      min="5"
                      max="100"
                      id="metrics-points"
                    />
                  </b-form-group>

                  <p>
                    {{
                      $t('views.workflow.sections.processes.metricsSpan', [
                        metricsSpan,
                      ])
                    }}
                  </p>
                </b-form>

                <b-card title="CPU / RAM" class="my-2">
                  <b-card-sub-title v-if="executable.metrics.length > 0">
                    {{
                      $t('views.workflow.sections.processes.cpuUsage', [
                        vueFilters.percent(getLastCpuUsage(executable), 2),
                        vueFilters.percent(getAverageCpuUsage(executable), 2),
                      ])
                    }}
                    /
                    {{
                      $t('views.workflow.sections.processes.ramUsage', [
                        vueFilters.bytes(getLastRamUsage(executable)),
                        vueFilters.bytes(getAverageRamUsage(executable)),
                      ])
                    }}
                  </b-card-sub-title>
                  <process-metrics-chart
                    v-if="getChartData(executable)"
                    :chartData="getChartData(executable)"
                    class="metrics-chart"
                  />
                  <p v-else>
                    {{ $t('views.workflow.sections.processes.noMetric') }}
                  </p>
                </b-card>

                <b-list-group class="my-2">
                  <b-list-group-item
                    v-for="(log, id) in executable.logs"
                    v-bind:key="id"
                    class="d-flex justify-content-between align-items-center"
                  >
                    <code class="text-dark">{{ log.data }}</code>
                    <b-badge :variant="getLogVariant(log.type)" pill>
                      {{ log.type }}
                    </b-badge>
                  </b-list-group-item>
                </b-list-group>
              </b-tab>
            </b-tabs>
          </b-card>
          <b-alert :show="executables.length === 0" variant="info">
            <b-icon icon="info" />
            {{ $t('views.workflow.sections.processes.noExecutable') }}
          </b-alert>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { remote } from 'electron';
import { spawn } from 'child_process';
import path from 'path';
import kill from 'tree-kill';
import pidUsage from 'pidusage';
import prettyMs from 'pretty-ms';
import SystemInformation from 'systeminformation';
import SettingsManager from '@/utils/SettingsManager';
import ProcessMetricsChart from '@/components/Workflow/ProcessMetricsChart';
import Executable from '@/models/Executable';

export default {
  name: 'Workflow',
  components: {
    ProcessMetricsChart,
  },
  data() {
    return {
      executables: [],
      stdin: null,
      cpuCores: 1,
      metricsSettings: {
        interval: 1000,
        points: 5,
      },
      isStarting: false,
    };
  },
  computed: {
    isAnExecutableRunning() {
      return (
        this.executables.filter((executable) => executable.process).length > 0
      );
    },
    dragOptions() {
      return {
        disabled: this.isAnExecutableRunning,
      };
    },
    metricsSpan() {
      return prettyMs(
        this.metricsSettings.interval * this.metricsSettings.points
      );
    },
    vueFilters() {
      return this.$options.filters;
    },
  },
  methods: {
    getBaseName: path.basename,
    add() {
      this.executables.push(new Executable());
    },
    remove(executable) {
      this.executables.splice(this.executables.indexOf(executable), 1);
    },
    saveSettings() {
      SettingsManager.setExecutables(
        this.executables.map((executable) => executable.getSavableObject())
      );
      SettingsManager.setMetricsSettings(this.metricsSettings);
    },
    async editExecutableFile(executable) {
      const result = await remote.dialog.showOpenDialog({
        defaultPath: path.dirname(executable.command),
        properties: ['openFile'],
        filters: [{ name: 'exe', extensions: ['exe'] }],
      });

      if (!result.canceled && result.filePaths.length > 0) {
        executable.reset();
        executable.command = result.filePaths[0];
      }
    },
    start(executable) {
      if (!executable.process) {
        executable.process = null;
        executable.metrics = [];
        executable.logs = [];

        executable.process = spawn(executable.command, executable.args, {
          cwd: path.dirname(executable.command),
          windowsHide: executable.hideWindow,
        });

        executable.process.stdout.on('data', (data) => {
          executable.logs.push({
            type: 'stdout',
            data: Buffer.from(data).toString(this.encoding),
          });
        });

        executable.process.stderr.on('data', (data) => {
          executable.logs.push({
            type: 'stderr',
            data: Buffer.from(data).toString(this.encoding),
          });
        });

        executable.process.on('exit', (data) => {
          executable.logs.push({
            type: 'exit',
            data,
          });
          executable.process = null;
        });
      }
    },
    async sequentialStart(executable) {
      this.isStarting = true;
      for (const child of this.executables.slice(
        0,
        this.executables.indexOf(executable) + 1
      )) {
        if (!child.process) {
          await new Promise((resolve) => setTimeout(resolve, child.delay));
        }
        this.start(child);
      }
      this.isStarting = false;
    },
    startAll() {
      this.sequentialStart(this.executables[this.executables.length - 1]);
    },
    stop(executable) {
      if (executable.process) {
        kill(executable.process.pid);
        executable.process = null;
      }
    },
    async sequentialStop(executable) {
      for (const child of this.executables
        .slice(this.executables.indexOf(executable))
        .reverse()) {
        this.stop(child);
      }
    },
    stopAll() {
      this.sequentialStop(this.executables[0]);
    },
    restart(executable) {
      this.stop(executable);
      setTimeout(() => this.start(executable), 500);
    },
    send(executable) {
      executable.process.stdin.write(this.stdin);

      executable.logs.push({
        type: 'stdin',
        data: this.stdin,
      });
    },
    getLogVariant(type) {
      switch (type) {
        case 'stdout':
          return 'success';
        case 'stderr':
          return 'danger';
        case 'exit':
          return 'warning';
        default:
          return 'secondary';
      }
    },
    async monitorExecutables() {
      for (const executable of this.executables) {
        if (executable.process) {
          executable.metrics.push(await pidUsage(executable.process.pid));
        }
      }

      setTimeout(this.monitorExecutables, this.metricsSettings.interval);
    },
    getLastCpuUsage(executable) {
      return executable.metrics.length > 0
        ? executable.metrics.slice(-1)[0].cpu / (100 * this.cpuCores)
        : null;
    },
    getAverageCpuUsage(executable) {
      return executable.metrics.length > 0
        ? executable.metrics.reduce(
            (previous, current) => previous + current.cpu,
            0
          ) /
            executable.metrics.length /
            (100 * this.cpuCores)
        : null;
    },
    getLastRamUsage(executable) {
      return executable.metrics.length > 0
        ? executable.metrics.slice(-1)[0].memory
        : null;
    },
    getAverageRamUsage(executable) {
      return executable.metrics.length > 0
        ? executable.metrics.reduce(
            (previous, current) => previous + current.memory,
            0
          ) / executable.metrics.length
        : null;
    },
    getChartData(executable) {
      const metricsCount = executable.metrics.length;

      if (metricsCount > 0) {
        const labels = executable.metrics
          .map((metric) => new Date(metric.timestamp).toLocaleTimeString())
          .slice(Math.max(metricsCount - this.metricsSettings.points, 0));

        const datasets = [
          {
            label: 'CPU',
            yAxisID: 'CPU',
            borderColor: '#3b4545',
            backgroundColor: 'transparent',
            data: executable.metrics
              .map((metric) => metric.cpu / 100 / this.cpuCores)
              .slice(Math.max(metricsCount - this.metricsSettings.points, 0)),
          },
          {
            label: 'RAM',
            yAxisID: 'RAM',
            borderColor: '#008080',
            backgroundColor: 'transparent',
            data: executable.metrics
              .map((metric) => metric.memory)
              .slice(Math.max(metricsCount - this.metricsSettings.points, 0)),
          },
        ];

        return {
          labels,
          datasets,
        };
      }
      return null;
    },
  },
  async mounted() {
    const executables = SettingsManager.getExecutables();
    if (executables)
      this.executables = executables.map(
        (executable) =>
          new Executable(executable.args, executable.command, executable.delay)
      );

    const metricsSettings = SettingsManager.getMetricsSettings();
    if (metricsSettings) this.metricsSettings = metricsSettings;

    this.cpuCores = (await SystemInformation.cpu()).cores;

    this.monitorExecutables();
  },
};
</script>

<style scoped>
.metrics-chart {
  height: 200px;
}
</style>
