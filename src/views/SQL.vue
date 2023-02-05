<template>
  <div>
    <b-container fluid>
      <h1>
        <b-icon icon="server" />
        {{ $t('views.sql.title') }}
      </h1>

      <b-row class="my-2">
        <b-col>
          <h3>{{ $t('views.sql.sections.connection.title') }}</h3>

          <hr />

          <b-form @submit.prevent="connect">
            <b-card class="mb-2">
              <b-form-group
                :label="$t('views.sql.sections.connection.connectivityLabel')"
                label-size="lg"
                label-cols-lg="2"
                label-class="font-weight-bold pt-0"
                class="mb-0"
              >
                <b-form-group
                  :label="$t('views.sql.sections.connection.driverLabel')"
                  :description="
                    $t('views.sql.sections.connection.driverDescription')
                  "
                >
                  <b-form-input
                    v-model="odbc.driver"
                    list="drivers-list"
                    required
                  />
                  <b-form-datalist id="drivers-list" :options="drivers" />
                </b-form-group>
                <b-form-group
                  :label="$t('views.sql.sections.connection.databaseLabel')"
                  :description="
                    $t('views.sql.sections.connection.databaseDescription')
                  "
                >
                  <b-form-input
                    v-model="odbc.database"
                    list="databases-list"
                    required
                  />
                  <b-form-datalist id="databases-list" :options="databases" />
                </b-form-group>
                <b-form-group
                  :label="$t('views.sql.sections.connection.serverLabel')"
                  :description="
                    $t('views.sql.sections.connection.serverDescription')
                  "
                >
                  <b-form-input
                    v-model="odbc.server"
                    list="servers-list"
                    required
                  />
                  <b-form-datalist id="servers-list" :options="servers" />
                </b-form-group>
              </b-form-group>
            </b-card>

            <b-card>
              <b-form-group
                :label="$t('views.sql.sections.connection.authenticationLabel')"
                label-size="lg"
                label-cols-lg="2"
                label-class="font-weight-bold pt-0"
                class="mb-0"
              >
                <b-form-group
                  :label="
                    $t('views.sql.sections.connection.trustedConnectionLabel')
                  "
                  :description="
                    $t(
                      'views.sql.sections.connection.trustedConnectionDescription'
                    )
                  "
                >
                  <b-form-select v-model="odbc.trustedConnection">
                    <b-form-select-option :value="true">
                      {{ $t('common.yes') }}
                    </b-form-select-option>
                    <b-form-select-option :value="false">
                      {{ $t('common.no') }}</b-form-select-option
                    >
                  </b-form-select>
                </b-form-group>

                <b-form-group
                  v-if="!odbc.trustedConnection"
                  :label="$t('views.sql.sections.connection.usernameLabel')"
                >
                  <b-form-input v-model="odbc.username" />
                </b-form-group>
                <b-form-group
                  v-if="!odbc.trustedConnection"
                  :label="$t('views.sql.sections.connection.passwordLabel')"
                >
                  <b-form-input v-model="odbc.password" />
                </b-form-group>
              </b-form-group>
            </b-card>

            <div class="d-flex my-4">
              <prism
                language="bash"
                :code="connectionString"
                class="my-0 flex-grow-1"
              />
              <b-button type="submit" variant="primary">
                <b-icon icon="link" />
                {{ $t('views.sql.sections.connection.connectButton') }}
              </b-button>
            </div>

            <b-alert :show="Boolean(connection.error)" variant="danger">
              <b-icon icon="exclamation-triangle" />
              {{
                $t('views.sql.sections.connection.connectionError', [
                  connection.error,
                ])
              }}
            </b-alert>
          </b-form>
        </b-col>
      </b-row>

      <b-row class="my-2">
        <b-col>
          <h3>{{ $t('views.sql.sections.workspace.title') }}</h3>
          <b-alert variant="success" :show="isConnected">
            <b-icon icon="check" />
            {{ $t('views.sql.sections.workspace.connected') }}
          </b-alert>
          <b-alert variant="warning" :show="!isConnected">
            <b-icon icon="exclamation-triangle" />
            {{ $t('views.sql.sections.workspace.notConnected') }}
          </b-alert>

          <hr />

          <b-card no-body>
            <b-tabs v-model="activeTab" pills card justified>
              <b-tab :title="$t('views.sql.sections.tables.title')">
                <b-form @submit.prevent="getTables" class="mb-2">
                  <b-form-group
                    :disabled="!isConnected"
                    :label="$t('views.sql.sections.tables.schemaLabel')"
                    :description="
                      $t('views.sql.sections.tables.schemaDescription')
                    "
                  >
                    <b-alert :show="Boolean(tables.error)" variant="danger">
                      <b-icon icon="exclamation-triangle" />
                      {{
                        $t('views.sql.sections.tables.error', [tables.error])
                      }}
                    </b-alert>

                    <b-input-group>
                      <b-form-input v-model="tables.schema" />
                      <b-input-group-append>
                        <b-button type="submit" variant="primary" block>
                          <b-icon icon="table" />
                          {{ $t('views.sql.sections.tables.listButton') }}
                        </b-button>
                      </b-input-group-append>
                    </b-input-group>
                  </b-form-group>
                </b-form>

                <b-alert :show="Boolean(tables.result)" variant="info">
                  <b-icon icon="info" />
                  {{ $t('views.sql.sections.tables.tip') }}
                </b-alert>

                <b-table
                  :items="tables.result"
                  @row-dblclicked="tablesRowClicked"
                  hover
                  borderless
                  show-empty
                />
              </b-tab>
              <b-tab :title="$t('views.sql.sections.procedure.title')">
                <b-form @submit.prevent="getProcedures">
                  <b-form-group :disabled="!isConnected">
                    <b-alert :show="Boolean(procedure.error)" variant="danger">
                      <b-icon icon="exclamation-triangle" />
                      {{
                        $t('views.sql.sections.procedure.error', [
                          procedure.error,
                        ])
                      }}
                    </b-alert>

                    <b-button type="submit" variant="primary" block>
                      <b-icon icon="table" />
                      {{ $t('views.sql.sections.procedure.listButton') }}
                    </b-button>
                  </b-form-group>
                </b-form>

                <b-alert :show="Boolean(procedure.result)" variant="info">
                  <b-icon icon="info" />
                  {{ $t('views.sql.sections.procedure.tip') }}
                </b-alert>

                <b-table
                  :items="procedure.result"
                  @row-dblclicked="proceduresRowClicked"
                  hover
                  borderless
                  show-empty
                />
              </b-tab>
              <b-tab :title="$t('views.sql.sections.query.title')">
                <b-form @submit.prevent="executeQuery">
                  <b-form-group :disabled="!isConnected">
                    <b-form-group
                      :label="$t('views.sql.sections.query.languageLabel')"
                    >
                      <b-form-select
                        v-model="query.language"
                        :options="query.languages"
                      />
                    </b-form-group>

                    <b-row>
                      <b-col>
                        <b-form-group
                          :label="$t('views.sql.sections.query.statementLabel')"
                        >
                          <b-form-textarea
                            v-model="query.request"
                            rows="3"
                            max-rows="8"
                            placeholder="SELECT * FROM dbo.ACCOUNT_TBL"
                          />
                        </b-form-group>
                      </b-col>

                      <b-col>
                        <b-form-group
                          :label="
                            $t('views.sql.sections.query.prettyStatementLabel')
                          "
                        >
                          <prism
                            :language="query.language"
                            :code="query.request"
                            class="my-0"
                          />
                        </b-form-group>
                      </b-col>
                    </b-row>
                    <b-alert :show="Boolean(query.error)" variant="danger">
                      <b-icon icon="exclamation-triangle" />
                      {{
                        $t('views.sql.sections.query.requestError', [
                          query.error,
                        ])
                      }}
                    </b-alert>

                    <b-button type="submit" variant="primary" block>
                      <b-icon icon="lightning" />
                      {{ $t('views.sql.sections.query.executeButton') }}
                    </b-button>
                  </b-form-group>
                </b-form>

                <b-table :items="query.result" borderless show-empty />
              </b-tab>
            </b-tabs>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import odbc from 'odbc';
import OdbcHelper from '../utils/OdbcHelper';

export default {
  data() {
    return {
      activeTab: 0,
      dataSources: [],
      odbc: {
        driver: '',
        database: '',
        server: '',
        trustedConnection: true,
        username: '',
        password: '',
      },
      connection: {
        pool: null,
        error: null,
      },
      tables: {
        schema: '',
        result: null,
        error: null,
      },
      procedure: {
        result: null,
        error: null,
      },
      query: {
        language: 'sql',
        languages: [
          { value: 'javascript', text: 'JavaScript' },
          { value: 'json', text: 'JSON' },
          { value: 'jsonp', text: 'JSONP' },
          { value: 'json5', text: 'JSON5' },
          { value: 'powerquery', text: 'PowerQuery' },
          { value: 'sql', text: 'SQL' },
          { value: 'xquery', text: 'XQuery' },
        ],
        request: '',
        result: null,
        error: null,
      },
    };
  },
  computed: {
    isConnected() {
      return Boolean(this.connection.pool);
    },
    drivers() {
      return this.dataSources
        .map((dataSource) => dataSource.DriverName)
        .filter((value, index, self) => self.indexOf(value) === index);
    },
    databases() {
      return this.dataSources
        .map((dataSource) => dataSource.Attribute.Database)
        .filter((value, index, self) => self.indexOf(value) === index);
    },
    servers() {
      return this.dataSources
        .map((dataSource) => dataSource.Attribute.Server)
        .filter((value, index, self) => self.indexOf(value) === index);
    },
    connectionString() {
      let string = `Driver={${this.odbc.driver}};Database=${this.odbc.database};Server=${this.odbc.server};`;
      if (this.odbc.trustedConnection) {
        string += 'Trusted_Connection=Yes;';
      } else {
        string += `User Id=${this.odbc.username};Password=${this.odbc.password};`;
      }
      return string;
    },
  },
  methods: {
    async connect() {
      try {
        this.connection.error = null;
        this.connection.pool = await odbc.connect(this.connectionString);
      } catch (error) {
        console.error(error);
        this.connection.pool = null;
        this.connection.error = error;
      }
    },
    async getTables() {
      try {
        this.tables.error = null;
        this.tables.result = await this.connection.pool.tables(
          null,
          this.tables.schema,
          null,
          null
        );
      } catch (error) {
        console.error(error);
        this.tables.result = null;
        this.tables.error = error;
      }
    },
    async getProcedures() {
      try {
        this.procedure.error = null;
        this.procedure.result = await this.connection.pool.query(`
				  SELECT R.SPECIFIC_CATALOG, R.SPECIFIC_NAME, P.PARAMETER_MODE, P.PARAMETER_NAME, P.DATA_TYPE
          FROM INFORMATION_SCHEMA.ROUTINES R
          INNER JOIN INFORMATION_SCHEMA.PARAMETERS P
          ON R.SPECIFIC_NAME = P.SPECIFIC_NAME
          WHERE R.ROUTINE_TYPE = 'PROCEDURE';
				`);
      } catch (error) {
        console.error(error);
        this.procedure.result = null;
        this.procedure.error = error;
      }
    },
    tablesRowClicked(item) {
      this.query.request = `SELECT * FROM "${item.TABLE_NAME}";`;
      this.activeTab = 2;
    },
    proceduresRowClicked(item) {
      this.query.request = `EXEC ${item.SPECIFIC_NAME}`;
      this.query.request += this.procedure.result
        .filter(
          (procedure) =>
            procedure.PARAMETER_MODE == 'IN' &&
            procedure.SPECIFIC_NAME === item.SPECIFIC_NAME
        )
        .map(
          (procedure) =>
            `\n${procedure.PARAMETER_NAME} = /*${procedure.DATA_TYPE}*/`
        )
        .join(',');
      this.query.request += ';';
      this.activeTab = 2;
    },
    async executeQuery() {
      try {
        this.query.error = null;
        this.query.result = await this.connection.pool.query(
          this.query.request
        );
      } catch (error) {
        console.error(error);
        this.query.result = null;
        this.query.error = error;
      }
    },
  },
  async mounted() {
    this.dataSources = await OdbcHelper.getDataSources();
  },
};
</script>
