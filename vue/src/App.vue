<template>
  <v-app>
    <v-app-bar
      app
      color="dark"
      dark
    >
      <div class="d-flex align-center">

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="http://www.wisefly.in/wp-content/themes/wisefly/img/wisefly-logo.png"
          width="120"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="http://www.wisefly.in/"
        target="_blank"
        text
      >
        <span class="mr-2">version 2.0</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-content>
      <airportCards/>
    </v-content>
  </v-app>
</template>

<script>
import airportCards from './components/airportCards';

export default {
  name: 'App',

  components: {
    airportCards,
  },

  data: () => ({
    //
  }),
};
</script>
