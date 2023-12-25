import service from "@/request/index.js";

function apiLogin(data) {
  return service({
    url: "/user/login",
    method: "post",
    data: data
  })
}



export {
  apiLogin
}