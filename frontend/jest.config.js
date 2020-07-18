module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  setupFiles: ["<rootDir>/jest.init.js"],
  moduleNameMapper: {
    '\\.css$': '<rootDir>/__mocks__/styleMock.js'
  }
}
