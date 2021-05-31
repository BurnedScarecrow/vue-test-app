import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    commentsOnPage: 3,
    comments: [],
    allComments: [
      {
        id: 1,
        name: "Helen Trosenbag",
        date: "2021-04-12",
        text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.\
        Sint numquam dolores recusandae voluptatum rerum repellat enim rem!\
        Illum perferendis enim illo. Suscipit accusantium quibusdam voluptatum\
        est rerum praesentium quas omnis.",
      },
      {
        id: 2,
        name: "Helen Trosenbag",
        date: "2021-04-28",
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. \
        Deserunt sed quo iusto amet aut suscipit in at, itaque quaerat, \
        autem totam dolor officiis culpa reprehenderit omnis voluptatibus voluptates, \
        obcaecati ab atque corrupti.",
      },
      {
        id: 3,
        name: "Helen Trosenbag",
        date: "2021-05-03",
        text: "Lorem ipsum, dolor sit amet consectetur \
        adipisicing elit. Laudantium modi commodi accusantium \
        aut reprehenderit amet quis officia, aperiam provident inventore. \
        Aperiam reprehenderit quod cumque neque, adipisci quasi omnis et temporibus.",
      },
      {
        id: 0,
        name: "Helen Trosenbag",
        date: "2021-05-15",
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. \
        Amet saepe itaque libero. Consectetur commodi vero, magni deleniti molestiae \
        maiores ducimus deserunt ea dolorem ratione. Commodi, incidunt nam?",
      },
    ],
    page: 1,
    orderBy: "id",
    orderDirection: "asc",
    ready: false,
    errorStatus: null,
  },
  mutations: {
    setComments(state, comments) {
      state.comments = comments;
    },
    setAllComments(state, allComments) {
      state.allComments = allComments;
    },
    setPage(state, page) {
      state.page = page;
    },
    setOrderBy(state, orderBy) {
      state.orderBy = orderBy;
    },
    setOrderDirection(state, orderDirection) {
      state.orderDirection = orderDirection;
    },
    setReady(state, ready) {
      state.ready = ready;
    },
    setErrorStatus(state, err) {
      state.errorStatus = err;
    },
  },
  getters: {
    getOrderBy(state) {
      return state.orderBy;
    },
    getOrderDirection(state) {
      return state.orderDirection;
    },
    getReady(state) {
      return state.ready;
    },
    getComments(state) {
      return state.comments;
    },
    getAllComments(state) {
      return state.allComments;
    },
    getPage(state) {
      return state.page;
    },
    getErrorStatus(state) {
      return state.errorStatus;
    },
  },
  actions: {
    updateOrderBy({ commit, dispatch }, data) {
      commit("setOrderBy", data);
      dispatch("formComments");
    },
    updateOrderDirection({ commit, dispatch }, data) {
      commit("setOrderDirection", data);
      dispatch("formComments");
    },
    async sortComments({ commit, state }) {
      let sortedComments;
      if (state.orderBy == "id") {
        if (state.orderDirection == "asc") {
          sortedComments = state.allComments.sort((a, b) =>
            a.id > b.id ? 1 : b.id > a.id ? -1 : 0
          );
        } else {
          sortedComments = state.allComments.sort((a, b) =>
            a.id < b.id ? 1 : b.id < a.id ? -1 : 0
          );
        }
      } else {
        if (state.orderDirection == "asc") {
          sortedComments = state.allComments.sort((a, b) =>
            a.date > b.date ? 1 : b.date > a.date ? -1 : 0
          );
        } else {
          sortedComments = state.allComments.sort((a, b) =>
            a.date < b.date ? 1 : b.date < a.date ? -1 : 0
          );
        }
      }
      commit("setAllComments", sortedComments);
    },
    formComments({ commit, state, dispatch }) {
      dispatch("sortComments");
      let sortedComments = state.allComments;
      let startIndex = 3 * state.page - 3;
      let endIndex =
        startIndex + 3 >= sortedComments.length
          ? sortedComments.length
          : startIndex + 3;
      let comments = sortedComments.slice(startIndex, endIndex);
      commit("setComments", comments);
    },
    async fetchComments({ commit, dispatch }) {
      commit("setReady", false);

      await axios
        .get("http://127.0.0.1/api/comments")
        .then(function (response) {
          commit("setAllComments", response.data);
          dispatch("formComments");
          commit("setErrorStatus", null);
        })
        .catch((error) => {
          if (!error.response) {
            commit("setErrorStatus", "Сервер не доступен");
          } else {
            commit("setErrorStatus", error.response.data.message);
          }
        });
      commit("setReady", true);
    },
    updatePage({ commit, dispatch }, page) {
      commit("setReady", false);
      commit("setPage", page);
      dispatch("formComments");
      commit("setReady", true);
    },
    async removeComment({ state, dispatch, commit }, comment_id) {
      if (state.page > Math.ceil((state.allComments.length - 1) / 3))
        commit("setPage", Math.ceil((state.allComments.length - 1) / 3));
      // let index = state.allComments
      //   .map((x) => {
      //     return x.id;
      //   })
      //   .indexOf(comment_id);
      // state.allComments.splice(index, 1);
      dispatch("formComments");
      await axios({
        method: "delete",
        url: "http://127.0.0.1/api/comments/" + comment_id,
      }).catch((error) => {
        if (!error.response) {
          commit("setErrorStatus", "Сервер не доступен");
        } else {
          commit("setErrorStatus", error.response.data.message);
        }
      });
      await axios
        .get("http://127.0.0.1/api/comments")
        .then(function (response) {
          commit("setAllComments", response.data);
          dispatch("formComments");
          commit("setErrorStatus", null);
        })
        .catch((error) => {
          if (!error.response) {
            commit("setErrorStatus", "Сервер не доступен");
          } else {
            commit("setErrorStatus", error.response.data.message);
          }
        });
      dispatch("formComments");
    },
    async addComment({ commit, dispatch }, data) {
      await axios({
        method: "post",
        url: "http://127.0.0.1/api/comments",
        data: {
          name: data.name,
          date: data.date,
          text: data.text,
        },
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }).catch((error) => {
        if (!error.response) {
          commit("setErrorStatus", "Сервер не доступен");
        } else {
          commit("setErrorStatus", error.response.data.message);
        }
      });
      await axios
        .get("http://127.0.0.1/api/comments")
        .then(function (response) {
          commit("setAllComments", response.data);
          dispatch("formComments");
          commit("setErrorStatus", null);
        })
        .catch((error) => {
          if (!error.response) {
            commit("setErrorStatus", "Сервер не доступен");
          } else {
            commit("setErrorStatus", error.response.data.message);
          }
        });
      dispatch("formComments");
    },
  },
});
