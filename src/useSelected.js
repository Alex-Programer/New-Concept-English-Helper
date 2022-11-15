import { ref } from "vue";
import { onKeyStroke } from "@vueuse/core";
import config from "./article.json";

export const useSelected = (edit) => {
  const index = ref(-1);

  onKeyStroke(["w", "W", "ArrowUp"], (e) => {
    if (edit.value) return;

    if (index.value === 0) {
      index.value = config.length - 1;
    } else {
      index.value--;
    }
  });

  onKeyStroke(["s", "S", "ArrowDown"], (e) => {
    if (edit.value) return;

    if (index.value === config.length - 1) {
      index.value = 1;
    } else {
      index.value++;
    }
  });

  onKeyStroke(["Enter"], (e) => {
    if (edit.value) return;

    e.preventDefault();
    const selecteDOM = document.querySelector("li.selected");
    selecteDOM && selecteDOM.click();
  });

  return {
    index,
  };
};
