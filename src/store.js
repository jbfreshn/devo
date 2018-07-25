import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    github: [],
    hackernews: [],
    updated_at: {
      github: '',
      hackernews: '',
      threshold: 60 * 60 * 1000,
    },
  },
  mutations: {
    setGithubData(state, data) {
      state.github = data;
      state.updated_at.github = new Date();
    },
    setHackernewsData(state, data) {
      state.hackernews = data;
      state.updated_at.hackernews = new Date();
    },
  },
  actions: {
    async updateHackernews(context, forced = false) {
      const { threshold } = context.state.updated_at;
      if ((new Date()) - context.state.updated_at.hackernews > threshold || forced) {
        const response = await axios.get('https://hn-api.now.sh/');
        context.commit('setHackernewsData', response.data);
      }
    },
    async updateGithub(context, forced = false) {
      const { threshold } = context.state.updated_at;
      if ((new Date()) - context.state.updated_at.hackernews > threshold || forced) {
        const response = await axios.get('https://gh-api.now.sh/');
        context.commit('setGithubData', response.data);
      }
    },
  },
});
