<template>
  <div>
    <b-container>
      <b-jumbotron
        header="Flyff Admin Tool"
        :lead="$t('views.main.subtitle')"
        class="text-center shadow"
      >
        <b-img src="/icon.png" height="200" />

        <p>{{ $t('views.main.description') }}</p>

        <b-button :to="{ name: 'Workflow' }" variant="primary" block>
          <b-icon icon="collection" />
          {{ $t('views.workflow.title') }}
        </b-button>
        <b-button :to="{ name: 'System' }" variant="primary" block>
          <b-icon icon="gear" />
          {{ $t('views.system.title') }}
        </b-button>
        <hr />
        <b-button :to="{ name: 'ODBC' }" variant="primary" block>
          <b-icon icon="layers" />
          {{ $t('views.odbc.title') }}
        </b-button>
        <b-button :to="{ name: 'SQL' }" variant="primary" block>
          <b-icon icon="server" />
          {{ $t('views.sql.title') }}
        </b-button>
        <hr />
        <b-button :to="{ name: 'SpeedTest' }" variant="primary" block>
          <b-icon icon="bar-chart" />
          {{ $t('views.speedTest.title') }}
        </b-button>
      </b-jumbotron>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'Main',
};
</script>

<style lang="scss" scoped>
@import '@/assets/variables';

@-webkit-keyframes color-waves {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes color-waves {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

#app-content {
  background: linear-gradient(270deg, $primary, $secondary);
  background-size: 400% 400%;
  animation: color-waves 10s ease infinite;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
