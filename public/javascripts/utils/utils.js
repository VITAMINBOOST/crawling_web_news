const axios = require("axios");

var Iconv  = require('iconv').Iconv;

buildURL4Joongang = (nowPage, keyWord, includeKeyWord, excludeKeyWord) => {
  
  let includeUri, excludeUri = "";

  if(includeKeyWord !== "" && excludeKeyWord !== undefined){
    includeUri = `&IncludeKeyword=${encodeURI(includeKeyWord)}`;
  }

  if(excludeKeyWord !== "" && excludeKeyWord !== undefined){
    excludeUri = `&ExcludeKeyword=${encodeURI(excludeKeyWord)}`;
  }

  nowPage = nowPage === 0 ? 1 : nowPage;

  const url = `https://search.joins.com/TotalNews?page=${nowPage}&Keyword=${encodeURI(keyWord)}&SortType=New&SourceGroupType=Joongang%7CIlganSports%7CJtbc%7CJoongangSunday%7CJoongangDaily%7CJoongangOnline%7CEtc&SearchCategoryType=TotalNews&MatchKeyword=${encodeURI(keyWord)}${includeUri}${excludeUri}`;
  
  return url
}

changeEncoding = (content, asIs, toBe) => {
  return new Promise(async(resolve, reject) => {
    try {
      var encode = new Iconv(asIs, `${toBe}//translit//ignore`);

      resolve(encode.convert(content, toBe).toString())
    } catch (e) {
      console.log(e)
      reject(e)
    }
  })
}

getHTML = async(URL) => {
  try {
    return await axios.get(URL)
  } catch (e) {
    console.log(e)
    return e
  }
}

getHTML4Naver = async(URL) => {
  return await axios.request({
    method: 'GET',
    url: URL,
    responseType: 'arraybuffer',
    responseEncoding: 'binary'
  })
}

module.exports = {
  getHTML
  , getHTML4Naver
  , changeEncoding
}