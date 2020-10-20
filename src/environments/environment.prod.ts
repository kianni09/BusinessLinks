let link = "http://95.181.178.7:1313"

export const environment = {
  production: true,

  getUser: link + "/user/get/",
  loginCheck: link + "/user/login-check/",
  registration: link + "/user/registration/",
  login: link + "/user/login/",

  getDialogues: link + "/user/dialoguies/get/",
  createDialogues: link + "/user/dialoguies/create/",
  deleteDialogues: link + "/user/dialoguies/delete/"

};
