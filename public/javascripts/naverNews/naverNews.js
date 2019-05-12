const utils = require("../utils/utils")
const inspect = require("./Inspect")

const NAVER_HOME_URL = `https://news.naver.com/main/home.nhn`
let MENU_URL_LIST = []

doNaverCrawling = (flag) => {
  return new Promise(async(resolve, reject) => {
    try {
      if (flag === "END_BUILD_MENU") {
        let mIndex = 0, sIndex = 0;
        const today = new Date().toISOString().split("T")[0].replace(/-/g,"")
        for(let mURL of MENU_URL_LIST) {
          if(mIndex > 0) {
            for(let sURL of mURL.subURLInfo) {
              utils.getHTML4Naver(sURL.subURL+`&date=${today}&page=9999`)
                .then(data => {
                  inspect.inspectTotPage(data)
                    .then(totPage => {
                      for(let page = 0; page <= totPage; page++) {
                        page++
                        utils.getHTML4Naver(sURL.subURL+`&date=${today}&page=${page}`)
                          .then(data => {
                            inspect.inspectArticles(data)
                              .then(articles => {
                                console.log(sURL.subURL+`&date=${today}&page=${page}`)
                                console.log(articles)
                              })
                              .catch(e => reject(e))
                          })
                      }
                    })

                })
                .catch(e => reject(e))
            }
          }
          mIndex++
        }
      }
    } catch (e) {
      console.log(e)
      reject(e)
    }
  })
}

doNaverURLCrawling = () => {
  return new Promise(async(resolve, reject) => {
    try {
      utils.getHTML4Naver(NAVER_HOME_URL)
        .then(data => {
          console.log(data)
          inspect.inspectMenu(data)
            .then(data => {
              MENU_URL_LIST = data
              doNaverChildrenURLCrawling()
                .then(flag => doNaverCrawling(flag))
                .catch(e => reject(e))
            })
            .catch(e => reject(e))
        })
        .catch(e => reject(e))
    } catch (e) {
      console.log(e)
      reject(e)
    }
  })
}

doNaverChildrenURLCrawling = () => {
  // it have bug that is insert subpage URL under main manu infos
  return new Promise(async(resolve, reject) => {
    try {
      let index = 0
      for(const url of MENU_URL_LIST) {
        utils.getHTML4Naver(url.menuURL)
          .then(data => {
            inspect.inspectChildrenMenu(data, MENU_URL_LIST, index)
              .then(menuList => {
                MENU_URL_LIST = menuList
                index++
                if (index === MENU_URL_LIST.length) {
                  resolve("END_BUILD_MENU")
                }
              })
              .catch(e => reject(e))
          })
          .catch(e => reject(e))
      }
    } catch (e) {
      console.log(e)
      reject(e)
    }
  })
}

doNaverURLCrawling()