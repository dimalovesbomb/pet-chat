/** @type {import('ts-jest').JestConfigWithTsJest} */
// eslint-disable-next-line no-undef
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^.+\\.(css|less|scss)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  // transform: {
  //   '^.+\\.scss$': 'babel-jest',
  //   // '^.+\\.tsx$': 'babel-jest',
  // },
};
