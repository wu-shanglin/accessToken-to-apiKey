import { defineStore } from 'pinia'
import { ref } from 'vue'

const useInfo = defineStore('info', () => {
  const token = ref(localStorage.getItem('token'));
  function updateToken(newToken) {
    token.value = newToken;
    localStorage.setItem('token', newToken);
  }
  return {
    token,
    updateToken,
  }
})

export default useInfo