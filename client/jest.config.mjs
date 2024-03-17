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
  setupFiles: ['./jest.setup.js'],
  transformIgnorePatterns: [
    "/node_modules/(?!jose)"
  ],
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: [
      "client/app/contexts",
      "client/.next",
      ".next/",
      "client/app/welcome",   // ignored due to swiper lib not being compatible with jest
      "client/app/emergencySituation/emergencySituation", // ignored due to swiper lib not being compatible with jest
      "client/app/moodjournal/viewMoodJournalsPage",  // ignored due to babel conflicts
      "client/app/moodjournal/page", // ignored due to babel conflicts
    ],
    collectCoverageFrom: [
      '**/*.{ts,tsx}',
      '!**/.next/**',
      '!**/node_modules/**',
      '!**/vendor/**',
      '!**/AuthContext.{js,jsx,ts,tsx}',
      '!**/UserContext.{js,jsx,ts,tsx}',
      '!**/tailwind.config.{js,jsx,ts,tsx}',
      '!**/welcome/**',     // ignored due to swiper lib not being compatible with jest
      '!**/app/emergencySituation/emergencySituation.{js,jsx,ts,tsx}',   // ignored due to swiper lib not being compatible with jest
      '!**/app/emergencySituation/page.{js,jsx,ts,tsx}',   // ignored due to swiper lib not being compatible with jest
      '!**/spec.cy.{js,jsx,ts,tsx}',
      '!**/firebase.{js,jsx,ts,tsx}',
      '!**/app/head.{js,jsx,ts,tsx}',
      '!**/app/layout.{js,jsx,ts,tsx}',
      '!**/app/moodjournal/viewMoodJournalsPage.{js,jsx,ts,tsx}',   // ignored due to babel conflicts
      `!**/app/moodjournal/page.{js,jsx,ts,tsx}`,   // ignored due to babel conflicts
    ],
  }

 
// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config)