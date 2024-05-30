const { getAsync, setAsync } = require('../redis/index')
// store value as string

const counterPlusOne = async (keyName) => {
  const currentCount = await getAsync(keyName) || 0;
  const nextCount = parseInt(currentCount, 10) + 1;
  await setAsync(keyName, nextCount)

  return nextCount
}

const currentCount = async (keyName) => {
  return await getAsync(keyName) || 0;
}


const postStatistic = 'postStatistic'
const postStatisticPlus1   = () => counterPlusOne(postStatistic)
const currentPostStatistic = () => currentCount(postStatistic)

const successPost = 'successPost'
const successPostPlus1     = () => counterPlusOne(successPost)
const currentSuccessPost   = () => currentCount(successPost)

const visitCount = 'visitCount'
const visitCountPlus1      = () => counterPlusOne(visitCount)
const currentVisitCount    = () => currentCount(visitCount)

module.exports = { 
  postStatisticPlus1,
  currentPostStatistic,
  successPostPlus1, 
  currentSuccessPost,
  visitCountPlus1,
  currentVisitCount,
}