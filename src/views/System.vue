<template>
  <div>
    <b-container fluid>
      <h1>
        <b-icon icon="gear" />
        {{ $t('views.system.title') }}
      </h1>

      <b-row class="my-2">
        <b-col v-if="cpu && cpuCurrentspeed">
          <h3>{{ $t('views.system.sections.cpu.title') }}</h3>

          <hr />

          <b-card no-body>
            <b-card-header>
              <b-card-title>
                {{ cpu.manufacturer }}
              </b-card-title>
              <b-card-sub-title>
                {{ cpu.brand }}
              </b-card-sub-title>
            </b-card-header>
            <b-card-body>
              <b-avatar
                src="/images/icons/icons8-processor.svg"
                variant="transparent"
                square
              />
              {{
                $t('views.system.sections.cpu.cores', [
                  cpu.cores,
                  cpu.physicalCores,
                ])
              }}
            </b-card-body>
            <b-card-body>
              <b-avatar
                src="/images/icons/icons8-speed.svg"
                variant="transparent"
                square
              />
              {{
                $t('views.system.sections.cpu.speed', [
                  cpuCurrentspeed.min,
                  cpuCurrentspeed.max,
                  cpuCurrentspeed.avg,
                ])
              }}
            </b-card-body>
          </b-card>
        </b-col>

        <b-col v-if="ram">
          <h3>{{ $t('views.system.sections.ram.title') }}</h3>

          <hr />

          <b-card no-body>
            <b-card-header>
              <b-card-title>
                {{ ram.total | bytes }}
              </b-card-title>
              <b-card-sub-title>
                {{ ram.swaptotal | bytes }}
              </b-card-sub-title>
            </b-card-header>
            <b-card-body class="d-flex align-items-center">
              <b-avatar
                src="/images/icons/icons8-memory-slot.svg"
                variant="transparent"
                class="mr-2"
                square
              />
              <b-progress :max="ram.total" class="flex-grow-1">
                <b-progress-bar
                  :value="ram.used"
                  :variant="
                    (ram.used * 100) / ram.total < 90 ? 'success' : 'danger'
                  "
                >
                  <strong>
                    {{ ram.used | bytes }} /
                    {{ ram.total | bytes }}
                  </strong>
                </b-progress-bar>
              </b-progress>
            </b-card-body>
            <b-card-body class="d-flex align-items-center">
              <b-avatar
                src="/images/icons/icons8-archive-folder.svg"
                variant="transparent"
                class="mr-2"
                square
              />
              <b-progress :max="ram.swaptotal" class="flex-grow-1">
                <b-progress-bar
                  :value="ram.swapused"
                  :variant="
                    (ram.swapused * 100) / ram.swaptotal < 90
                      ? 'success'
                      : 'danger'
                  "
                >
                  <strong>
                    {{ ram.swapused | bytes }} /
                    {{ ram.swaptotal | bytes }}
                  </strong>
                </b-progress-bar>
              </b-progress>
            </b-card-body>
          </b-card>
        </b-col>

        <b-col v-if="storage">
          <h3>{{ $t('views.system.sections.storage.title') }}</h3>

          <hr />

          <b-card
            v-for="(fileSystem, id) in storage"
            v-bind:key="id"
            class="my-2"
            no-body
          >
            <b-card-header>
              <b-card-title>
                {{ fileSystem.mount }}
              </b-card-title>
              <b-card-sub-title>
                {{ fileSystem.type }}
              </b-card-sub-title>
            </b-card-header>
            <b-card-body class="d-flex align-items-center">
              <b-avatar
                src="/images/icons/icons8-ssd.svg"
                variant="transparent"
                class="mr-2"
                square
              />
              <b-progress class="flex-grow-1">
                <b-progress-bar
                  :value="fileSystem.use"
                  :variant="fileSystem.use < 90 ? 'success' : 'danger'"
                >
                  <strong>
                    {{ fileSystem.used | bytes }} /
                    {{ fileSystem.size | bytes }}
                  </strong>
                </b-progress-bar>
              </b-progress>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>

      <b-row>
        <b-col v-if="processes">
          <h3>{{ $t('views.system.sections.processes.title') }}</h3>

          <hr />

          <b-alert variant="warning" show>
            <b-icon icon="tools" />
            {{ $t('views.system.sections.processes.experimentalWarning') }}
          </b-alert>

          <h5>{{ $t('views.system.sections.processes.tree.title') }}</h5>
          <b-card bg-variant="dark">
            <tree-view :tree="processesTree" />
          </b-card>

          <br />

          <h5>{{ $t('views.system.sections.processes.graph.title') }}</h5>
          <b-card v-dragscroll class="overflow-auto">
            <vue-mermaid
              :nodes="processesGraph"
              :config="mermaidConfig"
              type="graph LR"
            />
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import SystemInformation from 'systeminformation';

export default {
  name: 'System',
  data() {
    return {
      cpu: undefined,
      cpuCurrentspeed: undefined,
      ram: undefined,
      storage: undefined,
      processes: undefined,
      mermaidConfig: {
        theme: 'neutral',
      },
    };
  },
  computed: {
    processesTree() {
      if (this.processes) {
        const flat = this.processes.list.map((proc) => {
          return {
            id: proc.pid,
            parent: proc.parentPid,
            text: `[${proc.pid}] ${proc.name}`,
          };
        });
        const root = [];
        const map = {};

        flat.forEach((node) => {
          try {
            if (!flat.find((proc) => proc.id == node.parent))
              return root.push(node);

            let parentIndex = map[node.parent];
            if (typeof parentIndex !== 'number') {
              parentIndex = flat.findIndex((el) => el.id === node.parent);
              map[node.parent] = parentIndex;
            }

            if (!flat[parentIndex].nodes) {
              return (flat[parentIndex].nodes = [node]);
            }

            flat[parentIndex].nodes.push(node);
          } catch (error) {
            console.error(error);
          }
        });

        return root;
      } else {
        return [];
      }
    },
    processesGraph() {
      return this.processes.list
        .filter((proc) => proc.pid !== proc.parentPid)
        .map((proc) => {
          const parentProc = this.processes.list.find(
            (parent) => parent.pid == proc.parentPid
          );
          const parentProcName = parentProc ? parentProc.name : 'NA';

          return {
            id: proc.pid,
            text: `"[${proc.pid}] ${proc.name}"`,
            link: `-- ${this.$t(
              'views.system.sections.processes.graph.linkLabel',
              [parentProcName, new Date(proc.started).toLocaleString()]
            )} -->`,
            next: [proc.parentPid],
            group: `"[${proc.parentPid}]"`,
          };
        });
    },
  },
  methods: {
    async refresh() {
      this.cpu = await SystemInformation.cpu();
      this.cpuCurrentspeed = await SystemInformation.cpuCurrentspeed();
      this.ram = await SystemInformation.mem();
      this.storage = await SystemInformation.fsSize();

      setTimeout(await this.refresh, 3000);
    },
  },
  async mounted() {
    await this.refresh();

    this.processes = await SystemInformation.processes();
  },
};
</script>

<style scoped>
#ll931217-vue-treeview {
  background-color: transparent;
  box-shadow: none;
  padding: 0;
}
</style>
