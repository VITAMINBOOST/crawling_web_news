const utils = require("../utils/utils")
const cheerio = require("cheerio")

var totPages = 1
var nowPage = 1
var totArticles = 0;
var remainArticles = 0;

var collectedCrawl = [];

doCrawling = (keyWord, includeWord, excludeWord) => {
  return new Promise(async(resolve, reject) => {
    if (keyWord !== "" || keyWord !== undefined) {
      utils.getHTML(buildURL4Joongang(nowPage, keyWord, includeWord, excludeWord))
        .then(res => {
          inspectHTML(res)
            .then(data => {
              collectedCrawl.push(data)

              if(remainArticles <= 0) {
                resolve(collectedCrawl)
                collectedCrawl = []
              } else {
                nowPage++
                if(nowPage <= totPages) {
                  resolve(doCrawling(keyWord, includeWord, excludeWord))
                }
              }
            })
            .catch(e => reject(e))
        })
        .catch(e => {
          reject(e)
        })
    } else {
      reject("키워드 없음.")
    }
  })
}

inspectHTML = (doc) => {
  return new Promise(async(resolve, _) => {
    let ulList = [];

    $ = cheerio.load(doc.data);
    
    totPages = Number($("div.search_title").find("span").text().split(" /")[0].split("-")[1]);
    totArticles = Number($("div.search_title").find("span").text().split("/ ")[1].replace("건", ""));
    remainArticles = remainArticles === 0 ? totArticles : remainArticles;

    const $bodyList = $("div.section_news div.bd ul").children("li");
    
    $bodyList.each(function(i, _) {
      remainArticles--;

      let rawArticleInfo = $(this).children("div.text").find("span.byline").children("em").text()
      
      ulList[i] = {
        headLine: $(this).children("div.text").find("strong").children("a").text(),
        articleLink: $(this).children("div.text").find("strong").children("a").attr("href"),
        articleInfo: {
          whoUpload: rawArticleInfo.substring(0, rawArticleInfo.indexOf("2")),
          uploadTime: rawArticleInfo.substring(rawArticleInfo.indexOf("2"), rawArticleInfo.length)
        },
        tags: []
      }

      const tagList = $(this).children("div.text").find("span.tag").children("a");

      tagList.each(function(j, _) {
        const baseURL = "https://search.joins.com"
        ulList[i].tags[j] = {
          tagsUrl: baseURL + $(this).attr("href"),
          tagsName: $(this).children("em").text().replace(/\n/g, "").trim()
        }
      })
    })
    
    resolve(ulList.filter(n => n.headLine))
  })
}

module.exports.doCrawling = doCrawling;

/////////////////////////////////////////////

// doCrawling("가금류", "병", "")
//   .then(result => {
//     console.log(result)
//   })
//   .catch(e => {
//     console.log(e)
//   })