import service from "@/request/index.js";
import pinia from "@/pinia/create"
import useInfo from "@/pinia/index"
const info = useInfo(pinia)
function apiAllData() {
  return service({
    url: "/info/all",
    method: "get",
    headers: {
      'Authorization': info.token
    }
  })
}

function apiAddTranslate(data) {
  return service({
    method: "POST",
    url: "/edit/add",
    headers: {
      "Authorization": info.token
    },
    data: data
  })
}

function apiDeleteTranslate(data) {
  return service({
    method: "POST",
    url: "/edit/delete",
    headers: {
      "Authorization": info.token
    },
    data: data
  })
}

function apiUpdateTranslate(data) {
  return service({
    method: "POST",
    url: "/edit/update",
    headers: {
      "Authorization": info.token
    },
    data: data
  })
}
export {
  apiAllData,
  apiAddTranslate,
  apiDeleteTranslate,
  apiUpdateTranslate
}