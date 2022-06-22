// 封装专门处理时间的 方法
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime' // 到指定时间需要的插件
import 'dayjs/locale/zh' // 集成中文

// JSDOC注释, 文档注释
/**
 * .....多久之前
 * @param {*} 之前的时间
 * @returns 系统时间到之前指定时间的距离值
 */
export const timeAgo = (targetTime) => {
  // 格式化时间
  dayjs.extend(relativeTime)
  dayjs.locale('zh')//这里使用了国际化 用的中国的时间
  var a = dayjs()
  var b = dayjs(targetTime)
  return a.to(b) // 返回多久之前...
}
//格式化时间
export const formDate =(dataObj)=>{
	return dayjs(dataObj).format('YYYY-MM-DD')
}
