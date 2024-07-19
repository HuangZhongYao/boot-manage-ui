/**
 * 配置 ESLint 规则以适应特定的开发规范和项目需求。
 *
 * 此函数导入并应用了 @antfu 的 ESLint 配置，该配置专注于 TypeScript、Vue 和 Unocss 的开发。
 * 它通过启用、禁用和配置特定的 ESLint 规则，来确保代码的质量、一致性和可维护性。
 *
 * @param {Object} options - 配置 ESLint 的选项。
 * @param {boolean} options.unocss - 是否启用 UnoCSS 相关的 ESLint 规则。
 * @param {boolean} options.formatters - 是否启用格式化器相关的 ESLint 规则。
 * @param {boolean} options.stylistic - 是否启用风格相关的 ESLint 规则。
 * @param {Object} options.rules - 自定义的 ESLint 规则配置。
 * @param {Object} options.languageOptions - 语言选项，用于配置全局变量的访问权限。
 * @returns {Object} - 应用了指定配置的 ESLint 配置对象。
 */
import antfu from '@antfu/eslint-config'

export default antfu({
  unocss: true,
  formatters: true,
  stylistic: true,
  rules: {
    'n/prefer-global/process': 'off',
    'no-undef': 'error',
    'no-fallthrough': 'off',
    'vue/block-order': 'off',
    '@typescript-eslint/no-this-alias': 'off',
    'prefer-promise-reject-errors': 'off',
  },
  languageOptions: {
    globals: {
      h: 'readonly',
      unref: 'readonly',
      provide: 'readonly',
      inject: 'readonly',
      markRaw: 'readonly',
      defineAsyncComponent: 'readonly',
      nextTick: 'readonly',
      useRoute: 'readonly',
      useRouter: 'readonly',
      Message: 'readonly',
      $loadingBar: 'readonly',
      $message: 'readonly',
      $dialog: 'readonly',
      $notification: 'readonly',
      $modal: 'readonly',
    },
  },
})
