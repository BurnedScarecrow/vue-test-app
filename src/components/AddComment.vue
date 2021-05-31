<template>
  <div class="add_comment">
    <form v-show="!processing">
      <h3>Добавить комментарий</h3>
      <input type="text" required v-model="name" placeholder="Имя" />

      <date-picker
        id="date_picker"
        v-model="date"
        valueType="format"
        placeholder="Дата"
      ></date-picker>
      <textarea
        v-model="text"
        required
        placeholder="Введите комментарий"
      ></textarea>
      <div class="bottom_wrapper">
        <div class="err_message">{{ err_message }}</div>
        <button class="add_btn" @click="addComment($event)">Добавить</button>
      </div>
    </form>
    <div class="waiter" v-show="processing">
      <Spinner />
    </div>
  </div>
</template>

<script>
import DatePicker from "vue2-datepicker";
import Spinner from "@/components/Spinner";
import "vue2-datepicker/index.css";
export default {
  components: {
    Spinner,
    DatePicker,
  },
  data() {
    return {
      name: "",
      date: null,
      text: "",
      err_message: "",
      processing: false,
    };
  },
  methods: {
    async addComment(event) {
      event.preventDefault();
      if (!this.date || !this.name || !this.text)
        this.err_message = "Заполните все поля";
      else {
        this.processing = true;
        this.err_message = "";
        let THIS = this;
        await this.$store
          .dispatch("addComment", {
            date: this.date,
            name: this.name,
            text: this.text,
          })
          .then(function () {
            THIS.name = "";
            THIS.date = null;
            THIS.text = "";
            THIS.processing = false;
          });
      }
    },
  },
};
</script>

<style scoped lang="scss">
* {
  outline: none !important;
}

.add_comment {
  margin-bottom: 100px;
  position: relative;

  .waiter {
    width: 100%;
    position: absolute;
  }

  form {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    background: #fafafa;
    padding: 10px;
    border-radius: 12px;
  }
}

h3 {
  font-weight: lighter;
  margin: 0 10px;
  height: 36px;
  line-height: 30px;
  padding: 6px 3px;
}

input,
textarea,
#date_picker {
  margin: 5px;
  border: 0;
  box-sizing: border-box;
  border-radius: 6px;
  transition: border 0.1s ease-in-out;
  font-family: "Roboto", sans-serif;
}

input,
textarea {
  box-sizing: border-box;
  width: 210px;
  height: 34px;
  padding: 6px 30px;
  padding-left: 10px;
  font-size: 14px;
  line-height: 1.4;
  color: #555;
  border: 1px solid #ccc;
  &:hover,
  &:focus {
    border: 1px solid rgba(64, 154, 255, 1);
  }
}

textarea {
  height: 68px;
}

.bottom_wrapper {
  flex-wrap: wrap;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  margin-top: 10px;
}
.err_message {
  padding: 5px 10px;
  color: #f66;
  float: left;
  box-sizing: border-box;
  flex-wrap: wrap;
}
.add_btn {
  float: right;
  color: #666;
  cursor: pointer;
  transition: all 0.1s ease-in-out;
  padding: 5px 10px;
  box-sizing: border-box;
  border-radius: 6px;
  border: 0;
  background: transparent;

  &:hover {
    color: #333;
    box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.2);
  }
}

@media screen and (min-width: 1024px) {
  textarea {
    width: 100%;
  }
  .add_comment {
    width: 1024px;
  }
}
@media screen and (max-width: 1024px) {
  textarea {
    width: 100%;
  }
}
@media screen and (max-width: 688px) {
  h3,
  textarea {
    width: 100%;
  }
}
@media screen and (max-width: 485px) {
  textarea,
  input,
  .add_btn,
  #date_picker {
    width: 100%;
  }

  .err_message {
    width: 100%;
    text-align: center;
    margin-bottom: 10px;
  }
}
</style>
