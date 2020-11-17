let link = "http://95.181.178.7:1313"

export const environment = {
  production: true,
  base: link,

  getUser: link + "/user/get/",
  loginCheck: link + "/user/login-check/",
  registration: link + "/user/registration/",
  login: link + "/user/login/",
  usersOnline: link + "/user/users-online/",

  getDialogues: link + "/user/dialoguies/get/",
  createDialogues: link + "/user/dialoguies/create/",
  deleteDialogues: link + "/user/dialoguies/delete/",

  getMessages: link + "/dialogue/message-get",
  newMessage: link + "/dialogue/message-new",

  fileReserve: link + '/dialogue/message-file-reserve/',
  fileUpload: link + '/dialogue/message-file-upload/',
  fileDownload: link + '/dialogue/message-file-download/',

};
