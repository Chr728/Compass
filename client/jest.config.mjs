import nextJest from 'next/jest.js'
 
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})
 
// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const config = {
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
 
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: [
      "client/app/contexts",
      "client/.next",
      // "/node_modules/",
      // "/.next/",
    ],
    collectCoverageFrom: [
      '**/*.{ts,tsx}',
      '!**/node_modules/**',
      '!**/vendor/**',
      '!**/AuthContext.{js,jsx,ts,tsx}',
      '!**/UserContext.{js,jsx,ts,tsx}',
      '!**/cypress.config.{js,jsx,ts,tsx}',
      '!**/tailwind.config.{js,jsx,ts,tsx}',
      '!**/onboarding.{js,jsx,ts,tsx}',
      '!**/tpage/page.{js,jsx,ts,tsx}',
      '!**/welcome/page.{js,jsx,ts,tsx}',
      '!**/spec.cy.{js,jsx,ts,tsx}',
      '!**/firebase.{js,jsx,ts,tsx}',
      '!**/.next/types/app/layout.{js,jsx,ts,tsx}',
      '!**/.next/types/app/login/page.{js,jsx,ts,tsx}',
      '!**/app/head.{js,jsx,ts,tsx}',
      '!**/app/layout.{js,jsx,ts,tsx}',
      '!**/app/page.{js,jsx,ts,tsx}',
    ],
  }

 
// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config)