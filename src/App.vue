<template>
  <div id="app">
    <MenuComponent id="app-menu" />
    <keep-alive include="Workflow">
      <router-view id="app-content" class="py-4" />
    </keep-alive>
    <FooterComponent id="app-footer" />
  </div>
</template>

<script>
import MenuComponent from '@/components/Menu';
import FooterComponent from '@/components/Footer';

export default {
  name: 'App',
  components: {
    MenuComponent,
    FooterComponent,
  },
};
</script>

<style lang="scss">
@import './assets/theme.scss';

@import '~bootstrap';
@import '~bootstrap-vue';

#app {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  justify-content: space-between;
}

#app-menu,
#app-footer {
  flex-shrink: 0;
}

#app-content {
  flex: 1 1 0;
  flex-grow: 1;
  flex-shrink: 1;
  overflow: auto;
}
</style>
