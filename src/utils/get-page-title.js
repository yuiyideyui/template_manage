import defaultSettings from '@/settings'
import i18n from '@/lang'

const title = defaultSettings.title || '中山大学|虚拟仿真教学平台后台管理系统'

export default function getPageTitle(key) {
  const hasKey = i18n.te(`route.${key}`)
  if (hasKey) {
    const pageName = i18n.t(`route.${key}`)
    return `${pageName} - ${title}`
  }
  return `${title}`
}
