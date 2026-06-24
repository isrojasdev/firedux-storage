import { ref, onUnmounted } from "vue";
import { store } from "./main.js";

/**
 * Composable that subscribes to a slice of the Redux store and
 * returns a reactive ref that updates whenever the selected value changes.
 *
 * @param {(state: any) => any} selector
 */
export function useSelector(selector) {
  const value = ref(selector(store.getState()));

  const unsubscribe = store.subscribe(() => {
    value.value = selector(store.getState());
  });

  onUnmounted(unsubscribe);

  return value;
}
