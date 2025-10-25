/** TailwindCSS configuration for the React app.
 * - Includes content paths for the React src files
 * - Extends theme colors to include the Royal Purple palette
 */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#8B5CF6",
        secondary: "#6B7280",
        success: "#10B981",
        error: "#EF4444",
        background: "#F3E8FF",
        surface: "#FFFFFF",
        text: "#374151",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
    },
  },
  plugins: [],
};
