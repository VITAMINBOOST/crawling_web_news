const axios = require("axios");

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

module.exports.getHTML = async(URL) => {
  try {
    return await axios.get(URL)
  } catch (e) {
    console.log(e)
    return e
  }
}
