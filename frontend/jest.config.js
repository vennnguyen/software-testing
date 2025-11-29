module.exports = {
  // Môi trường test (Giữ nguyên của bạn)
  testEnvironment: "jest-environment-jsdom",

  // Xử lý Babel (Giữ nguyên của bạn)
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },

  // Xử lý file CSS/SCSS (Giữ nguyên của bạn)
  moduleNameMapper: {
    "\\.(css|less|scss)$": "identity-obj-proxy",
  },

  // Các file setup (Giữ nguyên của bạn)
  setupFiles: ["<rootDir>/jest.env.js"],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // --- PHẦN QUAN TRỌNG CẦN THÊM ---

  // 1. Bỏ qua thư mục Cypress để không bị lỗi 'cy is not defined'
  testPathIgnorePatterns: [
    "/node_modules/",
    "<rootDir>/cypress/"
  ],

  // 2. Cấu hình phạm vi tính điểm Coverage (Chỉ tính trong src)
  collectCoverageFrom: [
    "src/**/*.{js,jsx}",
    "!src/index.js",
    "!src/main.jsx",
    "!src/reportWebVitals.js"
  ]
};