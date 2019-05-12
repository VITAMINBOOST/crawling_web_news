const cheerio = require("cheerio")

const utils = require("../utils/utils")

const baseHOST = "https://news.naver.com"

inspectMenu = (doc) => {
  return new Promise(async(resolve, reject) => {
    try {
      const menuList = []

      const body = await utils.changeEncoding(doc.data, "EUC-KR", "UTF8")

      $ = cheerio.load(body);

      const $bodyList = $("div.lnb_inner div.lnb_menu ul").children("li");

      $bodyList.each(function(i, elem) {

        menuList[i] = {
          menuName: $(this).children("a").find("span.tx").text(),
          menuURL: baseHOST + $(this).children("a").attr("href"),
          subURLInfo: []
        }
      });
      resolve(menuList)
    } catch (e) {
      console.log(e)
      reject(e)
    }
  })
}

inspectChildrenMenu = (doc, patienMenuList, patienIndex) => {
  return new Promise(async(resolve, reject) => {
    try {
      const body = await utils.changeEncoding(doc.data, "EUC-KR", "UTF8")

      $ = cheerio.load(body)

      const $bodyList = $("div.snb ul.nav").children("li")
      $bodyList.each(function(i, _) {
        patienMenuList[patienIndex].subURLInfo[i] = {
          subMenuURL: $(this).find("a").text().trim(),
          subURL: baseHOST + $(this).find("a").attr("href")
        }
      });
      resolve(patienMenuList)
    } catch (e) {
      console.log(e)
      reject(e)
    }
  })
}

inspectTotPage = (doc) => {
  return new Promise(async(resolve, reject) => {
    try {
      const body = await utils.changeEncoding(doc.data, "EUC-KR", "UTF8")

      $ = cheerio.load(body);

      if($("div.paging").children("strong").text() !== "") {
        resolve(Number($("div.paging").children("strong").text()))
      }
    } catch (e) {
      console.log(e)
      reject(e)
    }
  })
}

inspectArticles = (doc) => {
  return new Promise(async(resolve, reject) => {
    try {
      const body = await utils.changeEncoding(doc.data, "EUC-KR", "UTF8")

      $ = cheerio.load(body);
      if($("div.paging").children("strong").text() !== "") {
        let articleList = []
        const $bodyList = $("div.content div.list_body ul.type06_headline").children("li")

        $bodyList.each(function(i, _) {
          articleList[i] = {
            headLine: $(this).children("dl").children("dt").find("a").text().replace(/\n/g,"").replace(/\t/g,"").trim(),
            articleURL: $(this).children("dl").children("dt").find("a").attr("href"),
            writing: $(this).children("dl").children("dd").find("span.writing").text()
          }
        });
        resolve(articleList)
      }
    } catch (e) {
      console.log(e)
      reject(e)
    }
  })
}

module.exports = {
  inspectMenu
  , inspectChildrenMenu
  , inspectArticles
  , inspectTotPage
}
