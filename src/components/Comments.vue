<template>
  <div class="comments_area">
    <div class="comments" v-if="allComments.length > 0 && errorstatus == null">
      <div class="comments_topline">
        <h2>Комментарии</h2>
        <div class="topline_item">
          <span>Сортировать по</span>
          <span
            class="order_by"
            :class="{ active: orderBy == 'id' }"
            @click="updateOrderBy('id')"
            >ID</span
          >
          <span
            class="order_by"
            :class="{ active: orderBy == 'date' }"
            @click="updateOrderBy('date')"
            >Дате</span
          >
        </div>

        <div class="topline_item">
          <span
            class="order_direction"
            :class="{ active: orderDirection == 'asc' }"
            @click="updateOrderDirection('asc')"
          >
            По возрастанию
          </span>
          <span
            class="order_direction"
            :class="{ active: orderDirection == 'desc' }"
            @click="updateOrderDirection('desc')"
            >По убыванию</span
          >
        </div>
      </div>

      <div class="comments_pagination">
        <div
          class="pagination_btn"
          :class="{ disabled: page <= 1 }"
          @click="prevPage()"
        >
          Назад
        </div>
        <div class="page_indicator">
          Страница {{ page }} / {{ Math.ceil(allComments.length / 3) }}
        </div>
        <div
          class="pagination_btn"
          :class="{ disabled: page >= allComments.length / 3 }"
          @click="nextPage()"
        >
          Дальше
        </div>
      </div>

      <div class="comments_list">
        <div class="comment_item" v-for="comment in comments" :key="comment.id">
          <div class="comment_head">
            <span>#{{ comment.id }}</span>
            <span>{{ comment.name }}</span>
          </div>
          <div class="comment_date">
            {{ comment.date.split("-").reverse().join(".") }}
          </div>
          <p>{{ comment.text }}</p>
          <span class="rm_proc" v-if="comment.id == proc_id">Подождите...</span>
          <span v-else class="rm_btn" @click="removeComment(comment.id)"
            >Удалить</span
          >
        </div>
      </div>
    </div>
    <span class="no_comments" v-else-if="errorstatus == null"
      >Кажется, здесь нет комментариев...</span
    >
    <span class="comments_error" v-else>{{ errorstatus }}</span>
    <AddComment v-if="errorstatus == null" />
  </div>
</template>

<script>
import AddComment from "@/components/AddComment";
export default {
  components: {
    AddComment,
  },
  data() {
    return {
      proc_id: null,
    };
  },
  name: "Comments",
  computed: {
    orderBy() {
      return this.$store.getters.getOrderBy;
    },

    orderDirection() {
      return this.$store.getters.getOrderDirection;
    },

    comments() {
      return this.$store.getters.getComments;
    },

    page() {
      return this.$store.getters.getPage;
    },
    errorstatus() {
      return this.$store.getters.getErrorStatus;
    },
    allComments() {
      return this.$store.getters.getAllComments;
    },
  },
  methods: {
    updateOrderDirection(dir) {
      this.$store.dispatch("updateOrderDirection", dir);
    },
    updateOrderBy(order) {
      this.$store.dispatch("updateOrderBy", order);
    },
    nextPage() {
      if (this.page < Math.ceil(this.allComments.length / 3)) {
        this.$store.dispatch("updatePage", this.page + 1);
      }
    },
    prevPage() {
      if (this.page > 1) {
        this.$store.dispatch("updatePage", this.page - 1);
      }
    },
    async removeComment(id) {
      this.proc_id = id;
      let THIS = this;
      await this.$store.dispatch("removeComment", id).then(function () {
        THIS.proc_id = null;
      });
    },
  },
};
</script>

<style lang="scss">
.no_comments {
  display: block;
  line-height: 30px;
  margin: 20px 0 40px 0;
  padding: 7px 20px;
  color: #666;
  border-radius: 12px;
  background: #fafafa;
}

.comments_error {
  display: block;
  line-height: 30px;
  margin: 20px 0 40px 0;
  padding: 7px 20px;
  background: #d66;
  border-radius: 12px;
  color: #fafafa;
}

.comments_area {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.comments {
  display: flex;
  flex-direction: column;

  .comments_topline {
    display: flex;
    width: 100%;
    justify-content: space-between;
    color: #666666;

    h2 {
      display: block;
      width: 300px;
      line-height: 40px;
      margin: 0;
      padding: 0;
      font-size: 1.3em;
      font-weight: lighter;
    }

    .topline_item {
      display: flex;
      justify-content: space-around;
      width: 265px;
      height: 40px;
      padding: 5px;
      box-sizing: border-box;
      background: #fafafa;
      align-items: center;
      border-radius: 12px;
      box-shadow: -1px 1px 2px 0 rgba(0, 0, 0, 0.1);

      .order_by,
      .order_direction {
        display: block;
        height: 30px;
        line-height: 30px;
        padding: 0 10px;
        text-align: center;
        background: #dfdfdf;
        border: 1.5px solid #dfdfdf;
        border-radius: 6px;
        box-sizing: border-box;
        transition: all 0.1s ease-in-out;
        font-size: 1em;

        &.active {
          border: 1.5px solid #333;
        }

        &:hover {
          cursor: pointer;
          color: #333;
        }
      }

      .order_by {
        width: 60px;
      }
    }
  }

  .comments_list {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-top: 10px;

    .comment_item {
      width: 100%;
      padding: 20px;
      box-sizing: border-box;
      background: #fafafa;
      border-radius: 12px;
      box-shadow: -1px 1px 2px 0px rgba(0, 0, 0, 0.1);
      margin-bottom: 10px;

      .comment_head {
        color: #333;
        font-size: 1.2em;

        span:first-child {
          padding: 5px;
          margin-right: 20px;
        }
      }

      .comment_date {
        color: #a0a0a0;
        margin: 10px 0;
      }

      p {
        margin: 10px 0 0 0;
        text-align: justify;
        color: #666;
      }

      .rm_proc {
        float: right;
        padding: 5px 10px;
        margin-top: 10px;
      }

      .rm_btn {
        float: right;
        color: #666;
        cursor: pointer;
        margin-top: 10px;
        transition: all 0.1s ease-in-out;
        padding: 5px 10px;
        box-sizing: border-box;
        border-radius: 6px;

        &:hover {
          color: #333;
          box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.2);
        }
      }
    }
  }

  .comments_pagination {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    color: #666;

    .pagination_btn {
      width: 60px;
      background: #fafafa;
      padding: 5px;
      text-align: center;
      border-radius: 6px;
      cursor: pointer;
      box-shadow: -1px 1px 2px 0px rgba(0, 0, 0, 0.1);
      transition: all 0.1s ease-in-out;

      &:hover {
        color: #333;
      }

      &.disabled {
        color: transparent;
        background: transparent;
        box-shadow: none;
        cursor: default;
      }
    }

    .page_indicator {
      padding: 5px 0;
    }
  }
}

@media screen and (min-width: 1024px) {
  .comments {
    width: 1024px;
  }
}

@media screen and (max-width: 920px) {
  .comments {
    width: 95vw;

    .comments_topline {
      // flex-direction: column;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;

      h2 {
        text-align: center;
        width: 100%;
      }

      .topline_item {
        margin: 5px;
      }
    }
  }
}
</style>
