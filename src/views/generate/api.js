/**
 * @Description: 代码生成api
 * @Author: zuuuYao
 * @Copyright: © 2024 HuangZhongYao | https://github.com/HuangZhongYao
 */
import { request } from '@/utils'

export default {

  /**
   * 代码生成
   * @param data
   * @returns {*}
   */
  codeGeneration: data => request.post('/generate/codeGeneration', data, { responseType: 'blob' }),

  /**
   * 获取全部表
   * @returns {*}
   */
  getTables: () => request.get(`/generate/getTables`),

  /**
   * 获取表字段信息
   * @param tableName
   * @returns {*}
   */
  getTableColumns: tableName => request.get(`/generate/getTableColumns?tableName=${tableName}`),
}
