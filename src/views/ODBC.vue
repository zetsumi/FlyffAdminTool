<template>
  <div>
    <b-container fluid>
      <h1>
        <b-icon icon="layers" />
        {{ $t('views.odbc.title') }}
      </h1>

      <b-row class="my-2">
        <b-col>
          <h3>{{ $t('views.odbc.sections.filter.title') }}</h3>
          <b-alert variant="info" show>
            <b-icon icon="info" />
            {{ $t('views.odbc.sections.filter.subtitle') }}
          </b-alert>

          <hr />

          <b-form>
            <b-form-group
              :label="$t('views.odbc.sections.filter.textLabel')"
              label-for="filter-text"
            >
              <b-form-input v-model="filter.text" id="filter-text" />
            </b-form-group>

            <b-form-group
              :label="$t('views.odbc.sections.filter.activeDriversOnlyLabel')"
              label-for="filter-active-drivers-only"
            >
              <b-form-select
                v-model="filter.activeDriversOnly"
                id="filter-active-drivers-only"
              >
                <b-form-select-option :value="true">
                  {{ $t('common.yes') }}
                </b-form-select-option>
                <b-form-select-option :value="false">
                  {{ $t('common.no') }}
                </b-form-select-option>
              </b-form-select>
            </b-form-group>
          </b-form>
        </b-col>
      </b-row>

      <b-row class="my-2">
        <b-col>
          <h3>{{ $t('views.odbc.sections.dataSourceNames.title') }}</h3>
          <b-alert variant="info" show>
            <b-icon icon="info" />
            {{ $t('views.odbc.sections.dataSourceNames.subtitle') }}
          </b-alert>
          <b-button
            @click="
              openExternal('https://www.connectionstrings.com/sql-server/')
            "
            variant="primary"
            block
          >
            <b-icon icon="book" />
            {{ $t('views.odbc.sections.dataSourceNames.documentationButton') }}
          </b-button>

          <hr />

          <b-card
            v-for="(dataSource, id) in filteredDatasources"
            v-bind:key="id"
            class="my-2"
            no-body
          >
            <b-card-header>
              <b-card-title>
                {{ dataSource.Name }}
              </b-card-title>
              <b-card-sub-title>
                {{ dataSource.Platform }}
              </b-card-sub-title>
            </b-card-header>
            <b-card-body class="d-flex align-items-center">
              <b-avatar
                src="/images/icons/icons8-plugin.svg"
                variant="transparent"
                size="sm"
                class="mr-2"
                square
              />
              <span class="flex-grow-1">
                {{ dataSource.DriverName }}
              </span>
            </b-card-body>
            <b-card-body>
              <code>
                {{ getConnectionString(dataSource) }}
              </code>
            </b-card-body>
            <b-card-footer>
              <b-button-group size="sm" class="w-100">
                <b-button
                  @click="testConnection(dataSource)"
                  variant="outline-primary"
                >
                  <b-icon icon="plug" />
                  {{ $t('views.odbc.sections.dataSourceNames.testButton') }}
                </b-button>
                <b-button
                  @click="copyConnectionString(dataSource)"
                  variant="outline-secondary"
                >
                  <b-icon icon="link" />
                  {{ $t('views.odbc.sections.dataSourceNames.copyButton') }}
                </b-button>
              </b-button-group>
            </b-card-footer>
          </b-card>
          <b-alert :show="!filteredDatasources.length" variant="warning">
            <b-icon icon="exclamation-triangle" />
            {{ $t('views.odbc.sections.dataSourceNames.empty') }}
          </b-alert>
        </b-col>

        <b-col>
          <h3>{{ $t('views.odbc.sections.drivers.title') }}</h3>
          <b-alert variant="info" show>
            <b-icon icon="info" />
            {{ $t('views.odbc.sections.drivers.subtitle') }}
          </b-alert>
          <b-button
            @click="
              openExternal(
                'https://docs.microsoft.com/en-us/sql/connect/odbc/windows/release-notes-odbc-sql-server-windows'
              )
            "
            variant="primary"
            block
          >
            <b-icon icon="download" />
            {{ $t('views.odbc.sections.drivers.downloadButton') }}
          </b-button>

          <hr />
          <b-card
            v-for="(driver, id) in filteredDrivers"
            v-bind:key="id"
            class="my-2"
            :variant="isDriverUsed(driver) ? '' : 'secondary'"
            no-body
          >
            <b-card-header>
              <b-card-title>
                {{ driver.Name }}
              </b-card-title>
              <b-card-sub-title>
                {{ driver.Platform }}
              </b-card-sub-title>
            </b-card-header>
            <b-card-body class="d-flex align-items-center">
              <b-avatar
                src="/images/icons/icons8-search-folder.svg"
                variant="transparent"
                size="sm"
                class="mr-2"
                square
              />
              <span class="flex-grow-1">
                {{ driver.Attribute.Setup }}
              </span>
            </b-card-body>
          </b-card>
          <b-alert :show="!filteredDrivers.length" variant="warning">
            <b-icon icon="exclamation-triangle" />
            {{ $t('views.odbc.sections.drivers.empty') }}
          </b-alert>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { shell } from 'electron';
import PowerShell from 'node-powershell';
const ps = new PowerShell({
  executionPolicy: 'Bypass',
  noProfile: true,
});

export default {
  name: 'ODBC',
  data() {
    return {
      filter: {
        text: '',
        activeDriversOnly: true,
      },
      dataSources: [],
      drivers: [],
    };
  },
  computed: {
    filteredDrivers() {
      return this.drivers
        .filter((driver) => {
          return (
            driver.Name &&
            driver.Name.toLowerCase().includes(this.filter.text.toLowerCase())
          );
        })
        .filter((driver) => {
          return this.filter.activeDriversOnly
            ? this.dataSources.filter(
                (dataSource) => dataSource.DriverName === driver.Name
              ).length
            : true;
        });
    },
    filteredDatasources() {
      return this.dataSources.filter(
        (dataSource) =>
          (dataSource.Name &&
            dataSource.Name.toLowerCase().includes(
              this.filter.text.toLowerCase()
            )) ||
          (dataSource.DriverName &&
            dataSource.DriverName.toLowerCase().includes(
              this.filter.text.toLowerCase()
            ))
      );
    },
  },
  methods: {
    openExternal: shell.openExternal,
    async refresh() {
      try {
        ps.addCommand('Get-OdbcDriver | ConvertTo-Json');
        this.drivers = JSON.parse(await ps.invoke());

        ps.addCommand('Get-OdbcDsn | ConvertTo-Json');
        this.dataSources = JSON.parse(await ps.invoke());
      } catch (error) {
        console.error(error);
      }
    },
    getConnectionString(dataSource) {
      let connectionString = `Driver={${dataSource.DriverName}}`;

      for (const attribute in dataSource.Attribute) {
        connectionString += `;${attribute}=${dataSource.Attribute[attribute]}`;
      }

      return connectionString;
    },
    copyConnectionString(dataSource) {
      this.$copyText(this.getConnectionString(dataSource));
    },
    isDriverUsed(driver) {
      return this.dataSources.find(
        (dataSource) => dataSource.DriverName === driver.Name
      );
    },
    async testConnection(dataSource) {
      ps.addCommand('$connection = New-Object System.Data.Odbc.OdbcConnection');
      ps.addCommand(
        `$connection.ConnectionString = "${this.getConnectionString(
          dataSource
        )}"`
      );

      try {
        ps.addCommand('$connection.Open()');
        await ps.invoke();

        this.$bvModal.msgBoxOk(
          this.$t('views.odbc.notifications.testSucceeded.message', [
            dataSource.Name,
          ]),
          {
            title: this.$t('views.odbc.notifications.testSucceeded.title'),
          }
        );
      } catch (error) {
        ps.addCommand('$connection.Close()');
        await ps.invoke();

        this.$bvModal.msgBoxOk(
          this.$t('views.odbc.notifications.testFailed.message', [
            dataSource.Name,
          ]),
          {
            title: this.$t('views.odbc.notifications.testFailed.title'),
          }
        );
      }
    },
  },
  async created() {
    await this.refresh();
  },
};
</script>
